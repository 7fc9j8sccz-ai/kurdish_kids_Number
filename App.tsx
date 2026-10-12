import React, { useState, useRef, useEffect } from "react";
import { Volume2, Play, RotateCcw, Sparkles, Heart, Star, Music, Pause, HelpCircle, CheckCircle2, XCircle, Edit3, Award, Palette, ArrowRight } from "lucide-react";

// App Views
type AppView = "counting" | "quiz" | "tracing" | "stickers";
type QuizType = "find-number" | "count-items" | "simple-math";
type MathOp = "+" | "-" | "×";

interface NumberItem {
  id: number;
  digitKurdish: string;
  digitEn: number;
  word: string;
  speechText: string;
  colorName: string;
  colorHex: string;
  color: string;
  bgLight: string;
  borderColor: string;
  glowColor: string;
  soundFreq: number;
  emoji: string;
  stickerName: string;
}

const NUMBERS: NumberItem[] = [
  { id: 1, digitKurdish: "١", digitEn: 1, word: "یەک", speechText: "يَك", colorName: "شین", colorHex: "#1d4ed8", color: "#1d4ed8", bgLight: "#eff6ff", borderColor: "#3b82f6", glowColor: "rgba(59, 130, 246, 0.5)", soundFreq: 261.63, emoji: "🐰", stickerName: "کەروێشکی شین" },
  { id: 2, digitKurdish: "٢", digitEn: 2, word: "دوو", speechText: "دُو", colorName: "سەوز", colorHex: "#15803d", color: "#15803d", bgLight: "#f0fdf4", borderColor: "#22c55e", glowColor: "rgba(34, 197, 94, 0.5)", soundFreq: 293.66, emoji: "🕊️", stickerName: "کۆتری سەوز" },
  { id: 3, digitKurdish: "٣", digitEn: 3, word: "سێ", speechText: "سيه", colorName: "پرتەقاڵی", colorHex: "#c2410c", color: "#c2410c", bgLight: "#fff7ed", borderColor: "#f97316", glowColor: "rgba(249, 115, 22, 0.5)", soundFreq: 329.63, emoji: "🐟", stickerName: "ماسی پرتەقاڵی" },
  { id: 4, digitKurdish: "٤", digitEn: 4, word: "چوار", speechText: "چْوَار", colorName: "مۆر", colorHex: "#7e22ce", color: "#7e22ce", bgLight: "#faf5ff", borderColor: "#a855f7", glowColor: "rgba(168, 85, 247, 0.5)", soundFreq: 349.23, emoji: "🐘", stickerName: "فیلی مۆر" },
  { id: 5, digitKurdish: "٥", digitEn: 5, word: "پێنج", speechText: "پِينْج", colorName: "سوور", colorHex: "#b91c1c", color: "#b91c1c", bgLight: "#fef2f2", borderColor: "#ef4444", glowColor: "rgba(239, 68, 68, 0.5)", soundFreq: 392.00, emoji: "🐴", stickerName: "ئەسپی سوور" },
  { id: 6, digitKurdish: "٦", digitEn: 6, word: "شەش", speechText: "شَشْ", colorName: "شینی دەریایی", colorHex: "#0f766e", color: "#0f766e", bgLight: "#f0fdfa", borderColor: "#14b8a6", glowColor: "rgba(20, 184, 166, 0.5)", soundFreq: 440.00, emoji: "🐱", stickerName: "پشیلەی تەیرکواز" },
  { id: 7, digitKurdish: "٧", digitEn: 7, word: "حەوت", speechText: "حَوْت", colorName: "پەمەیی", colorHex: "#be185d", color: "#be185d", bgLight: "#fdf2f8", borderColor: "#ec4899", glowColor: "rgba(236, 72, 153, 0.5)", soundFreq: 493.88, emoji: "🦁", stickerName: "شێری پەمەیی" },
  { id: 8, digitKurdish: "٨", digitEn: 8, word: "هەشت", speechText: "هَشْت", colorName: "نیلی", colorHex: "#1e40af", color: "#1e40af", bgLight: "#eff6ff", borderColor: "#2563eb", glowColor: "rgba(37, 99, 235, 0.5)", soundFreq: 523.25, emoji: "🦋", stickerName: "پەپولەی نیلی" },
  { id: 9, digitKurdish: "٩", digitEn: 9, word: "نۆ", speechText: "نُو", colorName: "زەرد", colorHex: "#854d0e", color: "#854d0e", bgLight: "#fefce8", borderColor: "#eab308", glowColor: "rgba(234, 179, 8, 0.5)", soundFreq: 587.33, emoji: "🐻", stickerName: "ورچی زەرد" },
  { id: 10, digitKurdish: "١٠", digitEn: 10, word: "دە", speechText: "دَه", colorName: "تۆخ", colorHex: "#c2410c", color: "#c2410c", bgLight: "#fff7ed", borderColor: "#fb923c", glowColor: "rgba(251, 146, 60, 0.5)", soundFreq: 659.25, emoji: "⭐", stickerName: "ئەستێرەی زێڕین" },
];

