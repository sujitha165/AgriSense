/**
 * Voice Service - Real Web Speech API Integration
 * Supports Tamil (ta-IN), Telugu (te-IN), Hindi (hi-IN), English (en-IN)
 */

export type VoiceLang = 'ta-IN' | 'te-IN' | 'hi-IN' | 'en-IN';

const LANG_MAP: Record<string, VoiceLang> = {
  ta: 'ta-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN'
};

export const voiceService = {
  /**
   * Check if Speech Recognition is available
   */
  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  /**
   * Check if Speech Synthesis is available
   */
  isTTSSupported(): boolean {
    return 'speechSynthesis' in window;
  },

  /**
   * Start voice recognition and return transcript
   */
  startListening(
    lang: string = 'ta',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): (() => void) | null {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Voice recognition not supported in this browser. Please use Chrome.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[lang] || 'ta-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        'not-allowed': 'Microphone access denied. Please allow microphone permission.',
        'no-speech': 'No speech detected. Please speak clearly.',
        'network': 'Network error. Please check your connection.',
        'audio-capture': 'No microphone found. Please connect a microphone.',
        'aborted': 'Recording stopped.'
      };
      onError(errorMessages[event.error] || `Voice error: ${event.error}`);
    };

    recognition.onend = () => {
      // Recognition session ended
    };

    recognition.start();

    // Return stop function
    return () => {
      try { recognition.stop(); } catch (e) {}
    };
  },

  /**
   * Speak text in the specified language using TTS
   */
  speak(text: string, lang: string = 'ta', rate: number = 0.9): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('TTS not supported'));
        return;
      }

      // Cancel any current speech
      window.speechSynthesis.cancel();

      // Strip markdown formatting for better TTS
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6} /g, '')
        .replace(/\n\n/g, '. ')
        .replace(/\n/g, '. ')
        .replace(/\* /g, '')
        .replace(/\d+\. /g, '')
        .substring(0, 500); // Limit length for TTS

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = LANG_MAP[lang] || 'ta-IN';
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a voice for the language
      const voices = window.speechSynthesis.getVoices();
      const targetLang = LANG_MAP[lang] || 'ta-IN';
      const matchedVoice = voices.find(v => v.lang === targetLang) ||
                           voices.find(v => v.lang.startsWith(lang)) ||
                           voices.find(v => v.lang.includes('IN')) ||
                           null;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => resolve(); // Resolve even on error so UI doesn't hang

      window.speechSynthesis.speak(utterance);
    });
  },

  /**
   * Stop all speech
   */
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Get available voices for a language
   */
  getVoicesForLang(lang: string): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) return [];
    const voices = window.speechSynthesis.getVoices();
    const targetLang = LANG_MAP[lang] || 'ta-IN';
    return voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
  }
};
