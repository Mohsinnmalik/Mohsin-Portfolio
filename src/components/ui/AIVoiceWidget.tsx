"use client";

import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Terminal, Activity } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AIVoiceWidget({ forceShow = false }: { forceShow?: boolean }) {
  const globalAiMode = useUIStore((state) => state.aiMode);
  const setAiMode = useUIStore((state) => state.setAiMode);
  const aiMode = forceShow || globalAiMode;
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Awaiting voice input...");
  const [history, setHistory] = useState<{ type: 'user' | 'ai', text: string }[]>([]);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, aiResponse]);

  // Initial Intro Logic
  useEffect(() => {
    if (aiMode && history.length === 0) {
      const introText = "Hi, this is Mohsin’s AI assistant. He builds intelligent web products that solve real-world problems. His work combines modern full-stack engineering with applied AI. You can explore his projects, journey, and technical initiatives here.";
      
      // Artificial delay for cinematic feel
      const timer = setTimeout(() => {
        setHistory([{ type: 'ai', text: introText }]);
        setAiResponse(introText);
        handleSpeak(introText);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [aiMode]);

  const handleSpeak = async (text: string) => {
    try {
      const audioRes = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!audioRes.ok) throw new Error("TTS Failed");

      const audioBlob = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.play();
    } catch (e) {
      console.error("Speak failed:", e);
    }
  };

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
    
    // Add user message to history
    setHistory(prev => [...prev, { type: 'user', text: textToAnalyze }]);
    setAiResponse("Analyzing...");
    
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
      setHistory(prev => [...prev, { type: 'ai', text: reply }]);

      // Use centralized speak handler
      handleSpeak(reply);

    } catch (error: any) {
      setAiResponse(`Error: ${error.message}`);
    }
  };

  return (
    <AnimatePresence>
      {aiMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }} 
          className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-end pb-8 px-6 md:pb-12"
        >
          {/* Subtle Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />

          {/* Exit Button - Top Right */}
          <div className="absolute top-8 right-8 pointer-events-auto">
            <button
              onClick={() => {
                if (forceShow) window.location.href = '/'; 
                else setAiMode(false);
              }}
              className="group flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 transition-all">
                <X size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono">Exit AI</span>
            </button>
          </div>

          {/* Cinematic AI Conversation Log */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center h-[55vh] pointer-events-auto">
            
            <div 
              ref={scrollRef}
              className="w-full flex-1 overflow-y-auto px-4 py-8 custom-scrollbar space-y-12"
              style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
            >
              {history.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-full`}
                >
                  {msg.type === 'user' ? (
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">User Input</span>
                       <p className="text-xl md:text-2xl font-mono text-white/60 text-right leading-relaxed italic">
                         "{msg.text}"
                       </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-3">
                       <span className="text-[10px] font-mono text-orange-500/60 tracking-[0.3em] uppercase">Mohsin AI</span>
                       <p className="text-2xl md:text-4xl font-light text-white/95 leading-tight tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] content-glow">
                         {msg.text}
                       </p>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Dynamic Analyzing State */}
              {aiResponse === "Analyzing..." && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-start gap-3"
                >
                  <span className="text-[10px] font-mono text-orange-500/60 tracking-[0.3em] uppercase">System</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-light text-white/40 italic">Generating response</span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Glowing System Status Banner */}
          <div className="relative z-10 flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpeaking ? 'bg-blue-400 animate-ping' : (isListening ? 'bg-red-400 animate-ping' : 'bg-orange-500 animate-pulse')}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpeaking ? 'bg-blue-500' : (isListening ? 'bg-red-500' : 'bg-orange-500')}`}></span>
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isSpeaking ? 'text-blue-400' : (isListening ? 'text-red-400' : 'text-orange-400')}`}>
              {isSpeaking ? 'AI Speaking' : (isListening ? 'Receiving Audio' : 'Awaiting Input')}
            </span>
          </div>

          {/* Hold to Speak Interaction Ring */}
          <div className="relative z-10 flex items-center justify-center pointer-events-auto group">
            
            {isListening && (
              <>
                <motion.div animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }} className="absolute w-20 h-20 rounded-full border border-red-500/50" />
                <motion.div animate={{ scale: [1, 2.5], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.2 }} className="absolute w-20 h-20 rounded-full border border-red-500/30" />
              </>
            )}
            {isSpeaking && (
              <>
                <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute w-24 h-24 rounded-full border-t border-b border-blue-500/40" />
              </>
            )}

            <button
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchEnd={handlePointerUp}
              onTouchCancel={handlePointerUp}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 touch-none select-none backdrop-blur-xl ${
                isListening
                  ? "bg-red-500/10 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-90"
                  : isSpeaking
                    ? "bg-blue-500/10 border border-blue-500/50"
                    : "bg-white/5 border border-white/20 hover:border-orange-500/50 hover:scale-105"
              }`}
            >
              {isListening ? (
                <Activity size={28} className="text-red-500 animate-pulse" />
              ) : (
                <Mic size={28} className={isSpeaking ? "text-blue-400" : "text-white/70 group-hover:text-orange-400 transition-colors"} />
              )}
            </button>
          </div>

          {/* Transcript Guide */}
          <div className="h-[30px] mt-4 flex items-center justify-center w-full z-10">
             <p className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
               {transcript ? transcript : (isListening ? "Listening..." : "Hold to speak")}
             </p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
