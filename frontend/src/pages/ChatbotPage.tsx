import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessageItem } from '../components/chatbot/ChatMessageItem';
import { ChatInputArea } from '../components/chatbot/ChatInputArea';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { chatService } from '../services/chatService';
import { diseaseService } from '../services/diseaseService';
import { voiceService } from '../services/voiceService';
import { locationService, LocationEnvironment } from '../services/locationService';
import { ChatMessage, ScanRecord } from '../types';
import { BotMessageSquare, RotateCcw, Sparkles, MapPin, Volume2, Mic, Globe, FileText } from 'lucide-react';
import { Badge } from '../components/common/Badge';

const WELCOME_MESSAGES: Record<string, string> = {
  en: `Hello Farmer! 🌱 I am your **AgriSense AI Assistant**.\n\nAsk me anything about:\n* **Crop Diseases:** Blight, leaf curl, powdery mildew, blast disease.\n* **Safe Treatments:** Biological controls, copper sprays, and cultural practices.\n* **Government Schemes:** PM-KISAN, PMFBY crop insurance, SMAM machinery subsidies.\n* **GPS Treatment:** Enable location for region-specific advice!\n\n🎤 **Voice Input:** Tap the mic icon and ask in Tamil, Hindi, or English!\n\nHow may I help your fields today?`,

  ta: `வணக்கம் விவசாயி! 🌱 நான் உங்கள் **AgriSense AI உதவியாளர்**.\n\nகேளுங்கள்:\n* **பயிர் நோய்கள்:** கருகல், இலை சுருட்டல், மாவு பூஞ்சை\n* **சிகிச்சை முறை:** இயற்கை கட்டுப்பாடு, காப்பர் ஸ்பிரே\n* **அரசு திட்டங்கள்:** PM-KISAN, PMFBY காப்பீடு, KCC கடன்\n* **GPS சிகிச்சை:** உங்கள் இருப்பிடம் அனுமதித்தால் உள்ளூர் ஆலோசனை!\n\n🎤 **தமிழில் பேசுங்கள்:** மைக் பொத்தானை அழுத்தி கேளுங்கள்!\n\nஒரு நல்ல அறுவடை வாழ்த்துக்கள்! 🌾`,

  hi: `नमस्ते किसान भाई! 🌱 मैं आपका **AgriSense AI सहायक** हूँ।\n\nपूछें:\n* **फसल रोग:** झुलसा, पत्ती मुड़ना, पाउडरी फफूंद\n* **इलाज:** जैविक नियंत्रण, कॉपर स्प्रे\n* **सरकारी योजनाएं:** PM-KISAN, PMFBY बीमा, KCC लोन\n* **GPS इलाज:** अपनी जगह की अनुमति दें तो स्थानीय सलाह पाएं!\n\n🎤 **आवाज़ से पूछें:** माइक बटन दबाएं और हिंदी में बोलें!\n\nखेत लहलहाए, बड़ी फसल पाएं! 🌾`,

  te: `నమస్కారం రైతు మిత్రమా! 🌱 నేను మీ **AgriSense AI సహాయకుడిని**.\n\nమీకు సహాయపడతాను:\n* **పంట తెగుళ్లు:** బ్లైట్, ఆకు మడత, పౌడరీ మిల్డ్యూ\n* **నివారణ:** జీవ నియంత్రణ, కాపర్ స్ప్రే\n* **ప్రభుత్వ పథకాలు:** PM-KISAN, PMFBY బీమా\n\n🎤 **గళంతో అడగండి:** మైక్ బటన్ నొక్కి తెలుగులో మాట్లాడండి!\n\nమంచి దిగుబడి పొందండి! 🌾`
};

