import React from 'react';
import { ChatMessage } from '../../types';
import { Bot, User, Sprout } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  // Simple clean formatting for markdown bold & bullets
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let formatted = line;

      // Bullet line
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc mb-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: parseBold(content) }} />
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="mb-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
      );
    });
  };

  const parseBold = (str: string) => {
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className={`flex gap-3 text-xs sm:text-sm ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-agri-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Sprout className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1 ${
          isAssistant
            ? 'bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border text-stone-800 dark:text-stone-100 shadow-xs'
            : 'bg-agri-600 text-white shadow-sm'
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="User uploaded attachment"
            className="rounded-xl max-h-48 w-full object-cover mb-2 border border-white/20"
          />
        )}

        <div className="prose-xs">
          {renderFormattedText(message.text)}
        </div>

        <div
          className={`text-[10px] mt-1 text-right ${
            isAssistant ? 'text-stone-400' : 'text-emerald-100'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-forest dark:bg-forest-light text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
