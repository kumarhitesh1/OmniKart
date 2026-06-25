import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "../main";
import { UserData } from "../context/UserContext";
import { MessageCircle, X, Send, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hi! I'm Omi, your OmniKart assistant 👋 How can I help you today?",
  isInitial: true,
};

const QUICK_ACTIONS = [
  { label: "Browse Products", path: "/products", emoji: "🛍️" },
  { label: "My Orders", path: "/orders", emoji: "📦" },
  { label: "My Cart", path: "/cart", emoji: "🛒" },
];

const ChatAssistant = () => {
  const navigate = useNavigate();
  const { isAuth } = UserData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const prevAuthRef = useRef(isAuth);

  useEffect(() => {
    if (prevAuthRef.current === true && isAuth === false) {
      setMessages([INITIAL_MESSAGE]);
      setOpen(false);
    }
    prevAuthRef.current = isAuth;
  }, [isAuth]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(1, -1)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const { data } = await axios.post(
        `${server}/api/chat`,
        { message: userMessage.content, history },
        { headers: { token: Cookies.get("token") } },
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105"
        style={{ backgroundColor: "#1b2a6b" }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">

          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: "#1b2a6b" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Omi</p>
                <p className="text-xs text-white/70 leading-tight">OmniKart Assistant</p>
              </div>
            </div>

            <button
              onClick={resetConversation}
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
              title="New conversation"
            >
              <RotateCcw size={14} />
              New chat
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
          >
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {msg.isInitial && (
                  <div className="mt-3 space-y-2">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.path}
                        onClick={() => handleQuickAction(action.path)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all shadow-sm"
                      >
                        <span>{action.emoji} {action.label}</span>
                        <ArrowRight size={14} className="text-gray-400" />
                      </button>
                    ))}
                    <p className="text-xs text-gray-400 text-center pt-1">
                      Or type a question below
                    </p>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-gray-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-colors"
              style={{ backgroundColor: "#1b2a6b" }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;