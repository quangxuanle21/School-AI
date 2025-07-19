import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import CharacterSelection from './components/CharacterSelection';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import VirtualRoom from './components/VirtualRoom';
import ChatInterface from './components/ChatInterface';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { geminiApiService } from './services/geminiApiService';
import { Character, getLocalizedCharacters } from './types/Character';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import { Heart, Shield, Users, ArrowLeft, LogIn } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const handleSpeakMessage = useCallback((text: string) => {
    if (text === '') {
      stop();
    } else {
      speak(text);
    }
  }, [speak, stop]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await geminiApiService.getCounselingResponse(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-speak AI response if speech is enabled
      setTimeout(() => {
        if (speechEnabled) {
          speak(response);
        }
      }, 500);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [speak, speechEnabled]);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled(prev => {
      const newValue = !prev;
      // Stop speaking if disabling speech
      if (!newValue) {
        stop();
      }
      return newValue;
    });
  }, [stop]);

  const { isListening, startListening, stopListening, transcript } = useSpeechRecognition({
    onResult: handleSendMessage,
    onError: (error) => {
      console.error('Speech recognition error:', error);
    }
  });

  // Initialize greeting when character is selected
  useEffect(() => {
    if (selectedCharacter && !hasGreeted) {
      const greetingMessage: Message = {
        id: '1',
        text: selectedCharacter.greeting,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages([greetingMessage]);
      
      // Auto-speak greeting after a short delay
      setTimeout(() => {
        if (speechEnabled) {
          speak(selectedCharacter.greeting);
        }
      }, 1000);
      
      setHasGreeted(true);
    }
  }, [selectedCharacter, speechEnabled, speak, hasGreeted]);

  const handleBackToSelection = () => {
    setSelectedCharacter(null);
    setMessages([]);
    setHasGreeted(false);
    stop();
  };

  if (!selectedCharacter) {
    return (
      <div className="relative">
        {/* Fixed top bar */}
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
          <LanguageSelector />
          {user ? (
            <UserProfile />
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t('auth.login')}</span>
            </motion.button>
          )}
        </div>
        <CharacterSelection onSelectCharacter={setSelectedCharacter} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      {/* Fixed top bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <LanguageSelector />
        {user ? (
          <UserProfile />
        ) : (
          <motion.button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{t('auth.login')}</span>
          </motion.button>
        )}
      </div>
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={handleBackToSelection}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </motion.button>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
                <p className="text-sm text-gray-600">
                  💬 {t('app.chatting')} {selectedCharacter.name} - {selectedCharacter.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>{t('app.safe')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{t('app.available')}</span>
              </div>
              {/* Status indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  isProcessing ? 'bg-yellow-500 animate-pulse' :
                  isSpeaking ? 'bg-green-500 animate-pulse' :
                  isListening ? 'bg-red-500 animate-pulse' :
                  'bg-blue-500'
                }`} />
                <span className="text-gray-600">
                  {isProcessing ? t('app.status.processing') :
                   isSpeaking ? t('app.status.speaking') :
                   isListening ? t('app.status.listening') :
                   t('app.status.ready')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Enhanced 3D Room */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          >
            <VirtualRoom
              character={selectedCharacter}
              isListening={isListening}
              isSpeaking={isSpeaking || isProcessing}
            />
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <ChatInterface
              onSendMessage={handleSendMessage}
              messages={messages}
              isListening={isListening}
              isSpeaking={isSpeaking || isProcessing}
              isProcessing={isProcessing}
              onStartListening={startListening}
              onStopListening={stopListening}
              onToggleSpeech={toggleSpeech}
              speechEnabled={speechEnabled}
              transcript={transcript}
              onSpeakMessage={handleSpeakMessage}
            />
          </motion.div>
        </div>
      </main>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.div>
  );
}

export default App;