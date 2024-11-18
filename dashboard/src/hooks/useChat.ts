import { useEffect } from 'react';
import { useFrappeEventListener } from 'frappe-react-sdk';
import { useChatStore } from '@/stores/chatStore';
import { useLocation } from 'react-router-dom';
import * as api from '@/utils/api';

export const useChat = () => {
  const store = useChatStore();
  const membershipId = localStorage.getItem('membershipId');
  const location = useLocation();
  const isOnChatPage = location.pathname === '/chat';

  useEffect(() => {
    if (isOnChatPage && membershipId) {
      api.markChatsRead(membershipId);
    }
  }, [isOnChatPage, membershipId]);

  // Initial fetch
  useEffect(() => {
    store.fetch();
    return () => store.clear();
  }, []);

  // Listen for chat updates and fetch only for current membership
  useFrappeEventListener('chat_update', (data) => {
    if (data.membership === membershipId) {
      store.fetch();
    }
  });

  return {
    ...store,
    unreadCount: store.messages.filter(m => m.response === 1 && m.read === 0).length
  };
};