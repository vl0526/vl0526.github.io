import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "../../data/questions";
import { PowerUps } from "./PowerUps";

interface QuizInterfaceProps {
  questions: Question[];
  current: number;
  answers: Record<number, number>;
  score: number;
  done: boolean;
  banned: boolean;
  secondsLeft: number;
  fiftyUsed: boolean;
  freezeUsed: boolean;
  hintUsed: boolean;
  hiddenChoices: number[];
  onSelectChoice: (idx: number) => void;
  onNextQ: () => void;
  onPrevQ: () => void;
  onRestart: () => void;
  onUse5050: () => void;
  onUseFreeze: () => void;
  onUseHint: () => void;
  isAdmin: boolean;
  onResetCheat: () => void;
}

export const QuizInterface = ({
  questions,
  current,
  answers,
  score,
  done,
  banned,
  secondsLeft,
  fiftyUsed,
  freezeUsed,
  hintUsed,
  hiddenChoices,
  onSelectChoice,
  onNextQ,
  onPrevQ,
  onRestart,
  onUse5050,
  onUseFreeze,
  onUseHint,
  isAdmin,
  onResetCheat
}: QuizInterfaceProps) => {
  const q = questions[current];
  const total = questions.length;
  const answered = answers[current] !== undefined;
  const progressPct = Math.round(((current) / Math.max(1, total)) * 100);

  // Timer ring calculation
  const timerProgress = (secondsLeft / 20) * 283;
  const strokeDashoffset = 283 - timerProgress;

  if (banned) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="glass-effect rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-ban text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Tài khoản bị khóa</h2>
            <p className="text-red-200 mb-6">
              Bạn đã bị khóa vì vi phạm quy định BYFON. Chỉ admin mới có thể mở khóa.
            </p>
            {isAdmin && (
              <button 
                onClick={onResetCheat}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Mở khóa ngay
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="glass-effect rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-vn-gold to-vn-red rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <i className="fas fa-trophy text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold mb-4">Kết quả</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-vn-gold to-vn-red bg-clip-text text-transparent mb-2">
                {score}/{total}
              </div>
              <p className="text-xl text-gray-300">Bạn đã trả lời đúng {Math.round((score/total)*100)}% câu hỏi!</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl">
                <span>Điểm số:</span>
                <span className="font-bold text-vn-gold">{score * 100} điểm</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl">
                <span>Xếp hạng:</span>
                <span className="font-bold text-vn-green">
                  {score >= total * 0.8 ? "Xuất sắc" : score >= total * 0.6 ? "Tốt" : "Cần cố gắng"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onRestart}
                className="px-8 py-3 bg-gradient-to-r from-vn-green to-vn-blue hover:from-vn-blue hover:to-vn-green rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <i className="fas fa-redo mr-2"></i>
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Câu {current + 1}/{total}</span>
            <span className="text-sm font-medium text-gray-300">Điểm: {score}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-vn-green to-vn-blue h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Timer Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#374151" strokeWidth="8" fill="none"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="url(#timerGradient)" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="283" 
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B"/>
                  <stop offset="100%" stopColor="#DC2626"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-vn-gold">{secondsLeft}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={q?.id ?? "loading"}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="quiz-card glass-effect rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl"
          >
            {q && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                    {q.text}
                  </h2>
                  
                  {/* Power-ups */}
                  <PowerUps
                    fiftyUsed={fiftyUsed}
                    freezeUsed={freezeUsed}
                    hintUsed={hintUsed}
                    onFifty={onUse5050}
                    onFreeze={onUseFreeze}
                    onHint={onUseHint}
                  />
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0,1,2,3].map((idx) => {
                    const choice = q.choices[idx];
                    const selected = answers[current] === idx;
                    const isCorrect = q.answer === idx;
                    const showResult = answers[current] !== undefined;
                    const hidden = hiddenChoices.includes(idx);
                    
                    if (!choice || hidden) return null;
                    
                    let buttonClass = "choice-button w-full p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl text-left font-medium border border-gray-600 hover:border-gray-500 transition-all";
                    
                    if (showResult && selected) {
                      if (isCorrect) {
                        buttonClass = "choice-button w-full p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-left font-medium border border-green-500 text-white";
                      } else {
                        buttonClass = "choice-button w-full p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-left font-medium border border-red-500 text-white";
                      }
                    } else if (showResult && isCorrect) {
                      buttonClass = "choice-button w-full p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-left font-medium border border-green-500 text-white";
                    }
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => onSelectChoice(idx)} 
                        disabled={showResult} 
                        className={buttonClass}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                            idx === 0 ? 'bg-vn-red' : 
                            idx === 1 ? 'bg-vn-gold' : 
                            idx === 2 ? 'bg-vn-blue' : 'bg-vn-green'
                          }`}>
                            {"ABCD"[idx]}
                          </span>
                          <span>{choice}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (shown after answer) */}
                {answers[current] !== undefined && (
                  <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-check-circle text-green-400 mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-green-300 mb-1">
                          Đáp án đúng: <span className="font-bold">{"ABCD"[q.answer]}</span>
                        </h4>
                        {q.explanation && <p className="text-green-100 text-sm">Giải thích: {q.explanation}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {answers[current] !== undefined && (
                  <div className="flex justify-between mt-8">
                    <button 
                      onClick={onPrevQ}
                      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left mr-2"></i>
                      Câu trước
                    </button>
                    
                    <button 
                      onClick={onNextQ}
                      className="px-6 py-3 bg-gradient-to-r from-vn-green to-vn-blue hover:from-vn-blue hover:to-vn-green rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    >
                      Câu tiếp theo
                      <i className="fas fa-chevron-right ml-2"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
