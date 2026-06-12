"use client";

import { useUIStore } from "@/store/useUIStore";
import { motion } from "framer-motion";
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
    <div
      aria-hidden={!aiMode}
      className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-8 px-6 md:pb-12"
      style={{
        opacity: aiMode ? 1 : 0,
        pointerEvents: aiMode ? "auto" : "none",
        transition: "opacity 0.8s ease-in-out",
      }}
    >
          {/* Subtle Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black/95 pointer-events-none" />

          {/* Error Banner — floating card, NOT inset-0 so it never blocks the mic */}
          {hasError && msgCount >= MAX_MESSAGES && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
              flex flex-col items-center gap-4
              bg-[#0a0b10] border-3 border-black text-center shadow-[6px_6px_0px_#7c3aed]
              px-8 py-8 max-w-sm w-[90vw]">
              <div className="font-mono text-xs uppercase tracking-widest text-[#7c3aed] mb-2">[LIMIT_EXCEEDED]</div>
              <p className="text-white/80 text-sm font-mono leading-relaxed">
                Session limit reached (10 messages). Come back tomorrow or reach out directly!
              </p>
              <a
                href="mailto:mohsin@codeflux.social"
                className="w-full mt-2 py-3 border-3 border-black bg-[#7c3aed] text-white hover:bg-[#6d28d9] font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all"
              >
                Send Email Protocol
              </a>
            </div>
          )}

          {/* Rate limit soft notice — small floating badge, doesn't block anything */}
          {msgCount >= MAX_MESSAGES && !hasError && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-[#0c0d14] border-2 border-black shadow-[3px_3px_0px_#7c3aed] pointer-events-none">
              <span className="text-white text-xs font-mono tracking-widest">
                [SYSTEM::COMMS::10_OF_10_LIMIT]
              </span>
            </div>
          )}

          {/* Exit Button - Top Right */}
          <div className="absolute top-8 right-8">
            <button
              onClick={() => {
                setAiMode(false);
              }}
              type="button"
              aria-label="Exit AI assistant"
              className="group flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-2 border-black font-mono text-xs font-bold px-4 py-2 shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all duration-150"
            >
              <X size={16} />
              <span>TERMINATE_COMMS</span>
            </button>
          </div>

          {/* Cinematic AI Conversation Log */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center h-[52vh]">
            <div 
              ref={scrollRef}
              className="w-full flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent"
              style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
              suppressHydrationWarning
            >
              {history.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ willChange: 'transform, opacity' }}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} w-full`}
                >
                  {msg.type === 'user' ? (
                    <div className="flex flex-col items-end w-full max-w-xl">
                      <div className="flex items-center justify-between border-2 border-b-0 border-black bg-black/60 px-3 py-1 font-mono text-[9px] text-[#00f0ff]/80 w-full rounded-t">
                        <span>[USER_COMMS::OUTBOUND]</span>
                        <span>SECURE_CH</span>
                      </div>
                      <div className="p-4 bg-[#11131e] border-2 border-black rounded-b shadow-[4px_4px_0px_#00f0ff] w-full text-sm font-mono text-slate-100">
                        &quot;{msg.text}&quot;
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start w-full max-w-2xl">
                      <div className="flex items-center justify-between border-2 border-b-0 border-black bg-black/60 px-3 py-1 font-mono text-[9px] text-[#7c3aed]/80 w-full rounded-t">
                        <span>[SYSTEM_AI::INBOUND]</span>
                        <span>ONLINE</span>
                      </div>
                      <div className="p-4 bg-[#0c0d14] border-2 border-black rounded-b shadow-[4px_4px_0px_#7c3aed] w-full text-sm md:text-base text-slate-200 leading-relaxed font-sans">
                        {msg.text}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* AI: Live streaming display */}
              {aiResponse !== "Awaiting voice input..." &&
                aiResponse !== "Analyzing..." &&
                !history.some(m => m.type === 'ai' && m.text === aiResponse) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-start w-full max-w-2xl"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="flex items-center justify-between border-2 border-b-0 border-black bg-black/60 px-3 py-1 font-mono text-[9px] text-[#7c3aed]/80 w-full rounded-t">
                    <span>[SYSTEM_AI::STREAMING]</span>
                    <span className="animate-pulse">▊ COMPILING</span>
                  </div>
                  <div className="p-4 bg-[#0c0d14] border-2 border-black rounded-b shadow-[4px_4px_0px_#7c3aed] w-full text-sm md:text-base text-slate-200 leading-relaxed font-sans">
                    <span>{aiResponse}</span>
                    <span className="inline-block w-2 h-4 bg-[#00f0ff] ml-1 animate-pulse align-middle" />
                  </div>
                </motion.div>
              )}

              {/* Dynamic Analyzing State */}
              {aiResponse === "Analyzing..." && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-start w-full max-w-md"
                >
                  <div className="flex items-center gap-2 border-2 border-black bg-black/60 px-3 py-2 font-mono text-[10px] text-[#7c3aed]/80 shadow-[4px_4px_0px_#000] w-full rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-ping" />
                    <span>COMPUTING_RESPONSE_MATRIX...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Live Audio Waveform Visualizer */}
          <AudioWaveform isSpeaking={isSpeaking} isListening={isListening} />

          {/* Glowing System Status Banner */}
          <div className="relative z-10 flex items-center gap-3 mb-6 px-4 py-1.5 bg-[#0a0b10] border-2 border-black shadow-[3px_3px_0px_#000]">
            <div className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpeaking ? 'bg-[#00f0ff] animate-ping' : (isListening ? 'bg-red-400 animate-ping' : 'bg-[#7c3aed] animate-pulse')}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpeaking ? 'bg-[#00f0ff]' : (isListening ? 'bg-red-500' : 'bg-[#7c3aed]')}`}></span>
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${isSpeaking ? 'text-[#00f0ff]' : (isListening ? 'text-red-400' : 'text-[#7c3aed]')}`}>
              <span>{isSpeaking ? 'SYS_SPEAKING' : (isListening ? 'RECEIVING_COMMS' : 'LINK_AWAITING_INPUT')}</span>
            </span>
          </div>

          {/* Hold to Speak Interaction Ring */}
          <div className="relative z-10 flex flex-col items-center justify-center group">
            <div className="relative flex items-center justify-center">
              {/* Concentric rotating tech rings */}
              <div className="absolute w-32 h-32 rounded-full border border-dashed border-[#7c3aed]/20 animate-spin" style={{ animationDuration: '25s' }} />
              <div className="absolute w-26 h-26 rounded-full border border-dashed border-[#00f0ff]/30 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
              
              {isListening && (
                <>
                  <motion.div animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }} className="absolute w-20 h-20 rounded-full border border-red-500/50" />
                  <motion.div animate={{ scale: [1, 2.4], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.2 }} className="absolute w-20 h-20 rounded-full border border-red-500/30" />
                </>
              )}
              {isSpeaking && (
                <>
                  <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute w-24 h-24 rounded-full border-t-2 border-b-2 border-[#00f0ff]/60" />
                </>
              )}

              <button
                onClick={handleToggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 touch-none select-none backdrop-blur-xl border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] ${
                  isListening
                    ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                    : isSpeaking
                      ? "bg-[#00f0ff] text-black shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                      : "bg-[#7c3aed] text-white hover:bg-[#6d28d9] cursor-pointer"
                }`}
              >
                {isListening ? (
                  <Activity size={28} className="animate-pulse" />
                ) : (
                  <Mic size={28} className={isSpeaking ? "animate-bounce" : "group-hover:scale-110 transition-transform"} />
                )}
              </button>
            </div>
          </div>

          {/* Transcript Guide */}
          <div className="h-[30px] mt-4 flex items-center justify-center w-full z-10">
             <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase font-bold">
               <span>{transcript ? transcript : (isListening ? "STOPPING_CAPTURE" : "INITIALIZE_VOICE_LINK")}</span>
             </div>
          </div>

    </div>
  );
}

