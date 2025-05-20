import React, { useState, useRef, useEffect } from 'react';
import { useChat, ADMIN_EMAIL } from '../contexts/ChatContext';
import { useUser } from '@clerk/clerk-react';

const ChatWindow = () => {
  const { currentChat, messages, sendMessage, closeChat } = useChat();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!currentChat) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage(currentChat.id, input.trim());
    setInput('');
  };

  // Helper to check if the message is from the current user
  const isCurrentUser = (msg) => msg.senderId === user.id;
  // Helper to check if the message is from admin
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-lg flex flex-col h-[70vh] md:h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="font-bold text-lg">Chat with Admin</div>
            <div className="text-xs text-gray-500">Item: {currentChat.itemTitle}</div>
          </div>
          <button onClick={closeChat} className="text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map(msg => {
            const isMine = msg.senderId === user.id;
            const isMsgAdmin = msg.senderId === currentChat.adminId;
            let bubbleColor = '';
            if (isMine && isAdmin) bubbleColor = 'bg-green-500 text-white'; // admin's own message
            else if (isMine) bubbleColor = 'bg-blue-600 text-white'; // user's own message
            else if (isMsgAdmin) bubbleColor = 'bg-green-100 text-green-900'; // admin's message for user
            else bubbleColor = 'bg-gray-200 text-gray-800'; // user's message for admin
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm shadow-sm ${bubbleColor}`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 