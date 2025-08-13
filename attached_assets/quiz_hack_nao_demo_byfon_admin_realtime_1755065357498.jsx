import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================
// ⚙️ Quick Notes
// - Demo is front-end only. "Realtime" uses BroadcastChannel between tabs (open 2 tabs to see it)
// - Admin PIN (pretend IP-locked): 171224181202
// - BYFON anti-cheat: tab switching, blur, copy/paste, right-click, Ctrl+F/C/V
// - YouTube BGM: paste a YouTube URL in Settings
// - Power-ups: 50:50, Freeze 5s, Hint
// ==========================

const ADMIN_PIN = "171224181202"; // from requested IP, treated as PIN for demo
const CHANNEL_NAME = "quiz-broadcast-v1";
const BC = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

const defaultQuestions = [
  {
    id: 1,
    text: "Tôi càng lấy đi càng lớn. Tôi là gì?",
    choices: ["Ngọn lửa", "Cái hố", "Bóng tối", "Thời gian"],
    answer: 1,
    explanation: "Đào đất đi thì cái hố càng lớn."
  },
  {
    id: 2,
    text: "Sáng bốn chân, trưa hai chân, tối ba chân là gì?",
    choices: ["Chó", "Bàn", "Con người", "Bạch tuộc"],
    answer: 2,
    explanation: "Con người: bò lúc nhỏ, đi lúc trưởng thành, dùng gậy lúc già."
  },
  {
    id: 3,
    text: "Loại gì có cổ mà không có đầu?",
    choices: ["Chai", "Áo sơ mi", "Bình hoa", "Cả A và B"],
    answer: 3,
    explanation: "Cả chai và áo sơ mi đều có cổ."
  },
  {
    id: 4,
    text: "Cái gì càng rửa càng bẩn?",
    choices: ["Nước", "Khăn tắm", "Xà phòng", "Bồn rửa"],
    answer: 1,
    explanation: "Khăn tắm bẩn dần khi lau người."
  },
  {
    id: 5,
    text: "Cái gì chạy khắp nhà mà lúc nào cũng đứng yên?",
    choices: ["Dòng điện", "Cầu thang", "Mạng Wi‑Fi", "Âm thanh"],
    answer: 1,
    explanation: "Cầu thang: người chạy trên nó, bản thân nó đứng yên."
  },
  {
    id: 6,
    text: "Có 3 quả táo, bạn lấy 2. Bạn có bao nhiêu quả?",
    choices: ["1", "2", "3", "0"],
    answer: 1,
    explanation: "Bạn đã lấy 2 thì bạn đang có 2."
  },
  {
    id: 7,
    text: "Cái gì càng nhiều càng nhẹ?",
    choices: ["Không khí", "Kiến thức", "Lỗ thủng", "Lông vũ"],
    answer: 2,
    explanation: "Nhiều lỗ thủng thì đồ vật nhẹ đi."
  },
  {
    id: 8,
    text: "Thứ gì bạn có thể bắt nhưng không thể ném?",
    choices: ["Cảm lạnh", "Cá", "Bóng", "Tia chớp"],
    answer: 0,
    explanation: "Bạn " + "\"bắt\"" + " cảm lạnh nhưng không thể ném nó."
  },
  {
    id: 9,
    text: "Một anh chàng rơi từ thang 10 bậc mà không sao. Vì sao?",
    choices: ["Đeo mũ bảo hiểm", "Rơi từ bậc đầu tiên", "Thang đặt trên nước", "Thang bằng nhựa mềm"],
    answer: 1,
    explanation: "Rơi từ bậc thứ nhất thì chẳng sao."
  },
  {
    id: 10,
    text: "Bạn nhìn thấy thuyền đầy người, nhưng trên thuyền không có người độc thân. Vì sao?",
    choices: ["Là thuyền ma", "Tất cả đã kết hôn", "Phản chiếu trong gương", "Ảo giác"],
    answer: 1,
    explanation: "Không có người độc thân vì ai cũng đã kết hôn."
  },
  {
    id: 11,
    text: "Cái gì có nhiều răng mà không cắn?",
    choices: ["Bánh răng", "Lược", "Cưa", "Sao biển"],
    answer: 1,
    explanation: "Lược có nhiều răng nhưng không cắn."
  },
  {
    id: 12,
    text: "Một con gà trống đẻ trứng trên đỉnh nhà, trứng rơi về phía nào?",
    choices: ["Trước", "Sau", "Phải", "Không có trứng"],
    answer: 3,
    explanation: "Gà trống không đẻ trứng."
  },
  {
    id: 13,
    text: "Bạn bước vào phòng có que diêm, bếp dầu, đèn cầy, lò sưởi. Bạn bật thứ gì trước?",
    choices: ["Bếp dầu", "Đèn cầy", "Lò sưởi", "Que diêm"],
    answer: 3,
    explanation: "Phải bật que diêm trước."
  },
  {
    id: 14,
    text: "Tháng nào có 28 ngày?",
    choices: ["Chỉ tháng 2", "Tháng 2 và 8", "Mọi tháng", "Không tháng nào"],
    answer: 2,
    explanation: "Tháng nào cũng có ít nhất 28 ngày."
  },
  {
    id: 15,
    text: "Cái gì đi khắp thế giới mà vẫn ở một góc?",
    choices: ["Ánh sáng", "Tem thư", "Âm thanh", "Gió"],
    answer: 1,
    explanation: "Tem thư nằm ở góc phong bì, đi khắp thế giới."
  }
];

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const Toast = ({ msg, onClose }) => (
  <div className="fixed right-4 top-4 z-50">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-black/80 px-4 py-3 text-white shadow-xl">
      <div className="flex items-start gap-3">
        <div className="text-sm leading-5">{msg}</div>
        <button onClick={onClose} className="text-xs opacity-70 hover:opacity-100">Đóng</button>
      </div>
    </motion.div>
  </div>
);