// Sub-component for premium live audio wave visualizer
function AudioWaveform({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const barCount = 24;
  return (
    <div className="flex items-end justify-center gap-1.5 h-10 w-64 px-4 my-4 select-none">
      {Array.from({ length: barCount }).map((_, i) => {
        const duration = 0.4 + Math.random() * 0.6;
        const delay = i * 0.035;
        let scaleYRange = [0.15, 0.15];
        let color = "rgba(124, 58, 237, 0.25)"; // idle purple-gray
        let shadow = "none";

        if (isListening) {
          scaleYRange = [0.15, 0.9, 0.2, 1.0, 0.15];
          color = "#ef4444"; // red
          shadow = "0 0 8px rgba(239, 68, 68, 0.5)";
        } else if (isSpeaking) {
          scaleYRange = [0.1, 0.75, 0.15, 0.95, 0.1];
          color = "#00f0ff"; // cyber cyan
          shadow = "0 0 8px rgba(0, 240, 255, 0.5)";
        }

        return (
          <motion.div
            key={i}
            className="w-1.5 rounded-full"
            animate={isListening || isSpeaking ? {
              scaleY: scaleYRange,
            } : {
              scaleY: 0.15
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: "mirror",
              delay: delay,
              ease: "easeInOut"
            }}
            style={{
              height: "100%",
              backgroundColor: color,
              boxShadow: shadow,
              transformOrigin: "bottom",
              willChange: "transform"
            }}
          />
        );
      })}
    </div>
  );
}