export const ChatbotPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationEnv, setLocationEnv] = useState<LocationEnvironment | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [latestScan, setLatestScan] = useState<ScanRecord | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Re-generate welcome message when language changes
  useEffect(() => {
    setMessages([{
      id: 'welcome-1',
      sender: 'assistant',
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
      timestamp: new Date().toISOString()
    }]);
  }, [language]);

  // The server also loads this scan for every chat request. Showing it here
  // makes the active diagnostic context obvious before the farmer asks.
  useEffect(() => {
    let active = true;
    diseaseService.getHistory()
      .then(scans => {
        if (active) setLatestScan(scans[0] || null);
      })
      .catch(() => {
        if (active) setLatestScan(null);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Request GPS location
  const handleRequestLocation = useCallback(async () => {
    setIsLocating(true);
    try {
      const gps = await locationService.getCurrentLocation();

      // Try to get better place name from reverse geocode
      let place;
      try {
        place = await locationService.reverseGeocode(gps.latitude, gps.longitude);
      } catch {}

      const env = locationService.getEnvironmentFromGPS(gps, place?.state);
      if (place?.label) env.locationLabel = place.label;

      setLocationEnv(env);
      showToast(`📍 GPS Location: ${env.locationLabel}`, 'success');

      // Send location context message to chat
      const locationMsg: ChatMessage = {
        id: `system-location-${Date.now()}`,
        sender: 'assistant',
        text: `📍 **Location Detected:** ${env.locationLabel}\n\n**Agroclimatic Profile:**\n* Region: ${env.zone}\n* Current Season: ${env.season}\n* Humidity Zone: ${env.humidity}\n* Soil Type: ${env.soilType}\n\n✅ All future disease advice will now be **customized for your ${env.state} region!**\n\n${language === 'ta' ? 'இனி உங்கள் பகுதிக்கு ஏற்ற சிகிச்சை பரிந்துரை பெறுவீர்கள்!' : ''}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, locationMsg]);
    } catch (err: any) {
      showToast(err.message || 'Failed to get GPS location', 'error');
    } finally {
      setIsLocating(false);
    }
  }, [language, showToast]);

  const handleSendMessage = async (text: string, image?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      image,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const replyText = await chatService.sendMessage(
        text,
        language,
        locationEnv || undefined,
        messages.map(({ sender, text: messageText }) => ({ sender, text: messageText }))
      );
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Auto TTS response if language is Tamil/Hindi
      if (language === 'ta' || language === 'hi') {
        setTtsActive(true);
        voiceService.speak(replyText, language).finally(() => setTtsActive(false));
      }
    } catch (e) {
      console.error('Chat error:', e);
      showToast('Could not get a response. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm(language === 'ta' ? 'உரையாடலை அழிக்கவா?' : 'Clear current conversation?')) {
      voiceService.stopSpeaking();
      setTtsActive(false);
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'assistant',
          text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const handleStopTTS = () => {
    voiceService.stopSpeaking();
    setTtsActive(false);
  };

  const handleAskAboutLatestScan = () => {
    if (!latestScan || isLoading) return;
    handleSendMessage(`Explain my latest ${latestScan.crop} scan and tell me the safest next steps.`);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Title & Controls Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <BotMessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {t('chat.title')}
              </h1>
              <Badge variant="emerald" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                Farmer AI
              </Badge>
              {locationEnv && (
                <Badge variant="amber" size="sm" icon={<MapPin className="w-3 h-3" />}>
                  {locationEnv.state}
                </Badge>
              )}
              {ttsActive && (
                <Badge variant="purple" size="sm" icon={<Volume2 className="w-3 h-3 animate-pulse" />}>
                  Speaking...
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t('chat.subtitle')}
              </p>
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Mic className="w-3 h-3" />
                {language === 'ta' ? 'தமிழ் குரல்' : language === 'hi' ? 'हिंदी वॉयस' : 'Voice-enabled'}
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : language === 'te' ? 'తెలుగు' : 'English'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {ttsActive && (
            <button
              onClick={handleStopTTS}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="Stop speaking"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-darkbg-input transition-colors"
            title={t('chat.clearChat')}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t('chat.clearChat')}</span>
          </button>
        </div>
      </div>

      {latestScan && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border border-agri-200 dark:border-agri-800 bg-agri-50/70 dark:bg-agri-950/25 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="w-4 h-4 text-agri-700 dark:text-agri-300 shrink-0" />
            <div className="min-w-0 text-xs">
              <p className="font-semibold text-agri-900 dark:text-agri-100 truncate">
                Latest scan: {latestScan.crop} - {latestScan.disease}
              </p>
              <p className="text-agri-700 dark:text-agri-300">
                {latestScan.confidence.toFixed(2)}% model confidence · {latestScan.severity}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAskAboutLatestScan}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-agri-800 dark:text-agri-200 border border-agri-300 dark:border-agri-700 hover:bg-agri-100 dark:hover:bg-agri-900/40 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask about this scan
          </button>
        </div>
      )}

      {/* Chat Messages Scrolling Area */}
      <div className="flex-1 overflow-y-auto bg-stone-50/50 dark:bg-darkbg-surface/50 border border-stone-200/80 dark:border-darkbg-border rounded-3xl p-4 sm:p-6 space-y-4 shadow-inner">
        {messages.map(msg => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 pl-11 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-agri-600 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:0.4s]" />
            <span>
              {language === 'ta'
                ? 'AgriSense AI சிந்திக்கிறது...'
                : language === 'hi'
                  ? 'AgriSense AI सोच रहा है...'
                  : 'AgriSense Assistant is formulating guidance...'}
            </span>
          </div>
        )}

        <div ref={chatScrollRef} />
      </div>

      {/* Input Control Bar */}
      <ChatInputArea
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        locationEnv={locationEnv}
        onRequestLocation={handleRequestLocation}
        isLocating={isLocating}
      />
    </div>
  );
};
