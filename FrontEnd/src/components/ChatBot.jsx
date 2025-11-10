import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

function ChatBot({ isDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI PC Building Assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate bot response (replace with actual API call)
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: getBotResponse(inputMessage),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const getBotResponse = (userInput) => {
        const input = userInput.toLowerCase();
        
        // Simple response logic (replace with AI API integration)
        if (input.includes('budget')) {
            return "I can help you build a PC within your budget! What's your budget range? We support builds from ₹30,000 to ₹500,000.";
        } else if (input.includes('gaming')) {
            return "For gaming PCs, I recommend focusing on a good GPU and at least 16GB RAM. What games do you want to play?";
        } else if (input.includes('help') || input.includes('assist')) {
            return "I can help you with:\n• PC build recommendations\n• Component selection\n• Budget planning\n• Performance comparisons\n• Use case optimization\n\nWhat would you like to know?";
        } else if (input.includes('cpu') || input.includes('processor')) {
            return "For CPUs, consider your use case:\n• Gaming: Intel i5/i7 or AMD Ryzen 5/7\n• Content Creation: AMD Ryzen 7/9 or Intel i7/i9\n• Budget: Intel i3 or AMD Ryzen 3\n\nWhat's your primary use?";
        } else if (input.includes('gpu') || input.includes('graphics')) {
            return "GPU selection depends on your resolution and games:\n• 1080p Gaming: RTX 3060/4060 or RX 6600\n• 1440p Gaming: RTX 4070 or RX 7700 XT\n• 4K Gaming: RTX 4080/4090 or RX 7900 XTX\n\nWhat resolution do you play at?";
        } else {
            return "I'm here to help with your PC building questions! You can ask me about budgets, components, gaming performance, or any PC-related queries.";
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickActions = [
        "Help me build a gaming PC",
        "What's my budget range?",
        "Compare CPU options",
        "GPU recommendations"
    ];

    const handleQuickAction = (action) => {
        setInputMessage(action);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                    isDarkMode 
                        ? 'bg-[var(--accent)]' 
                        : 'bg-[var(--accent)]'
                }`}
                aria-label="Toggle chat"
            >
                {isOpen ? (
                    <FiX className="text-white text-2xl" />
                ) : (
                    <FiMessageCircle className="text-white text-2xl" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div 
                    className={`fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                    style={{ maxWidth: 'calc(100vw - 3rem)' }}
                >
                    {/* Header */}
                    <div className={`p-4 bg-[var(--accent)]`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <FiMessageCircle className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">PC Builder Assistant</h3>
                                    <p className="text-white/90 text-xs">● offline</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                        isDarkMode ? 'bg-[#0a192f]' : 'bg-gray-50'
                    }`}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${
                                        message.sender === 'user'
                                            ? 'bg-[var(--accent)] text-white shadow-lg'
                                            : isDarkMode
                                                ? 'bg-[#172a46] text-gray-100 border border-gray-700'
                                                : 'bg-white text-gray-800 shadow-md border border-gray-200'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.sender === 'user' 
                                            ? 'text-white/80' 
                                            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className={`rounded-2xl p-3 ${
                                    isDarkMode ? 'bg-[#172a46] border border-gray-700' : 'bg-white shadow-md border border-gray-200'
                                }`}>
                                    <div className="flex space-x-2">
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                                            isDarkMode ? 'bg-[#f87060]' : 'bg-[#102542]'
                                        }`} style={{ animationDelay: '0ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                                            isDarkMode ? 'bg-[#f87060]' : 'bg-[#102542]'
                                        }`} style={{ animationDelay: '150ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                                            isDarkMode ? 'bg-[#f87060]' : 'bg-[#102542]'
                                        }`} style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 1 && (
                        <div className={`px-4 py-2 border-t ${
                            isDarkMode ? 'border-gray-700 bg-[#0a192f]' : 'border-gray-200 bg-gray-50'
                        }`}>
                            <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Quick actions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickAction(action)}
                                        className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 ${
                                            isDarkMode
                                                ? 'bg-[#172a46] text-gray-300 hover:bg-[#1e3a5f] border border-gray-700'
                                                : 'bg-white text-gray-700 hover:bg-[#f87060] hover:text-white border border-gray-300 hover:border-[#f87060]'
                                        }`}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={`p-4 border-t ${
                        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className={`flex-1 px-4 py-2 rounded-full outline-none transition-colors border ${
                                    isDarkMode
                                        ? 'bg-[#172a46] text-white placeholder-gray-400 focus:bg-[#1e3a5f] border-gray-700 focus:border-[#f87060]'
                                        : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:bg-white border-gray-300 focus:border-[#102542]'
                                }`}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputMessage.trim() === ''}
                                className={`p-3 rounded-full transition-all duration-200 bg-[var(--accent)] hover:bg-[#f65e4a] ${
                                    inputMessage.trim() === ''
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:scale-110 shadow-lg'
                                }`}
                            >
                                <FiSend className="text-white text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .fixed.bottom-24.right-6 {
                        width: calc(100vw - 2rem);
                        right: 1rem;
                        height: calc(100vh - 8rem);
                    }
                }
            `}</style>
        </>
    );
}

export default ChatBot;