export default function KurdishCountingApp() {
  const [currentView, setCurrentView] = useState<AppView>("counting");
  const [selectedNum, setSelectedNum] = useState<NumberItem | null>(null);
  const [autoPlaying, setAutoPlaying] = useState<boolean>(false);
  const [isCheering, setIsCheering] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [songPlaying, setSongPlaying] = useState<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sticker Book State
  const [unlockedStickers, setUnlockedStickers] = useState<number[]>([1]);
  const [starsCount, setStarsCount] = useState<number>(5);

  // Tracing Canvas State
  const [tracingNum, setTracingNum] = useState<NumberItem>(NUMBERS[0]);
  const [brushColor, setBrushColor] = useState<string>("#3b82f6");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Quiz Mode State
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizType, setQuizType] = useState<QuizType>("find-number");
  const [quizQuestion, setQuizQuestion] = useState<NumberItem | null>(null);
  const [mathA, setMathA] = useState<number>(2);
  const [mathB, setMathB] = useState<number>(3);
  const [mathOp, setMathOp] = useState<MathOp>("+");
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const autoPlayTimeoutRef = useRef<number | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playChime = (freq: number) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    } catch {}
  };

  const speakKurdishWord = (spokenText: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.lang = "ar-IQ";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectNumber = (item: NumberItem) => {
    if (quizMode && quizQuestion) {
      if (item.id === quizQuestion.id) {
        setQuizFeedback("correct");
        setQuizScore((prev) => prev + 1);
        playChime(item.soundFreq);
        speakKurdishWord("ئافەرین! زۆر باشە");
        setTimeout(() => {
          setQuizFeedback(null);
          generateNewQuestion();
        }, 1500);
      } else {
        setQuizFeedback("wrong");
        playChime(150);
        speakKurdishWord("دووبارە تاقی بکەرەوە");
        setTimeout(() => setQuizFeedback(null), 1200);
      }
      return;
    }

    setSelectedNum(item);
    playChime(item.soundFreq);
    speakKurdishWord(item.speechText);

    if (item.id === 10) {
      setIsCheering(true);
      setTimeout(() => setIsCheering(false), 3000);
    }
  };

  const generateNewQuestion = () => {
    if (quizType === "simple-math") {
      const ops: MathOp[] = ["+", "-", "×"];
      const chosenOp = ops[Math.floor(Math.random() * ops.length)];
      setMathOp(chosenOp);
      let a = 1, b = 1, result = 1;
      if (chosenOp === "+") {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) + 1;
        result = a + b;
      } else if (chosenOp === "-") {
        a = Math.floor(Math.random() * 7) + 3;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        result = a - b;
      } else {
        const multPairs = [[2, 2], [2, 3], [3, 2], [2, 4], [4, 2], [2, 5], [5, 2], [3, 3]];
        const pair = multPairs[Math.floor(Math.random() * multPairs.length)];
        a = pair[0]; b = pair[1]; result = a * b;
      }
      setMathA(a); setMathB(b);
      setQuizQuestion(NUMBERS.find(n => n.id === result) || NUMBERS[0]);
    } else {
      const randomIndex = Math.floor(Math.random() * NUMBERS.length);
      setQuizQuestion(NUMBERS[randomIndex]);
    }
  };

  const startQuiz = (type: QuizType) => {
    setQuizMode(true);
    setQuizType(type);
    setQuizScore(0);
    setQuizFeedback(null);
    setSelectedNum(null);
    generateNewQuestion();
    speakKurdishWord("با دەست پێبکەین");
  };

  const exitQuiz = () => {
    setQuizMode(false);
    setQuizQuestion(null);
    setQuizFeedback(null);
  };

  const startAutoCount = () => {
    if (autoPlaying) {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      setAutoPlaying(false);
      return;
    }
    setAutoPlaying(true);
    let index = 0;
    const runStep = () => {
      if (index >= NUMBERS.length) {
        setAutoPlaying(false);
        setIsCheering(true);
        setTimeout(() => setIsCheering(false), 3500);
        return;
      }
      const item = NUMBERS[index];
      setSelectedNum(item);
      playChime(item.soundFreq);
      speakKurdishWord(item.speechText);
      index++;
      autoPlayTimeoutRef.current = window.setTimeout(runStep, 1400);
    };
    runStep();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 font-sans select-none text-slate-800">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-amber-200 p-6 flex flex-col items-center gap-6 relative">
        <div className="w-full bg-amber-100/90 border-2 border-dashed border-amber-400 rounded-2xl py-3 px-6 text-center shadow-inner">
          <h1 className="text-2xl md:text-3xl font-extrabold text-sky-900 font-serif">
            ژماردنی ژمارەکان لە ١ تا ١٠
          </h1>
          <p className="text-sm md:text-base text-amber-900 font-medium mt-1">
            پێکەوە بە خۆشی ژمارەکان فێر دەبین! 😍
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full flex items-center justify-center gap-2 border-b pb-3 border-amber-200">
          <button
            onClick={() => { setCurrentView("counting"); setQuizMode(false); }}
            className={px-4 py-2 rounded-xl font-bold text-sm ${currentView === "counting" ? "bg-amber-400 text-sky-950 shadow-md" : "bg-white/80 text-slate-600"}}
          >
            🔢 ژماردنی ژمارەکان
          </button>
          <button
            onClick={() => { setCurrentView("tracing"); setQuizMode(false); }}
            className={px-4 py-2 rounded-xl font-bold text-sm ${currentView === "tracing" ? "bg-emerald-500 text-white shadow-md" : "bg-white/80 text-slate-600"}}
          >
            ✍️ هێڵکاری و نووسین
          </button>
          <button
            onClick={() => { setCurrentView("stickers"); setQuizMode(false); }}
            className={px-4 py-2 rounded-xl font-bold text-sm ${currentView === "stickers" ? "bg-rose-500 text-white shadow-md" : "bg-white/80 text-slate-600"}}
          >
            🎁 کتێبی ستیکەر ({starsCount} ⭐)
          </button>
        </div>

        {/* Tracing View */}
        {currentView === "tracing" && (
          <div className="w-full flex flex-col items-center gap-4 bg-emerald-50/80 p-5 rounded-2xl border-2 border-emerald-300">
            <h2 className="text-xl font-extrabold text-emerald-900">
              فێربوونی نووسینی ژمارە: «{tracingNum.word}» ({tracingNum.digitKurdish})
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {NUMBERS.map(n => (
                <button
                  key={n.id}
                  onClick={() => setTracingNum(n)}
                  className={px-3 py-1.5 rounded-lg font-black text-sm ${tracingNum.id === n.id ? "bg-emerald-600 text-white shadow" : "bg-white text-emerald-800 border"}}
                >
                  {n.digitKurdish}
                </button>
              ))}
            </div>
            <div className="relative w-72 h-72 bg-white rounded-3xl shadow-inner border-4 border-dashed border-emerald-400 flex items-center justify-center overflow-hidden touch-none">
              <span className="absolute text-9xl font-black text-slate-100 select-none pointer-events-none">
                {tracingNum.digitKurdish}
              </span>
              <canvas
                ref={canvasRef}
                width={288}
                height={288}
                onPointerDown={(e) => {
                  isDrawingRef.current = true;
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;
                  const rect = canvas.getBoundingClientRect();
                  ctx.beginPath();
                  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                }}
                onPointerMove={(e) => {
                  if (!isDrawingRef.current) return;
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;
                  const rect = canvas.getBoundingClientRect();
                  ctx.strokeStyle = brushColor;
                  ctx.lineWidth = 14;
                  ctx.lineCap = "round";
                  ctx.lineJoin = "round";
                  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                  ctx.stroke();
                }}
                onPointerUp={() => {
                  isDrawingRef.current = false;
                  playChime(tracingNum.soundFreq);
                }}
                className="w-full h-full cursor-crosshair relative z-10"
              />
            </div>
          </div>
        )}

        {/* Sticker Book */}
        {currentView === "stickers" && (
          <div className="w-full flex flex-col items-center gap-4 bg-rose-50/80 p-5 rounded-2xl border-2 border-rose-300">
            <h2 className="text-xl font-extrabold text-rose-900">
              کتێبی ستیکەر و دیارییەکان 🎁 ({starsCount} ئەستێرە ⭐)
            </h2>
            <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-3">
              {NUMBERS.map(n => {
                const isUnlocked = unlockedStickers.includes(n.id) || starsCount >= n.id;
                return (
                  <div key={n.id} className="flex flex-col items-center p-3 rounded-2xl border-2 bg-white shadow-md">
                    <span className="text-4xl">{isUnlocked ? n.emoji : "🔒"}</span>
                    <span className="mt-2 text-xs font-bold text-slate-700">{isUnlocked ? n.stickerName : "داخراوە"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Central Display */}
        {currentView === "counting" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-sky-50/80 rounded-2xl p-4 border border-sky-200">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-sky-400 overflow-hidden shadow-lg bg-sky-100 flex items-center justify-center">
                <img 
                  src="https://storage.googleapis.com/producer-app-public/producer/121291e0-9b08-4d20-bde9-67d6170259c6" 
                  alt="Cute child"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col justify-center items-center text-center p-4 bg-white rounded-2xl border-2 border-sky-300 shadow-md min-h-[140px]">
              {quizMode && quizQuestion ? (
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-lg font-black text-sky-900">
                    {quizType === "find-number" && ژمارە «${quizQuestion.word}» کامەیە؟}
                    {quizType === "count-items" && ئەم وێنانە چەند دانەن؟ بژمێرە:}
                    {quizType === "simple-math" && ${mathA} ${mathOp} ${mathB} = ؟}
                  </h3>
                  {quizType === "count-items" && (
                    <div className="flex gap-1 text-3xl">
                      {Array.from({ length: quizQuestion.id }).map((_, i) => (
                        <span key={i}>{quizQuestion.emoji}</span>
                      ))}
                    </div>
                  )}
                  {quizFeedback === "correct" && <span className="text-emerald-600 font-bold">ئافەرین! وەڵامەکەت ڕاستە! 🎉</span>}
                  {quizFeedback === "wrong" && <span className="text-rose-500 font-bold">هەڵەیە، دووبارە تاقی بکەرەوە! 😊</span>}
                </div>
              ) : selectedNum ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-6xl font-black" style={{ color: selectedNum.color }}>
                    {selectedNum.digitKurdish}
                  </span>
                  <span className="text-2xl font-bold">{selectedNum.word}</span>
                </div>
              ) : (
                <p className="text-lg font-bold text-sky-800">
                  سڵاو پەپولە جوانەکان! کرتە لە هەر ژمارەیەک بکە! 👇
                </p>
              )}
            </div>
          </div>
        )}

        {/* Numbers Grid (1 to 10) */}
        <div className="w-full grid grid-cols-5 gap-3">
          {NUMBERS.map((item) => (
            <button
              key={item.id}
              onPointerDown={() => handleSelectNumber(item)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 bg-white shadow hover:scale-105 active:scale-95 transition-all"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl border"
                style={{ color: item.color, backgroundColor: item.bgLight }}
              >
                {item.digitKurdish}
              </div>
              <span className="mt-1 font-bold text-sm" style={{ color: item.color }}>
                {item.word}
              </span>
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {quizMode ? (
            <button
              onClick={exitQuiz}
              className="px-5 py-2.5 rounded-full font-bold bg-rose-500 text-white shadow"
            >
              دەرچوون لە تاقیکردنەوە (خاڵ: {quizScore} ⭐)
            </button>
          ) : (
            <>
              <button
                onClick={() => startQuiz("find-number")}
                className="px-4 py-2 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300"
              >
                تاقیکردنەوەی دۆزینەوە
              </button>
              <button
                onClick={() => startQuiz("count-items")}
                className="px-4 py-2 rounded-full font-bold bg-indigo-100 text-indigo-900 border border-indigo-300"
              >
                تاقیکردنەوەی ژماردن
              </button>
              <button
                onClick={() => startQuiz("simple-math")}
                className="px-4 py-2 rounded-full font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"
              >
                تاقیکردنەوەی بیرکاری
              </button>
            </>
          )}

          <button
            onClick={startAutoCount}
            className={px-5 py-2.5 rounded-full font-bold text-white shadow ${autoPlaying ? "bg-rose-500" : "bg-emerald-500"}}
          >
            {autoPlaying ? "وەستاندن" : "ژماردنی ئۆتۆماتیکی"}
          </button>
        </div>

      </div>
    </div>
  );
}
```
