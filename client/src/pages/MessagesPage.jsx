import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { getMessages, sendMessage } from '../services/messageService';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Simple polling every 5 seconds for MVP
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [requestId]);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(requestId);
      setMessages(data);
      if (loading) setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const sentMessage = await sendMessage(requestId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!user) return <div className="text-center py-20">Please log in to view messages.</div>;
  if (loading) return <div className="text-center py-20">Loading conversation...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="bg-white px-6 py-4 rounded-t-3xl border-b border-gray-100 flex items-center shadow-sm z-10">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-lg text-gray-900">Conversation</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto rounded-b-none border-x border-gray-100">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No messages yet. Say hello!</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMine = msg.sender._id === user._id || msg.sender === user._id; // Handle populated vs unpopulated
              return (
                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                    isMine 
                      ? 'bg-brand-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {!isMine && <p className="text-xs font-semibold text-gray-500 mb-1">{msg.sender.name}</p>}
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-brand-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 rounded-b-3xl border-x border-b border-gray-100 shadow-sm">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-brand-600 text-white p-3 rounded-2xl hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[50px] shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
