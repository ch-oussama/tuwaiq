"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export default function GeminiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      if (user) {
        const name = user.displayName?.split(' ')[0] || '';
        setMessages([
          { role: 'model', parts: [{ text: `${name ? name + '! ' : ''}مرحباً! أنا مستشار طويق الذكي. كيف يمكنني مساعدتك في مشروعك اليوم؟` }] }
        ]);
      }
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);
      } else {
        setMessages([...newMessages, { role: 'model', parts: [{ text: 'عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة لاحقاً.' }] }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'model', parts: [{ text: 'عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة لاحقاً.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-0 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-brown p-4 flex justify-between items-center z-10 text-brand-beige">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-brown">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">مستشار طويق الذكي</h3>
                  <p className="text-xs opacity-80">طويق</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm flex gap-3 ${msg.role === 'user' ? 'bg-brand-gold text-brand-beige rounded-br-none' : 'bg-background border border-border text-foreground rounded-bl-none'}`}>
                    {msg.role === 'model' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</div>
                    {msg.role === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border text-foreground rounded-2xl rounded-bl-none px-4 py-3 flex gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-gold" />
                    <span className="text-sm">جاري التفكير...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {!user ? (
              <div className="p-5 bg-surface border-t border-border flex flex-col items-center text-center gap-3">
                <Lock size={24} className="text-brand-brown/50" />
                <p className="text-sm font-bold text-brand-brown/80 mb-1">
                  المستشار الذكي حصري للأعضاء فقط
                </p>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-brand-gold text-brand-beige font-black py-3 rounded-xl transition-transform hover:scale-105"
                >
                  تسجيل الدخول للدردشة
                </Link>
              </div>
            ) : (
              <div className="p-3 bg-surface border-t border-border flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اسألني عن خدماتنا..." 
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  autoFocus
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-brand-gold text-brand-beige w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                >
                  <Send size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={toggleChat}
        className="w-16 h-16 bg-brand-gold text-[#3E2723] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform relative dark:shadow-[0_0_20px_rgba(167, 139, 102,0.3)]"
      >
        <MessageCircle size={28} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-brown opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-brown"></span>
          </span>
        )}
      </button>
    </div>
  );
}