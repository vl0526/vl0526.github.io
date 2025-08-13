export interface Question {
  id: number;
  text: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export const defaultQuestions: Question[] = [
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
    explanation: "Bạn \"bắt\" cảm lạnh nhưng không thể ném nó."
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
