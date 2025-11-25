import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your health assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API Key is missing. Make sure VITE_OPENROUTER_API_KEY is set in .env and server is restarted.");
      setMessages(prev => [...prev, {
        text: "System Error: API Key is missing. Please check your .env file and restart the development server.",
        sender: 'bot'
      }]);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending request to OpenRouter...");
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Senior Health Monitor',
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are a helpful health assistant. You must ONLY answer questions related to medical and health issues. If a user asks about any other topic, politely refuse to answer and steer the conversation back to health. Keep your answers concise and helpful."
            },
            ...messages.filter(m => m.sender !== 'bot').map(m => ({ role: "user", content: m.text })),
            { role: "user", content: userMessage }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenRouter API Error:", response.status, response.statusText, errorData);
        throw new Error(`API Error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log("OpenRouter Response:", data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from OpenRouter");
      }

      const botResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: `I'm sorry, I'm having trouble connecting. Error: ${error.message}`,
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="bot-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z" />
                  <path d="M20 12c0-4.42-3.58-8-8-8S4 7.58 4 12c0 3.1 1.76 5.78 4.36 7.15.22.12.48.05.62-.16l1.2-1.8c.15-.22.1-.52-.12-.68C8.74 15.55 8 13.87 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.87-.74 3.55-2.06 4.51-.22.16-.27.46-.12.68l1.2 1.8c.14.21.4.28.62.16C18.24 17.78 20 15.1 20 12z" />
                </svg>
              </div>
              <div>
                <h3>Health Assistant</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                  <div className="status-dot"></div>
                  Online
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chatbot-icon">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chatbot-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
