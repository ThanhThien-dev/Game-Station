"use client";

import { useState } from "react";
import { combos } from "./data";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Chào bạn! 🎮 Tôi là AI Gaming Assistant. Bạn cần tư vấn gì hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<"idle" | "people" | "combo" | "price" | "confirm">("idle");
  const [people, setPeople] = useState(0);
  const [selectedCombo, setSelectedCombo] = useState<typeof combos[0] | null>(null);

  const suggestCombos = (count: number) => {
    return combos.filter(c => 
      c.name === "Full Gaming Setup" && count <= 4 ||
      c.name === "Tournament Pack" && count > 2
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: messages.length + 1, role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      let response = "";

      if (step === "idle") {
        response = "Bạn muốn đặt combo hay hỏi thông tin gì? Nếu muốn đặt combo, cho tôi biết có bao nhiêu người nhé!";
        setStep("people");
      } else if (step === "people") {
        const num = parseInt(input) || 2;
        setPeople(num);
        const suggested = suggestCombos(num);
        if (suggested.length > 0) {
          setSelectedCombo(suggested[0]);
          response = `Với ${num} người, tôi recommend combo "${suggested[0].name}" - ${suggested[0].price.toLocaleString()}₫/người. Bao gồm: ${suggested[0].items.join(", ")}. Bạn đồng ý không?`;
          setStep("confirm");
        } else {
          response = `Tôi recommend combo "Full Gaming Setup" - ${combos[0].price.toLocaleString()}₫. Bao gồm: ${combos[0].items.join(", ")}. Bạn đồng ý không?`;
          setSelectedCombo(combos[0]);
          setStep("confirm");
        }
      } else if (step === "confirm") {
        if (input.toLowerCase().includes("đồng ý") || input.toLowerCase().includes("ok") || input.toLowerCase().includes("yes")) {
          response = `✅ Đặt chỗ thành công!\n\n📋 Thông tin đơn:\n- Combo: ${selectedCombo?.name}\n- Số người: ${people}\n- Tổng tiền: ${selectedCombo?.price.toLocaleString()}₫\n\nCảm ơn bạn! Hẹn gặp tại Gaming Center nhé! 🎮`;
          setStep("idle");
          setPeople(0);
          setSelectedCombo(null);
        } else {
          response = "Không sao! Bạn muốn tôi tư vấn thêm về các combo khác không?";
        }
      } else {
        response = "Bạn có thể hỏi về games, combos, hoặc đặt chỗ nhé! 🎮";
      }

      setMessages(prev => [...prev, { id: prev.length + 1, role: "assistant", content: response }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-gradient-to-r from-cyan-500 to-pink-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white">AI Gaming Assistant</h3>
                <p className="text-xs text-white/80">Always online</p>
              </div>
            </div>
          </div>

          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-white rounded-br-md"
                      : "bg-zinc-800 text-zinc-100 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}