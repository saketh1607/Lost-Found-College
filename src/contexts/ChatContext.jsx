import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, doc, setDoc, onSnapshot, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '@clerk/clerk-react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ADMIN_EMAIL = 'saketh1607@gmail.com'; // Change as needed

// export const ChatProvider = ({ children }) => {
//   const { user } = useUser();
//   const email = user.primaryEmailAddress?.emailAddress?.split('@')[0];
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [unsubscribe, setUnsubscribe] = useState(null);

//   // Find or create a chat for this item and user
//   const startChat = useCallback(async (item) => {
//     setLoading(true);
//     try {
//       const adminId = ADMIN_EMAIL;
//       const userId = user.id;
//       // Check if chat exists
//       const q = query(
//         collection(db, 'chats'),
//         where('itemId', '==', item.id),
//         where('userId', '==', userId)
//       );
//       const snap = await getDocs(q);
//       let chatId;
//       if (!snap.empty) {
//         chatId = snap.docs[0].id;
//         setCurrentChat({ id: chatId, ...snap.docs[0].data() });
//       } else {
//         // Create new chat
//         const chatDoc = await addDoc(collection(db, 'chats'), {
//           itemId: item.id,
//           itemTitle: item.title || item.name,
//           itemDetails: item,
//           userId,
//           adminId,
//           createdAt: serverTimestamp(),
//         });
//         chatId = chatDoc.id;
//         setCurrentChat({ id: chatId, itemId: item.id, userId, adminId, itemDetails: item });
//         // Send first message with item details
//         await addDoc(collection(db, 'chats', chatId, 'messages'), {
//           senderId: userId,
//           text: `Started chat about item: ${item.title || item.name} by ${email}`,
//           timestamp: serverTimestamp(),
//         });
//       }
//       listenForMessages(chatId);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);
let email="";
export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  email = user?.primaryEmailAddress?.emailAddress?.split('@')[0];

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);

  const startChat = useCallback(
    async (item) => {
      if (!user) return;
      setLoading(true);
      try {
        const adminId = ADMIN_EMAIL;
        const userId = user.id;

        const q = query(
          collection(db, 'chats'),
          where('itemId', '==', item.id),
          where('userId', '==', userId)
        );
        const snap = await getDocs(q);

        let chatId;

        if (!snap.empty) {
          chatId = snap.docs[0].id;
          setCurrentChat({ id: chatId, ...snap.docs[0].data() });
        } else {
          const chatDoc = await addDoc(collection(db, 'chats'), {
            itemId: item.id,
            itemTitle: item.title || item.name,
            itemDetails: item,
            userId,
            adminId,
            createdAt: serverTimestamp(),
          });
          chatId = chatDoc.id;

          setCurrentChat({
            id: chatId,
            itemId: item.id,
            userId,
            adminId,
            itemDetails: item,
          });

          await addDoc(collection(db, 'chats', chatId, 'messages'), {
            senderId: userId,
            text: `Started chat about item: ${item.title || item.name} by ${email}`,
            timestamp: serverTimestamp(),
          });
        }

        listenForMessages(chatId); // Ensure this function is defined
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Admin: open any chat by id
  const openChatById = useCallback(async (chat) => {
    setLoading(true);
    try {
      setCurrentChat(chat);
      listenForMessages(chat.id);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for messages in a chat
  const listenForMessages = useCallback((chatId) => {
    if (unsubscribe) unsubscribe();
    console.log('Listening for messages in chat:', chatId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Received messages:', msgs);
      setMessages(msgs);
    });
    setUnsubscribe(() => unsub);
  }, [unsubscribe]);

  // Send a message
  const sendMessage = async (chatId, text) => {
    if (!user) return;
    console.log('Sending message:', { chatId, senderId: user.id, text });
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId: user.id,
      text,
      timestamp: serverTimestamp(),
    });
  };

  // Reset chat
  const closeChat = () => {
    if (unsubscribe) unsubscribe();
    setCurrentChat(null);
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ currentChat, messages, loading, startChat, sendMessage, closeChat, openChatById }}>
      {children}
    </ChatContext.Provider>
  );
}; 