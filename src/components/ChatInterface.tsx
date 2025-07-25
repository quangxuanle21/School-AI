import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Mic, MicOff, Volume2, VolumeX, Pause } from 'lucide-react';

// Typing indicator component
const TypingIndicator = ({ t }: { t: (key: string) => string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start"
    >
      <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{t('chat.ai.thinking')}</span>
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0
              }}
            />
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleSpeech: () => void;
  speechEnabled: boolean;
  transcript?: string;
  onSpeakMessage?: (text: string) => void;
}

export default function ChatInterface({
  onSendMessage,
  messages,
  isListening,
  isSpeaking,
  isProcessing,
  onStartListening,
  onStopListening,
  onToggleSpeech,
  speechEnabled,
  transcript = "",
  onSpeakMessage
}: ChatInterfaceProps) {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const handleSpeakMessage = (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      // If this message is currently speaking, stop it
      setSpeakingMessageId(null);
      // We need to stop the current speech - this will be handled by the parent component
      if (onSpeakMessage) {
        onSpeakMessage(''); // Empty string to indicate stop
      }
    } else {
      // Start speaking this message
      setSpeakingMessageId(messageId);
      if (onSpeakMessage) {
        onSpeakMessage(text);
      }
    }
  };

  // Reset speaking message when global isSpeaking becomes false
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMessageId(null);
    }
  }, [isSpeaking]);

  return (
    <div className="flex flex-col h-[80vh] bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('chat.title')}</h2>
          <p className="text-sm text-gray-500">
            {isProcessing ? t('chat.processing') : isSpeaking ? t('chat.speaking') : isListening ? t('chat.listening') : t('chat.ready')}
          </p>
        </div>
        {/* Single audio toggle button */}
        <button
          onClick={onToggleSpeech}
          className={`p-3 rounded-full transition-all duration-200 ${speechEnabled
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          title={speechEnabled ? t('chat.audio.on') : t('chat.audio.off')}
        >
          {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div
          className="h-full overflow-y-auto p-6 space-y-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                    } shadow-sm break-words relative`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <div className={`flex items-center justify-between mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    <p className={`text-xs`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {/* Speak button for AI messages */}
                    {!message.isUser && onSpeakMessage && (
                      <button
                        onClick={() => handleSpeakMessage(message.id, message.text)}
                        className={`ml-2 p-1 rounded-full transition-colors duration-200 ${speakingMessageId === message.id
                            ? 'bg-red-100 hover:bg-red-200'
                            : 'hover:bg-gray-200'
                          }`}
                        title={speakingMessageId === message.id ? t('chat.speak.stop') : t('chat.speak.play')}
                      >
                        {speakingMessageId === message.id ? (
                          <Pause size={14} className="text-red-600" />
                        ) : (
                          <Volume2 size={14} className="text-gray-600 hover:text-gray-800" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Typing indicator when AI is processing */}
            {isProcessing && (
              <TypingIndicator t={t} />
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              placeholder={
                isListening
                  ? `${t('chat.placeholder.listening')}${transcript || ''}`
                  : isProcessing
                    ? t('chat.placeholder.processing')
                    : t('chat.placeholder.default')
              }
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200"
              disabled={isListening || isProcessing}
            />
            {/* Voice input button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={isProcessing}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ${isProcessing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isListening
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-110'
                }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
          {/* Send button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isListening || isProcessing}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>

        {/* Status indicator */}
        {(isListening || isProcessing || isSpeaking) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-500"
          >
            {isListening && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span>{t('chat.status.listening')}</span>
              </>
            )}
            {isProcessing && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span>{t('chat.status.processing')}</span>
              </>
            )}
            {isSpeaking && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span>{t('chat.status.speaking')}</span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}