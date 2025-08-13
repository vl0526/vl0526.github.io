import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { defaultQuestions, Question } from "../data/questions";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useBroadcastChannel } from "../hooks/useBroadcastChannel";
import { useAntiCheat } from "../hooks/useAntiCheat";
import { QuizInterface } from "../components/quiz/QuizInterface";
import { AdminPanel } from "../components/quiz/AdminPanel";
import { Toast } from "../components/quiz/Toast";
import { BYFONModal } from "../components/quiz/BYFONModal";

const ADMIN_PIN = "171224181202";

export default function QuizPage() {
  const [questions, setQuestions] = useLocalStorage("quiz.questions", defaultQuestions);
  const [current, setCurrent] = useLocalStorage("quiz.current", 0);
  const [answers, setAnswers] = useLocalStorage("quiz.answers", {});
  const [score, setScore] = useLocalStorage("quiz.score", 0);
  const [done, setDone] = useLocalStorage("quiz.done", false);

  const [isAdmin, setIsAdmin] = useLocalStorage("quiz.admin", false);
  const [byfonOn, setByfonOn] = useLocalStorage("quiz.byfon", true);
  const [strikes, setStrikes] = useLocalStorage("quiz.strikes", 0);
  const [banned, setBanned] = useLocalStorage("quiz.banned", false);

  const [toast, setToast] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [fiftyUsed, setFiftyUsed] = useLocalStorage("quiz.power.5050", false);
  const [freezeUsed, setFreezeUsed] = useLocalStorage("quiz.power.freeze", false);
  const [hintUsed, setHintUsed] = useLocalStorage("quiz.power.hint", false);
  const [hiddenChoices, setHiddenChoices] = useState<number[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showBYFON, setShowBYFON] = useState(false);

  const [ytUrl, setYtUrl] = useLocalStorage("quiz.yt", "");

  const q = questions[current];
  const total = questions.length;

  // YouTube ID extraction
  const ytId = useMemo(() => {
    const m = ytUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : "";
  }, [ytUrl]);

  // Broadcast channel for real-time communication
  const { postMessage } = useBroadcastChannel((data) => {
    const { type, payload } = data || {};
    if (type === "toast") setToast(payload);
    if (type === "questions.update") {
      setQuestions(payload);
      setToast("Ngân hàng câu hỏi đã cập nhật (realtime)");
    }
    if (type === "ban") {
      setBanned(payload);
      setToast(payload ? "Tài khoản bị khóa do gian lận" : "Tài khoản đã được mở khóa");
    }
  });

  // Timer per question
  useEffect(() => {
    if (done || banned) return;
    setSecondsLeft(20);
  }, [current, done, banned]);

  useEffect(() => {
    if (done || banned || freezeUsed) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [current, done, banned, freezeUsed]);

  useEffect(() => {
    if (done || banned) return;
    if (secondsLeft === 0) {
      // Auto move next
      setAnswers({ ...answers, [current]: -1 });
      setToast("Hết giờ. Chuyển câu tiếp theo.");
      setCurrent((i) => Math.min(total - 1, i + 1));
    }
  }, [secondsLeft, done, banned, answers, current, total]);

  // Anti-cheat system
  const handleStrike = (reason: string) => {
    if (!byfonOn || banned) return;
    const next = strikes + 1;
    setStrikes(next);
    setToast(`Cảnh báo ${next}/2: ${reason}`);
    setShowBYFON(true);
    postMessage({ type: "toast", payload: `Một người dùng bị cảnh báo (${next}/2)` });
    if (next >= 2) {
      setBanned(true);
      postMessage({ type: "ban", payload: true });
    }
  };

  useAntiCheat({
    enabled: byfonOn,
    onStrike: handleStrike,
    banned
  });

  function resetCheat() {
    setStrikes(0);
    setBanned(false);
    postMessage({ type: "ban", payload: false });
  }

  function selectChoice(idx: number) {
    if (banned || done || answers[current] !== undefined) return;

    const correct = q.answer === idx;
    const newAnswers = { ...answers, [current]: idx };
    setAnswers(newAnswers);
    if (correct) setScore(score + 1);
  }

  function nextQ() {
    if (current + 1 < total) setCurrent(current + 1);
    else setDone(true);
    setHiddenChoices([]);
  }

  function prevQ() {
    if (current > 0) setCurrent(current - 1);
  }

  function restart() {
    setCurrent(0);
    setAnswers({});
    setScore(0);
    setDone(false);
    setHiddenChoices([]);
    setStrikes(0);
    setBanned(false);
    setFiftyUsed(false);
    setFreezeUsed(false);
    setHintUsed(false);
  }

  function use5050() {
    if (fiftyUsed || !q) return;
    const wrongIdx = [0,1,2,3].filter((i) => i !== q.answer);
    const shuffled = wrongIdx.sort(() => 0.5 - Math.random());
    setHiddenChoices(shuffled.slice(0, 2));
    setFiftyUsed(true);
  }

  function useFreeze() {
    if (freezeUsed) return;
    setFreezeUsed(true);
    const prev = secondsLeft;
    setSecondsLeft(prev + 5);
    setToast("Đóng băng thời gian +5s");
  }

  function useHint() {
    if (hintUsed) return;
    setHintUsed(true);
    setToast("Gợi ý: " + (q?.explanation || "Suy luận logic"));
  }

  function tryAdmin() {
    setShowAdmin(true);
  }

  function authenticateAdmin(pin: string) {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      setToast("Admin chế độ đã mở");
      return true;
    } else {
      setToast("Sai PIN");
      return false;
    }
  }

  function saveQuestions(newQs: Question[]) {
    setQuestions(newQs);
    postMessage({ type: "questions.update", payload: newQs });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '20%', left: '80%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ top: '60%', left: '20%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ top: '80%', left: '70%', animationDelay: '6s' }}></div>
        <div className="particle" style={{ top: '40%', left: '90%', animationDelay: '8s' }}></div>
      </div>

      {/* Background Pattern Overlay */}
      <div className="fixed inset-0 bg-pattern opacity-50 z-0"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-vn-red to-vn-gold rounded-xl flex items-center justify-center">
                  🧩
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-vn-gold to-vn-red bg-clip-text text-transparent">
                    Quiz Hack Não
                  </h1>
                  <p className="text-xs text-gray-400">BYFON • Admin • Realtime • Speedrun</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center space-x-4">
                {/* BYFON Status */}
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${byfonOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-300">BYFON {byfonOn ? 'ON' : 'OFF'}</span>
                </div>

                {/* Real-time Status */}
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Realtime</span>
                </div>

                {/* Admin Button */}
                {!isAdmin && (
                  <button 
                    onClick={tryAdmin}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 admin-glow"
                  >
                    Mở Admin
                  </button>
                )}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsAdmin(false)}
                      className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-sm"
                    >
                      Đóng Admin
                    </button>
                    <button 
                      onClick={() => setShowAdmin(true)}
                      className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm"
                    >
                      Panel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Quiz Interface */}
        <QuizInterface
          questions={questions}
          current={current}
          answers={answers}
          score={score}
          done={done}
          banned={banned}
          secondsLeft={secondsLeft}
          fiftyUsed={fiftyUsed}
          freezeUsed={freezeUsed}
          hintUsed={hintUsed}
          hiddenChoices={hiddenChoices}
          onSelectChoice={selectChoice}
          onNextQ={nextQ}
          onPrevQ={prevQ}
          onRestart={restart}
          onUse5050={use5050}
          onUseFreeze={useFreeze}
          onUseHint={useHint}
          isAdmin={isAdmin}
          onResetCheat={resetCheat}
        />

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
            <p>&copy; 2024 Quiz Hack Não. Được phát triển với ❤️ cho cộng đồng Việt Nam.</p>
          </div>
        </footer>
      </div>

      {/* YouTube Embed */}
      {ytId && (
        <div className="fixed inset-x-0 bottom-2 flex justify-center opacity-70 hover:opacity-100">
          <div className="rounded-2xl bg-black/40 p-2 text-xs ring-1 ring-white/10">
            <div className="mb-1 text-center">BGM đang phát</div>
            <iframe
              className="h-28 w-48 rounded-xl"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdmin}
        isAuthenticated={isAdmin}
        questions={questions}
        onClose={() => setShowAdmin(false)}
        onAuthenticate={authenticateAdmin}
        onSaveQuestions={saveQuestions}
        onResetCheat={resetCheat}
        byfonOn={byfonOn}
        onToggleByfon={setByfonOn}
        onBroadcast={postMessage}
      />

      {/* BYFON Warning Modal */}
      <BYFONModal
        isOpen={showBYFON}
        strikes={strikes}
        onClose={() => setShowBYFON(false)}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
