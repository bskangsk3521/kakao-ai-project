//사용자가 상호작용하는 파일이라고 브라우저에게 명시하는 코드
"use client";

// react라이브러리에서 useState라는 Hook을 가져오는 코드
import { useState } from "react";

// Message의 속성과 타입을 정함.
interface Message {
  role: "user" | "ai";
  text: string;
}

//외부 파일에서 이 함수를 사용할 수 있게 선언, 외부에 import할 때 Home()함수가 이 파일의 메인 함수임을 선언
export default function Home() {
  const [input, setInput] = useState("");
  //messages 배열의 구조를 Message 인터페이스로 지정
  const [messages, setMessages] = useState<Message[]>([]); // 대화 내역 저장용 배열
  const [isLoading, setIsLoading] = useState(false);

  const askAi = async () => {
    if (!input.trim()) return;

    // 1. 내가 보낸 메시지를 화면에 추가
    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput(""); // 입력창 비우기
    setIsLoading(true);

    try {
      // 2. 백엔드에 질문 던지기
      const res = await fetch(`http://127.0.0.1:8000/chat?user_input=${encodeURIComponent(input)}`);
      const data = await res.json();

      // 3. AI 답변을 화면에 추가
      const aiMsg: Message = { role: "ai", text: data.ai_answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg: Message = { role: "ai", text: "죄송해요, 서버와 연결에 실패했어요. 😢" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#b2c7da]"> {/* 카톡 배경색 */}
      {/* 상단 헤더 */}
      <header className="bg-[#423630] text-white p-4 text-center font-bold shadow-md">
        AI 상담원 (GPT-4o mini)
      </header>

      {/* 채팅 메시지 영역 */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
              msg.role === "user" ? "bg-[#fee500] text-black rounded-tr-none" : "bg-white text-black rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg animate-pulse text-gray-400">말씀하시는 중...</div>
          </div>
        )}
      </section>

      {/* 입력창 영역 */}
      <footer className="bg-white p-4 border-t flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-black focus:outline-none focus:border-[#fee500]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && askAi()}
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={askAi}
          disabled={isLoading}
          className="bg-[#fee500] hover:bg-[#fada00] text-[#3c1e1e] font-bold py-2 px-6 rounded-full disabled:opacity-50"
        >
          전송
        </button>
      </footer>
    </main>
  );
}