import { useState } from "react";
import { Question } from "../../data/questions";

interface AdminPanelProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  questions: Question[];
  onClose: () => void;
  onAuthenticate: (pin: string) => boolean;
  onSaveQuestions: (questions: Question[]) => void;
  onResetCheat: () => void;
  byfonOn: boolean;
  onToggleByfon: (enabled: boolean) => void;
  onBroadcast: (message: any) => void;
}

const ADMIN_PIN = "171224181202";

export const AdminPanel = ({ 
  isOpen, 
  isAuthenticated, 
  questions, 
  onClose, 
  onAuthenticate, 
  onSaveQuestions, 
  onResetCheat,
  byfonOn,
  onToggleByfon,
  onBroadcast
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("questions");
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  const handleAuthenticate = () => {
    if (onAuthenticate(pin)) {
      setPin("");
    }
  };

  const addQuestion = () => {
    const text = prompt("Nội dung câu hỏi?");
    if (!text) return;
    const a = prompt("Đáp án A?") ?? "";
    const b = prompt("Đáp án B?") ?? "";
    const c = prompt("Đáp án C?") ?? "";
    const d = prompt("Đáp án D?") ?? "";
    const ans = parseInt(prompt("Đáp án đúng (0=A,1=B,2=C,3=D)?") || "0", 10);
    const newQs = [
      ...questions,
      { 
        id: Date.now(), 
        text, 
        choices: [a, b, c, d], 
        answer: Math.max(0, Math.min(3, ans)), 
        explanation: "" 
      }
    ];
    onSaveQuestions(newQs);
  };

  const editQuestion = (i: number) => {
    const qq = questions[i];
    const text = prompt("Sửa nội dung", qq.text) ?? qq.text;
    const a = prompt("A", qq.choices[0]) ?? qq.choices[0];
    const b = prompt("B", qq.choices[1]) ?? qq.choices[1];
    const c = prompt("C", qq.choices[2]) ?? qq.choices[2];
    const d = prompt("D", qq.choices[3]) ?? qq.choices[3];
    const ans = parseInt(prompt("Đáp án đúng (0-3)", String(qq.answer)) || String(qq.answer), 10);
    const newQs = questions.slice();
    newQs[i] = { ...qq, text, choices: [a, b, c, d], answer: Math.max(0, Math.min(3, ans)) };
    onSaveQuestions(newQs);
  };

  const removeQuestion = (i: number) => {
    if (!confirm("Xóa câu hỏi này?")) return;
    const newQs = questions.filter((_, idx) => idx !== i);
    onSaveQuestions(newQs);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) onSaveQuestions(data);
        else alert("File không hợp lệ");
      } catch {
        alert("Không đọc được file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 shadow-2xl">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              <i className="fas fa-user-shield mr-2"></i>
              Admin Panel
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Xác thực Admin</h4>
                <p className="text-gray-400 text-sm">Nhập PIN để truy cập chế độ quản trị</p>
              </div>
              
              <div className="max-w-sm mx-auto space-y-4">
                <input 
                  type="password" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Nhập PIN admin" 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
                <button 
                  onClick={handleAuthenticate}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Đăng nhập
                </button>
                <p className="text-xs text-gray-500">Gợi ý: IP được cấp phép</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Control Tabs */}
              <div className="flex space-x-1 mb-6 bg-slate-700/50 rounded-xl p-1">
                <button 
                  onClick={() => setActiveTab('questions')} 
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'questions' ? 'bg-purple-600 text-white' : 'text-gray-400'
                  }`}
                >
                  <i className="fas fa-question-circle mr-2"></i>
                  Câu hỏi
                </button>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'settings' ? 'bg-purple-600 text-white' : 'text-gray-400'
                  }`}
                >
                  <i className="fas fa-cog mr-2"></i>
                  Cài đặt
                </button>
              </div>

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Quản lý câu hỏi</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={addQuestion}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Thêm câu hỏi
                      </button>
                      <button 
                        onClick={exportJSON}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Xuất JSON
                      </button>
                      <label className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200">
                        Nhập JSON
                        <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((q, i) => (
                      <div key={q.id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-white">{q.text}</h5>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => editQuestion(i)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => removeQuestion(i)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          {q.choices.map((choice, idx) => `${String.fromCharCode(65 + idx)}: ${choice}`).join(" | ")}
                        </div>
                        <div className="text-xs text-green-400">
                          <i className="fas fa-check mr-1"></i>
                          Đáp án: {String.fromCharCode(65 + q.answer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                    <h5 className="font-medium mb-3 flex items-center">
                      <i className="fas fa-shield-alt mr-2 text-red-400"></i>
                      BYFON Anti-cheat
                    </h5>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Kích hoạt BYFON</span>
                        <input 
                          type="checkbox" 
                          checked={byfonOn} 
                          onChange={(e) => onToggleByfon(e.target.checked)}
                          className="w-5 h-5 text-red-600 bg-slate-600 border-slate-500 rounded focus:ring-red-500"
                        />
                      </label>
                      <button 
                        onClick={onResetCheat}
                        className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Mở khóa tất cả
                      </button>
                      <button 
                        onClick={() => onBroadcast({ type: "toast", payload: "Thông báo realtime từ Admin" })}
                        className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-sm font-medium transition-all duration-200 ml-2"
                      >
                        Ping realtime
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
