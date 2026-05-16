"use client";

import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Terminal, Activity } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";

export function AIVoiceWidget({ forceShow = false }: { forceShow?: boolean }) {
  const globalAiMode = useUIStore((state) => state.aiMode);
  const setAiMode = useUIStore((state) => state.setAiMode);
  const aiMode = forceShow || globalAiMode;
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Awaiting voice input...");
  const [history, setHistory] = useState<{ type: 'user' | 'ai', text: string }[]>([]);
  const [hasError, setHasError] = useState(false);
  // PERF: Rate limiting — max 10 messages per session via sessionStorage
  const [msgCount, setMsgCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(sessionStorage.getItem('ai_msg_count') || '0', 10);
  });
  const MAX_MESSAGES = 10;

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  // BUG-10 FIX: Track whether intro has been spoken — prevents re-firing on every message
  const introPlayedRef = useRef(false);
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

  const handleSpeak = useCallback(async (text: string) => {
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
      setIsSpeaking(false);
    }
  }, []);

  // Initial Intro Logic
  // BUG-10 FIX: introPlayedRef guards against re-firing when handleSpeak reference changes
  // (handleSpeak recreates on every msgCount change due to useCallback deps)
  useEffect(() => {
    if (aiMode && !introPlayedRef.current) {
      introPlayedRef.current = true;
      const introText = "Hi, this is Mohsin's AI assistant. He builds intelligent web products that solve real-world problems. His work combines modern full-stack engineering with applied AI. You can explore his projects, journey, and technical initiatives here.";
      
      // Artificial delay for cinematic feel
      const timer = setTimeout(() => {
        setHistory([{ type: 'ai', text: introText }]);
        setAiResponse(introText);
        handleSpeak(introText);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiMode]);

  const handleAnalyze = useCallback(async (textToAnalyze: string) => {
    if (!textToAnalyze || textToAnalyze === "Listening...") return;

    // Rate limiting: enforce max 10 messages per session
    if (msgCount >= MAX_MESSAGES) {
      setHasError(true);
      return;
    }

    // Increment rate limit counter immediately
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    sessionStorage.setItem('ai_msg_count', String(newCount));

    // Add user message atomically
    setHistory(prev => [...prev, { type: 'user', text: textToAnalyze }]);
    setAiResponse("Analyzing...");
    setHasError(false); // Always clear error state before a new request

    try {
      // AI: Try streaming route first
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      });

      // AI: If streaming fails, fall back to the standard /api/gemini route
      if (!res.ok || !res.body) {
        console.warn("Streaming failed, falling back to /api/gemini");
        const fallbackRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToAnalyze })
        });
        const data = await fallbackRes.json();
        if (!fallbackRes.ok) throw new Error(data.error || "API error");
        const reply = data.reply || "I'm having trouble thinking right now.";
        setHistory(prev => [...prev, { type: 'ai', text: reply }]);
        setAiResponse(reply);
        handleSpeak(reply);
        return;
      }

      // AI: Stream tokens — accumulate in local variable, display via setAiResponse
      // Commits ONE atomic setHistory entry after streaming completes (no mid-stream mutations)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullReply += chunk;
        // Update live streaming display — does NOT touch history array (no DOM key churn)
        setAiResponse(fullReply);
      }

      // Commit the complete message ONCE after stream ends — single atomic history update
      if (fullReply) {
        setHistory(prev => [...prev, { type: 'ai', text: fullReply }]);
        setAiResponse(fullReply);
        handleSpeak(fullReply);
      } else {
        // Empty response — try fallback
        throw new Error("Empty response from streaming");
      }

    } catch (error: any) {
      console.error("AI request failed:", error);
      // Show error inline in conversation instead of blocking overlay
      const errorMsg = "Sorry, I had a hiccup. Try asking again!";
      setHistory(prev => [...prev, { type: 'ai', text: errorMsg }]);
      setAiResponse(errorMsg);
    }
  }, [handleSpeak, msgCount]);



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
  }, [handleAnalyze]);

  const handleToggleListening = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Auto-clear error so user can speak again without hitting "Try again"
    if (hasError) setHasError(false);

    // If already listening, stop to trigger analysis
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Failed to stop recognition.", err);
        }
      }
    } else {
      // Start listening
      if (recognitionRef.current) {
        try {
          transcriptRef.current = "";
          recognitionRef.current.start();
          setIsListening(true);
          setTranscript("Listening...");
        } catch (e) {
          console.error("Failed to start recognition", e);
        }
      }
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

          {/* Error Banner — floating card, NOT inset-0 so it never blocks the mic */}
          {hasError && msgCount >= MAX_MESSAGES && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
              flex flex-col items-center gap-4 pointer-events-auto
              bg-[#0a0f1d]/95 backdrop-blur-xl rounded-3xl border border-orange-500/20
              px-8 py-8 max-w-sm w-[90vw] text-center shadow-2xl">
              <p className="text-white/70 text-base font-light">
                Session limit reached (10 messages). Come back tomorrow or reach out directly!
              </p>
              <a
                href="mailto:mohsin@codeflux.dev"
                className="px-6 py-3 rounded-xl bg-orange-500/10 border border-orange-500/50 text-orange-400 font-bold text-sm tracking-wide hover:bg-orange-500/20 transition-all"
              >
                Drop me an email instead →
              </a>
              {/* BUG-09 FIX: Removed 'Reset session' button — it let users trivially bypass
                  the 10-message rate limit with a single click */}
            </div>
          )}

          {/* Rate limit soft notice — small floating badge, doesn't block anything */}
          {msgCount >= MAX_MESSAGES && !hasError && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 pointer-events-none">
              <span className="text-orange-400 text-xs font-mono tracking-widest">
                10/10 messages used this session
              </span>
            </div>
          )}

          {/* Exit Button - Top Right */}
          <div className="absolute top-8 right-8 pointer-events-auto">
            <button
              onClick={() => {
                if (forceShow) window.location.href = '/'; 
                else setAiMode(false);
              }}
              className="group flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors duration-300"
            >
              <span className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 transition-all">
                <X size={20} />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono">Exit AI</span>
            </button>
          </div>

          {/* Cinematic AI Conversation Log */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center h-[55vh] pointer-events-auto">
            
            <div 
              ref={scrollRef}
              className="w-full flex-1 overflow-y-auto px-4 py-8 custom-scrollbar space-y-12"
              style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
              suppressHydrationWarning
            >
              {history.map((msg, i) => (
                <motion.div
                  key={i}
                  // PERF FIX: Replaced filter:blur(8px) with y+opacity — GPU composited only
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ willChange: 'transform, opacity' }}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-full`}
                >
                  {msg.type === 'user' ? (
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">User Input</span>
                       <div className="text-xl md:text-2xl font-mono text-white/60 text-right leading-relaxed italic">
                         <span>&quot;{msg.text}&quot;</span>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-3">
                       <span className="text-[10px] font-mono text-orange-500/60 tracking-[0.3em] uppercase">Mohsin AI</span>
                       <div className="text-2xl md:text-4xl font-light text-white/95 leading-tight tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] content-glow">
                         <span>{msg.text}</span>
                       </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* AI: Live streaming display — shows tokens as they arrive before committing to history */}
              {/* This only shows when aiResponse is actively being streamed (not yet in history) */}
              {aiResponse !== "Awaiting voice input..." &&
                aiResponse !== "Analyzing..." &&
                !history.some(m => m.type === 'ai' && m.text === aiResponse) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-start gap-3"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <span className="text-[10px] font-mono text-orange-500/60 tracking-[0.3em] uppercase">Mohsin AI ▊</span>
                  <div className="text-2xl md:text-4xl font-light text-white/95 leading-tight tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] content-glow">
                    <span>{aiResponse}</span>
                    {/* Blinking cursor while streaming */}
                    <span className="inline-block w-0.5 h-8 bg-orange-400 ml-1 animate-pulse align-middle" />
                  </div>
                </motion.div>
              )}

              {/* Dynamic Analyzing State — shown while waiting for first token */}
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
              <span>{isSpeaking ? 'AI Speaking' : (isListening ? 'Receiving Audio' : 'Awaiting Input')}</span>
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
              onClick={handleToggleListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 touch-none select-none backdrop-blur-xl ${
                isListening
                  ? "bg-red-500/10 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-90"
                  : isSpeaking
                    ? "bg-blue-500/10 border border-blue-500/50"
                    : "bg-white/5 border border-white/20 hover:border-orange-500/50 hover:scale-105 cursor-pointer"
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
             <div className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
               <span>{transcript ? transcript : (isListening ? "Tap to stop listening..." : "Tap to speak")}</span>
             </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
