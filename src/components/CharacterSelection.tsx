import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, getLocalizedCharacters } from '../types/Character';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, Star, Users, Heart } from 'lucide-react';

interface CharacterSelectionProps {
  onSelectCharacter: (character: Character) => void;
}

export default function CharacterSelection({ onSelectCharacter }: CharacterSelectionProps) {
  const { t } = useLanguage();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);
  
  // Get localized characters
  const characters = getLocalizedCharacters(t);

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
    setTimeout(() => {
      onSelectCharacter(character);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('character.selection.title')}
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            {t('character.selection.subtitle')}
          </p>
        </motion.div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 cursor-pointer transition-all duration-300 ${
                  hoveredCharacter === character.id ? 'scale-105' : ''
                } ${selectedCharacter?.id === character.id ? 'ring-4 ring-yellow-400' : ''}`}
                onHoverStart={() => setHoveredCharacter(character.id)}
                onHoverEnd={() => setHoveredCharacter(null)}
                onClick={() => handleSelect(character)}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Character Avatar */}
                <div className="text-center mb-6">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl"
                    style={{ backgroundColor: character.color }}
                    animate={{
                      rotate: hoveredCharacter === character.id ? [0, 5, -5, 0] : 0,
                      scale: hoveredCharacter === character.id ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {character.avatar}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">{character.name}</h3>
                  <p className="text-lg text-purple-200 mb-1">{character.role}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-300">
                    <Users className="w-4 h-4" />
                    <span>{character.gender === 'male' ? t('character.selection.male') : t('character.selection.female')}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 text-center mb-6 leading-relaxed">
                  {character.description}
                </p>

                {/* Stats/Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{t('character.selection.experience')}</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{t('character.selection.friendliness')}</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.1 + 0.5 }}
                        >
                          <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <motion.button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    selectedCharacter?.id === character.id
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedCharacter?.id === character.id ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                      />
                      <span>{t('character.selection.loading')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>{t('character.selection.select')}</span>
                    </>
                  )}
                </motion.button>

                {/* Hover Effect */}
                <AnimatePresence>
                  {hoveredCharacter === character.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {t('character.selection.clickToSelect')}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating particles around hovered character */}
                <AnimatePresence>
                  {hoveredCharacter === character.id && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 100],
                            y: [0, (Math.random() - 0.5) * 100],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-purple-200">
            {t('character.selection.footer')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}