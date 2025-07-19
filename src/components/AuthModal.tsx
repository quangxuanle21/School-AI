import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const { login, register, resetPassword, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    setErrors({});
    setSuccessMessage('');
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (mode !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu là bắt buộc';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (mode === 'register') {
        if (!formData.name) {
          newErrors.name = 'Tên là bắt buộc';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        onClose();
      } else if (mode === 'register') {
        await register(formData.email, formData.password, formData.name);
        onClose();
      } else if (mode === 'forgot-password') {
        await resetPassword(formData.email);
        setSuccessMessage('Email khôi phục mật khẩu đã được gửi!');
      }
    } catch (error) {
      setErrors({ submit: (error as Error).message });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Đăng nhập';
      case 'register': return 'Đăng ký tài khoản';
      case 'forgot-password': return 'Quên mật khẩu';
      default: return '';
    }
  };

  const getSubmitText = () => {
    if (isLoading) return 'Đang xử lý...';
    switch (mode) {
      case 'login': return 'Đăng nhập';
      case 'register': return 'Đăng ký';
      case 'forgot-password': return 'Gửi email khôi phục';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            {mode === 'forgot-password' && (
              <button
                onClick={() => handleModeChange('login')}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            
            <h2 className="text-2xl font-bold text-center">{getTitle()}</h2>
            <p className="text-blue-100 text-center mt-2">
              {mode === 'login' && 'Chào mừng bạn quay trở lại!'}
              {mode === 'register' && 'Tạo tài khoản mới để bắt đầu'}
              {mode === 'forgot-password' && 'Nhập email để khôi phục mật khẩu'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg"
              >
                {successMessage}
              </motion.div>
            )}

            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              >
                {errors.submit}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for register */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập email của bạn"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              {mode !== 'forgot-password' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Confirm Password field for register */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>{getSubmitText()}</span>
                  </div>
                ) : (
                  getSubmitText()
                )}
              </motion.button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button
                    onClick={() => handleModeChange('forgot-password')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Quên mật khẩu?
                  </button>
                  <p className="text-gray-600 text-sm">
                    Chưa có tài khoản?{' '}
                    <button
                      onClick={() => handleModeChange('register')}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Đăng ký ngay
                    </button>
                  </p>
                </>
              )}

              {mode === 'register' && (
                <p className="text-gray-600 text-sm">
                  Đã có tài khoản?{' '}
                  <button
                    onClick={() => handleModeChange('login')}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Đăng nhập
                  </button>
                </p>
              )}

              {mode === 'forgot-password' && !successMessage && (
                <p className="text-gray-600 text-sm">
                  Nhớ mật khẩu rồi?{' '}
                  <button
                    onClick={() => handleModeChange('login')}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Đăng nhập
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}