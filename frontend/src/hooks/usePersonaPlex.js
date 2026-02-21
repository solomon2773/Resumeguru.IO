import { useState, useRef, useCallback, useEffect } from "react";

/**
 * PersonaPlex hook - manages avatar and speech.
 *
 * On NVIDIA GPU: uses PersonaPlex server for TTS/ASR and avatar animation
 * On Apple Silicon / CPU: falls back to browser Web Speech API
 */
export function usePersonaPlex(capabilities) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const useBrowserSpeech =
    !capabilities?.tts_available || !capabilities?.asr_available;

  // Initialize browser speech as fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (useBrowserSpeech && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, [useBrowserSpeech]);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    if (useBrowserSpeech) {
      // Browser Web Speech API fallback
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
    // PersonaPlex ASR handled via WebSocket audio stream
  }, [useBrowserSpeech]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (useBrowserSpeech && synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a female voice
        const voices = synthRef.current.getVoices();
        const femaleVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Female") ||
              v.name.includes("Samantha") ||
              v.name.includes("Karen"))
        );
        if (femaleVoice) utterance.voice = femaleVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
      }
      // PersonaPlex TTS handled server-side
    },
    [useBrowserSpeech]
  );

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    setTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    useBrowserSpeech,
  };
}
