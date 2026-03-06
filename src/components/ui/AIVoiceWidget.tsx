"use client";

import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Terminal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AIVoiceWidget({ forceShow = false }: { forceShow?: boolean }) {
  const globalAiMode = useUIStore((state) => state.aiMode);
  const setAiMode = useUIStore((state) => state.setAiMode);
  const aiMode = forceShow || globalAiMode;
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Awaiting voice input...");

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
             currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          transcriptRef.current = currentTranscript;
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setAiResponse("Sorry, I didn't catch that. Please try again.");
          transcriptRef.current = "";
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcriptRef.current && transcriptRef.current !== "Listening...") {
            handleAnalyze(transcriptRef.current);
            transcriptRef.current = ""; // Prevent duplicate calls
          }
        };
      } else {
        setAiResponse("Speech recognition not supported in this browser.");
      }
    }
  }, []);

  const handlePointerDown = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault(); 
      e.stopPropagation();
    }
    if (recognitionRef.current && !isListening) {
      try {
        transcriptRef.current = "";
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript("Listening...");
      } catch (e) {
        console.error("Failed to start recognition, it might already be running.", e);
      }
    }
  };

  const handlePointerUp = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.error("Failed to stop recognition.", e);
      }
    }
  };

  const handleAnalyze = async (textToAnalyze: string) => {
    if (!textToAnalyze || textToAnalyze === "Listening...") return;
    
    setAiResponse("Processing prompt through Gemini...");
    
    try {
      const gRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      });

      const data = await gRes.json();
      
      if (!gRes.ok) {
        throw new Error(data.error || "Failed to generate content");
      }

      const reply = data.reply || "I'm having trouble thinking right now.";
      setAiResponse(reply);

      // Call our secure Next.js API route for ElevenLabs TTS
      const audioRes = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply })
      });

      if (!audioRes.ok) {
        throw new Error("Failed to fetch audio from server.");
      }

      const audioBlob = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsSpeaking(true);
      
      audio.onended = () => {
        setIsSpeaking(false);
        setTranscript("");
        URL.revokeObjectURL(audioUrl); // Clean up memory
      };

      audio.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsSpeaking(false);
      });

    } catch (error: any) {
      setAiResponse(`Error: ${error.message}`);
    }
  };

  return (
    <AnimatePresence>
      {aiMode && (
        <motion.div
          initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} 
          className="pointer-events-auto fixed right-6 md:right-12 top-1/2 -translate-y-1/2 w-full max-w-sm z-40"
        >
          {/* Main Widget Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpeaking ? 'bg-blue-400 animate-ping duration-300' : 'bg-emerald-400 animate-ping'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isSpeaking ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                </div>
                <span className={`text-xs font-mono uppercase tracking-wider ${isSpeaking ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {isSpeaking ? 'AI Speaking...' : 'System Online'}
                </span>
              </div>
              <button
                onClick={() => setAiMode(false)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Close AI Mode"
              >
                <X size={20} />
              </button>
            </div>

            {/* AI Text Display */}
            <div className="min-h-[120px] mb-6 rounded-lg border border-white/5 bg-black/50 p-4 relative">
               <Terminal className="absolute top-4 right-4 text-white/10" size={40} />
               <p className="text-sm text-slate-300 leading-relaxed font-mono relative z-10">
                 {aiResponse}
               </p>
            </div>

            {/* User Transcript */}
            <div className="mb-6 h-[40px] flex items-center">
               <p className="text-sm font-light italic text-slate-500 border-l-2 border-emerald-500/50 pl-3">
                 {transcript ? `"${transcript}"` : "..."}
               </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-auto">
              {/* Mic Button */}
              <button
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchEnd={handlePointerUp}
                onTouchCancel={handlePointerUp}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 touch-none select-none ${
                  isListening
                    ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                }`}
              >
                <Mic size={18} className={isListening ? "animate-pulse" : ""} />
                {isListening ? "Recording..." : "Hold to Speak"}
              </button>

              <button 
                 onClick={() => {
                   if (forceShow) {
                     window.location.href = '/'; 
                   } else {
                     setAiMode(false);
                   }
                 }}
                 className="flex-shrink-0 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
              >
                {forceShow ? "Back to Portfolio" : "Exit"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
