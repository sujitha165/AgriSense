import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Image as ImageIcon, X, Sparkles, Volume2, VolumeX, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { voiceService } from '../../services/voiceService';
import { LocationEnvironment } from '../../services/locationService';

interface ChatInputAreaProps {
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
  locationEnv?: LocationEnvironment | null;
  onRequestLocation?: () => void;
  isLocating?: boolean;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSendMessage,
  isLoading,
  locationEnv,
  onRequestLocation,
  isLocating = false
}) => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [voiceSupported] = useState(voiceService.isSupported());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Language-specific suggested questions
  const suggestedQuestions = language === 'ta' ? [
    'தக்காளி இலையில் கருப்பு புள்ளி இருக்கு என்ன செய்வது?',
    'நெல் வயலில் பூஞ்சை தடுப்பு எப்படி?',
    'PM-KISAN திட்டம் விண்ணப்பிக்க எப்படி?',
    'இயற்கை முறையில் பூச்சி கட்டுப்பாடு',
    'மண் வளம் அதிகரிக்க என்ன செய்வது?'
  ] : language === 'hi' ? [
    'टमाटर की पत्तियों पर भूरे धब्बे हैं, क्या करें?',
    'धान में कवक रोग से कैसे बचें?',
    'जैविक खेती कैसे करें?',
    'फसल बीमा कैसे लें?',
    'मिट्टी की उर्वरता कैसे बढ़ाएं?'
  ] : [
    'What is wrong with my tomato plant?',
    'How can I prevent leaf diseases organically?',
    'What should I do after detecting early blight?',
    'What government schemes are available for farmers?',
    'How do I improve soil health naturally?'
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingRef.current?.();
      voiceService.stopSpeaking();
    };
  }, []);

  const handleSend = () => {
    const finalText = text.trim() || interimText.trim();
    if ((!finalText && !attachedImage) || isLoading) return;
    onSendMessage(finalText, attachedImage || undefined);
    setText('');
    setInterimText('');
    setAttachedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceRecording = useCallback(() => {
    if (!voiceSupported) {
      showToast('Voice input requires Google Chrome browser', 'error');
      return;
    }

    setIsRecording(true);
    setInterimText('');
    showToast(
      language === 'ta' ? 'தமிழில் பேசுங்கள்...' :
      language === 'hi' ? 'हिंदी में बोलें...' : 'Listening... Speak clearly',
      'info'
    );

    const stopFn = voiceService.startListening(
      language,
      (transcript, isFinal) => {
        if (isFinal) {
          setText(transcript);
          setInterimText('');
          setIsRecording(false);
          stopRecordingRef.current = null;
          showToast(
            language === 'ta' ? 'குரல் பதிவு முடிந்தது!' :
            language === 'hi' ? 'आवाज़ रिकॉर्ड हो गई!' : 'Voice captured!',
            'success'
          );
        } else {
          setInterimText(transcript);
        }
      },
      (error) => {
        setIsRecording(false);
        setInterimText('');
        stopRecordingRef.current = null;
        showToast(error, 'error');
      }
    );

    stopRecordingRef.current = stopFn;
  }, [language, voiceSupported, showToast]);

  const stopVoiceRecording = useCallback(() => {
    stopRecordingRef.current?.();
    stopRecordingRef.current = null;
    setIsRecording(false);
    setInterimText('');
  }, []);

  const toggleVoice = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleSuggestedQuestion = (q: string) => {
    onSendMessage(q);
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedImage(url);
      showToast(language === 'ta' ? 'இலை புகைப்படம் இணைக்கப்பட்டது' : 'Leaf photo attached to message', 'info');
    }
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    }
    setTtsEnabled(prev => !prev);
    showToast(ttsEnabled ? 'Voice response disabled' : 'Voice response enabled', 'info');
  };

  const displayText = interimText || text;

  return (
    <div className="space-y-3">
      {/* GPS Location Status Bar */}
      {locationEnv ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-emerald-700 dark:text-emerald-300 font-medium flex-1 truncate">
            📍 {locationEnv.state} | {locationEnv.season} | {locationEnv.humidity} zone
          </span>
          <span className="text-emerald-500 text-[10px]">GPS Active</span>
        </div>
      ) : onRequestLocation && (
        <button
          onClick={onRequestLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-3 py-2 w-full bg-stone-50 dark:bg-darkbg-input hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-stone-200 dark:border-darkbg-border hover:border-emerald-300 dark:hover:border-emerald-800 rounded-xl text-xs transition-colors group"
        >
          {isLocating ? (
            <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 shrink-0 transition-colors" />
          )}
          <span className="text-stone-500 dark:text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
            {isLocating
              ? 'Getting GPS location...'
              : language === 'ta'
                ? '📍 GPS இருப்பிடம் பெற்று உள்ளூர் சிகிச்சை பரிந்துரை பெறவும்'
                : '📍 Enable GPS for location-specific treatment advice'
            }
          </span>
        </button>
      )}

      {/* Suggested Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="flex items-center gap-1 font-semibold text-stone-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-agri-600" />
          {language === 'ta' ? 'கேள்விகள்:' : language === 'hi' ? 'सुझाव:' : 'Suggestions:'}
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestedQuestion(q)}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-darkbg-card hover:bg-agri-50 dark:hover:bg-darkbg-input border border-stone-200 dark:border-darkbg-border text-stone-700 dark:text-stone-300 shrink-0 text-xs transition-colors shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Image Attachment Preview */}
      {attachedImage && (
        <div className="flex items-center gap-2 p-2 bg-stone-100 dark:bg-darkbg-input rounded-xl max-w-xs border border-stone-200 dark:border-darkbg-border">
          <img src={attachedImage} alt="Attachment" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-xs text-stone-600 dark:text-stone-300 truncate flex-1">
            {language === 'ta' ? 'இலை படம் இணைக்கப்பட்டது' : 'Leaf photo attached'}
          </span>
          <button onClick={() => setAttachedImage(null)} className="text-stone-400 hover:text-stone-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice Recording Active Indicator */}
      {isRecording && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-xl animate-pulse">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs text-rose-700 dark:text-rose-300 font-medium flex-1">
            {language === 'ta' ? '🎤 தமிழில் பேசுங்கள்...' :
             language === 'hi' ? '🎤 हिंदी में बोलें...' :
             language === 'te' ? '🎤 తెలుగులో మాట్లాడండి...' : '🎤 Listening... Speak clearly'}
          </span>
          {interimText && (
            <span className="text-xs text-rose-600 dark:text-rose-400 italic truncate max-w-[200px]">"{interimText}"</span>
          )}
          <button onClick={stopVoiceRecording} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">
            Stop
          </button>
        </div>
      )}

      {/* Main Input Bar */}
      <div className="flex items-center gap-2 bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-2 shadow-sm focus-within:border-agri-500 focus-within:shadow-agri-500/10 focus-within:shadow-md transition-all">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageAttach}
          accept="image/*"
          className="hidden"
        />

        {/* Attach Image */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-darkbg-border rounded-xl transition-colors shrink-0"
          title={t('chat.attachImage')}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleVoice}
          className={`p-2 rounded-xl transition-all shrink-0 relative ${
            isRecording
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : voiceSupported
                ? 'text-stone-400 hover:text-agri-600 hover:bg-agri-50 dark:hover:bg-darkbg-border'
                : 'text-stone-300 cursor-not-allowed'
          }`}
          title={isRecording ? 'Stop recording' : `Voice input (${language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English'})`}
          disabled={!voiceSupported}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isRecording && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
          )}
        </button>

        {/* TTS Toggle */}
        <button
          type="button"
          onClick={toggleTTS}
          className={`p-2 rounded-xl transition-all shrink-0 ${
            ttsEnabled
              ? 'text-agri-600 dark:text-agri-400 hover:bg-agri-50 dark:hover:bg-darkbg-border'
              : 'text-stone-300 hover:bg-stone-100 dark:hover:bg-darkbg-border'
          }`}
          title={ttsEnabled ? 'Disable voice response' : 'Enable voice response'}
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={displayText}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording
              ? (language === 'ta' ? 'தமிழில் பேசுங்கள்...' : language === 'hi' ? 'बोलें...' : 'Listening...')
              : language === 'ta'
                ? 'தமிழில் கேளுங்கள்... (பயிர் நோய், மண், உரம்)'
                : t('chat.placeholder')
          }
          className={`flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm placeholder-stone-400 resize-none py-1.5 ${
            interimText
              ? 'text-stone-400 dark:text-stone-500 italic'
              : 'text-stone-900 dark:text-stone-100'
          }`}
          readOnly={isRecording && !!interimText}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || (!displayText.trim() && !attachedImage)}
          className="p-2.5 rounded-xl bg-agri-600 hover:bg-agri-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs shadow-agri-600/30 transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Voice not supported warning */}
      {!voiceSupported && (
        <p className="text-[10px] text-stone-400 text-center">
          Voice input requires Chrome. Use text input or switch to Chrome browser.
        </p>
      )}
    </div>
  );
};