export default function App() {
  const [questions, setQuestions] = useLocalStorage("quiz.questions", defaultQuestions);
  const [current, setCurrent] = useLocalStorage("quiz.current", 0);
  const [answers, setAnswers] = useLocalStorage("quiz.answers", {});
  const [score, setScore] = useLocalStorage("quiz.score", 0);
  const [done, setDone] = useLocalStorage("quiz.done", false);

  const [isAdmin, setIsAdmin] = useLocalStorage("quiz.admin", false);
  const [byfonOn, setByfonOn] = useLocalStorage("quiz.byfon", true);
  const [strikes, setStrikes] = useLocalStorage("quiz.strikes", 0);
  const [banned, setBanned] = useLocalStorage("quiz.banned", false);

  const [toast, setToast] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [fiftyUsed, setFiftyUsed] = useLocalStorage("quiz.power.5050", false);
  const [freezeUsed, setFreezeUsed] = useLocalStorage("quiz.power.freeze", false);
  const [hintUsed, setHintUsed] = useLocalStorage("quiz.power.hint", false);
  const [hiddenChoices, setHiddenChoices] = useState([]);

  const bcRef = useRef(BC);

  const q = questions[current];
  const total = questions.length;
  const answered = answers[current] !== undefined;

  // Realtime between tabs
  useEffect(() => {
    const bc = bcRef.current;
    if (!bc) return;
    bc.onmessage = (e) => {
      const { type, payload } = e.data || {};
      if (type === "toast") setToast(payload);
      if (type === "questions.update") {
        setQuestions(payload);
        setToast("Ngân hàng câu hỏi đã cập nhật (realtime)");
      }
      if (type === "ban") {
        setBanned(payload);
        setToast(payload ? "Tài khoản bị khóa do gian lận" : "Tài khoản đã được mở khóa");
      }
    };
    return () => {
      if (bc) bc.onmessage = null;
    };
  }, [setQuestions, setBanned]);

  // Timer per question (Speedrun Mode)
  useEffect(() => {
    if (done || banned) return;
    setSecondsLeft(20);
  }, [current, done, banned]);

  useEffect(() => {
    if (done || banned) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [current, done, banned]);

  useEffect(() => {
    if (done || banned) return;
    if (secondsLeft === 0) {
      // Auto move next
      setAnswers({ ...answers, [current]: -1 });
      setToast("Hết giờ. Chuyển câu tiếp theo.");
      setCurrent((i) => Math.min(total - 1, i + 1));
    }
  }, [secondsLeft]);

  // Anti-cheat: BYFON
  useEffect(() => {
    if (!byfonOn) return;

    const onBlur = () => handleStrike("Rời tab/ứng dụng");
    const onVis = () => {
      if (document.hidden) handleStrike("Chuyển tab hoặc thu nhỏ");
    };
    const onContext = (e) => {
      e.preventDefault();
      handleStrike("Chuột phải");
    };
    const onKey = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const bad = (ctrl && ["c", "v", "f"].includes(e.key.toLowerCase()));
      if (bad) {
        e.preventDefault();
        handleStrike("Tổ hợp phím bị cấm");
      }
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey);
    };
  }, [byfonOn, strikes, banned]);

  function handleStrike(reason) {
    if (!byfonOn || banned) return;
    const next = strikes + 1;
    setStrikes(next);
    setToast(`Cảnh báo ${next}/2: ${reason}`);
    bcRef.current?.postMessage({ type: "toast", payload: `Một người dùng bị cảnh báo (${next}/2)` });
    if (next >= 2) {
      setBanned(true);
      bcRef.current?.postMessage({ type: "ban", payload: true });
    }
  }

  function resetCheat() {
    setStrikes(0);
    setBanned(false);
    bcRef.current?.postMessage({ type: "ban", payload: false });
  }

  function selectChoice(idx) {
    if (banned || done) return;
    if (answers[current] !== undefined) return;

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
  }

  function use5050() {
    if (fiftyUsed || !q) return;
    const wrongIdx = [0,1,2,3].filter((i) => i !== q.answer);
    // hide two wrong randomly
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

  // Admin editor
  function tryAdmin() {
    const pin = prompt("Nhập PIN admin (gợi ý: IP)");
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      setToast("Admin chế độ đã mở");
    } else {
      setToast("Sai PIN");
    }
  }

  function saveQuestions(newQs) {
    setQuestions(newQs);
    bcRef.current?.postMessage({ type: "questions.update", payload: newQs });
  }

  function addQuestion() {
    const text = prompt("Nội dung câu hỏi?");
    if (!text) return;
    const a = prompt("Đáp án A?") ?? "";
    const b = prompt("Đáp án B?") ?? "";
    const c = prompt("Đáp án C?") ?? "";
    const d = prompt("Đáp án D?") ?? "";
    const ans = parseInt(prompt("Đáp án đúng (0=A,1=B,2=C,3=D)?") || "0", 10);
    const newQs = [
      ...questions,
      { id: Date.now(), text, choices: [a, b, c, d], answer: Math.max(0, Math.min(3, ans)), explanation: "" }
    ];
    saveQuestions(newQs);
  }

  function editQuestion(i) {
    const qq = questions[i];
    const text = prompt("Sửa nội dung", qq.text) ?? qq.text;
    const a = prompt("A", qq.choices[0]) ?? qq.choices[0];
    const b = prompt("B", qq.choices[1]) ?? qq.choices[1];
    const c = prompt("C", qq.choices[2]) ?? qq.choices[2];
    const d = prompt("D", qq.choices[3]) ?? qq.choices[3];
    const ans = parseInt(prompt("Đáp án đúng (0-3)", String(qq.answer)) || String(qq.answer), 10);
    const newQs = questions.slice();
    newQs[i] = { ...qq, text, choices: [a, b, c, d], answer: Math.max(0, Math.min(3, ans)) };
    saveQuestions(newQs);
  }

  function removeQuestion(i) {
    if (!confirm("Xóa câu hỏi này?")) return;
    const newQs = questions.filter((_, idx) => idx !== i);
    saveQuestions(newQs);
    if (current >= newQs.length) setCurrent(Math.max(0, newQs.length - 1));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) saveQuestions(data);
        else setToast("File không hợp lệ");
      } catch {
        setToast("Không đọc được file");
      }
    };
    reader.readAsText(file);
  }

  // YouTube bgm
  const [ytUrl, setYtUrl] = useLocalStorage("quiz.yt", "");
  const ytId = useMemo(() => {
    const m = ytUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : "";
  }, [ytUrl]);

  const progressPct = Math.round(((current) / Math.max(1, total)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-white/10 text-center leading-9">🧩</div>
          <div>
            <h1 className="text-xl font-bold">Quiz Hack Não</h1>
            <p className="text-xs opacity-70">BYFON • Admin • Realtime • Speedrun</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button onClick={tryAdmin} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Mở Admin</button>
          )}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsAdmin(false)} className="rounded-xl bg-emerald-500/20 px-3 py-2 text-sm hover:bg-emerald-500/30">Đóng Admin</button>
              <button onClick={addQuestion} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Thêm câu</button>
              <button onClick={exportJSON} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Xuất JSON</button>
              <label className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20 cursor-pointer">
                Nhập JSON
                <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
              </label>
              <button onClick={() => bcRef.current?.postMessage({ type: "toast", payload: "Thông báo realtime từ Admin" })} className="rounded-xl bg-indigo-500/20 px-3 py-2 text-sm hover:bg-indigo-500/30">Ping realtime</button>
              <button onClick={() => { setByfonOn(!byfonOn); setToast(`BYFON: ${!byfonOn ? "BẬT" : "TẮT"}`); }} className="rounded-xl bg-fuchsia-500/20 px-3 py-2 text-sm hover:bg-fuchsia-500/30">BYFON: {byfonOn ? "ON" : "OFF"}</button>
              <button onClick={resetCheat} className="rounded-xl bg-rose-500/20 px-3 py-2 text-sm hover:bg-rose-500/30">Mở khóa</button>
            </div>
          )}
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto mb-4 h-2 w-full max-w-5xl rounded-full bg-white/10 px-4">
        <div className="h-2 rounded-full bg-white/60" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Main */}
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-16 lg:grid-cols-3">
        {/* Left: Quiz */}
        <section className="lg:col-span-2">
          <div className="rounded-3xl bg-white/5 p-5 shadow-xl ring-1 ring-white/10">
            <div className="mb-2 flex items-center justify-between text-sm opacity-80">
              <div>Câu {current + 1}/{total}</div>
              <div>Điểm: {score}</div>
              <div>Thời gian: {secondsLeft}s</div>
            </div>

            {banned ? (
              <div className="rounded-2xl bg-rose-600/20 p-6 text-center">
                <div className="text-lg font-semibold">Bạn đã bị khóa vì gian lận (BYFON)</div>
                {!isAdmin && <div className="mt-2 text-sm opacity-80">Liên hệ Admin để mở khóa.</div>}
                {isAdmin && <button onClick={resetCheat} className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Mở khóa ngay</button>}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={q?.id ?? "done"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {!done && q && (
                    <>
                      <h2 className="mb-4 text-lg font-semibold leading-6">{q.text}</h2>
                      <div className="grid gap-3">
                        {[0,1,2,3].map((idx) => {
                          const choice = q.choices[idx];
                          const selected = answers[current] === idx;
                          const isCorrect = q.answer === idx;
                          const showResult = answers[current] !== undefined;
                          const hidden = hiddenChoices.includes(idx);
                          if (!choice || hidden) return null;
                          return (
                            <button key={idx} onClick={() => selectChoice(idx)} disabled={showResult} className={`rounded-2xl px-4 py-3 text-left ring-1 transition ${selected ? "bg-white/15 ring-white/30" : "bg-white/5 ring-white/10 hover:bg-white/10"} ${showResult && selected && (isCorrect ? "!bg-emerald-600/30" : "!bg-rose-600/30")}`}>
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 inline-block min-w-6 text-center text-xs opacity-70">{"ABCD"[idx]}</div>
                                <div className="text-sm">{choice}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* After answer */}
                      {answers[current] !== undefined && (
                        <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm">
                          <div>
                            Đáp án đúng: <span className="font-semibold">{"ABCD"[q.answer]}</span>
                          </div>
                          {q.explanation && <div className="mt-1 opacity-80">Giải thích: {q.explanation}</div>}
                          <div className="mt-3 flex items-center gap-2">
                            <button onClick={prevQ} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Trước</button>
                            <button onClick={nextQ} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Tiếp</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {done && (
                    <div className="rounded-2xl bg-emerald-500/10 p-6 text-center">
                      <div className="text-xl font-semibold">Xong bài</div>
                      <div className="mt-1 text-sm opacity-80">Điểm: {score}/{total}</div>
                      <button onClick={restart} className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Làm lại</button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Right: Tools */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl bg-white/5 p-5 shadow-xl ring-1 ring-white/10">
            <h3 className="mb-3 text-sm font-semibold">Power‑ups</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button onClick={use5050} disabled={fiftyUsed} className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50">50:50</button>
              <button onClick={useFreeze} disabled={freezeUsed} className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50">Freeze +5s</button>
              <button onClick={useHint} disabled={hintUsed} className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50">Hint</button>
            </div>
            <div className="mt-3 text-xs opacity-70">Mỗi loại dùng 1 lần.</div>
          </div>

          <div className="rounded-3xl bg-white/5 p-5 shadow-xl ring-1 ring-white/10">
            <h3 className="mb-3 text-sm font-semibold">Cài đặt</h3>
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between gap-2">
                <span>BYFON chống gian lận</span>
                <input type="checkbox" checked={byfonOn} onChange={(e) => setByfonOn(e.target.checked)} />
              </label>
              <div>
                <div className="mb-1">YouTube BGM URL</div>
                <input value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://youtu.be/..." className="w-full rounded-xl bg-black/30 px-3 py-2 text-xs outline-none ring-1 ring-white/10" />
                <div className="mt-2 text-xs opacity-70">Dán link để phát nhạc nền (tắt tiếng trên YouTube nếu cần).</div>
              </div>
              <div className="text-xs opacity-70">Cảnh báo: 2 lần là khóa tài khoản. Admin mới mở được.</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-5 shadow-xl ring-1 ring-white/10">
            <h3 className="mb-3 text-sm font-semibold">Danh sách câu hỏi</h3>
            <div className="max-h-64 overflow-auto rounded-2xl bg-black/20 p-2 text-xs">
              {questions.map((qq, i) => (
                <div key={qq.id} className={`flex items-center justify-between gap-2 rounded-xl px-2 py-1 ${i === current ? "bg-white/10" : ""}`}>
                  <button onClick={() => setCurrent(i)} className="truncate text-left">{i + 1}. {qq.text}</button>
                  {isAdmin && (
                    <div className="shrink-0">
                      <button onClick={() => editQuestion(i)} className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/20">Sửa</button>
                      <button onClick={() => removeQuestion(i)} className="ml-1 rounded bg-rose-500/20 px-2 py-0.5 hover:bg-rose-500/30">Xóa</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

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

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-4 pb-6 pt-4 text-center text-xs opacity-60">
        <div>Demo nâng cấp: Realtime BroadcastChannel + Speedrun + Power‑ups + BYFON + BGM</div>
      </footer>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast msg={toast} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );
}
