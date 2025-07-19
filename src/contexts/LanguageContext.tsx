import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  vi: {
    // Character Selection
    'character.selection.title': 'Chọn Trợ Lý AI Của Bạn',
    'character.selection.subtitle': 'Chọn một trợ lý ảo để giúp bạn học tập, phát triển và khám phá các chủ đề mới trong môi trường 3D tương tác',
    'character.selection.select': 'Chọn',
    'character.selection.loading': 'Đang tải...',
    'character.selection.clickToSelect': 'Nhấn để chọn!',
    'character.selection.footer': 'Mỗi nhân vật có đặc điểm tính cách và lĩnh vực kiến thức chuyên môn riêng',
    'character.selection.experience': 'Kinh nghiệm',
    'character.selection.friendliness': 'Thân thiện',
    'character.selection.male': 'Nam',
    'character.selection.female': 'Nữ',

    // Characters
    'character.teacher-a-female.name': 'Cô Anna',
    'character.teacher-a-female.role': 'Giáo viên Tiếng Anh',
    'character.teacher-a-female.description': 'Giáo viên tiếng Anh thân thiện và kiên nhẫn với hơn 10 năm kinh nghiệm',
    'character.teacher-a-female.greeting': 'Xin chào! Tôi là cô Anna. Tôi ở đây để giúp bạn trong hành trình học tiếng Anh. Hôm nay bạn muốn học gì?',

    'character.teacher-b-male.name': 'Thầy Ben',
    'character.teacher-b-male.role': 'Giáo viên Toán',
    'character.teacher-b-male.description': 'Giáo viên toán nhiệt tình, biến những khái niệm phức tạp thành đơn giản',
    'character.teacher-b-male.greeting': 'Chào bạn! Tôi là thầy Ben. Toán học có thể thú vị và hấp dẫn. Tôi có thể giúp bạn chủ đề toán nào?',

    'character.doctor-female.name': 'Bác sĩ Sarah',
    'character.doctor-female.role': 'Tư vấn Sức khỏe',
    'character.doctor-female.description': 'Chuyên gia y tế quan tâm, tập trung vào sức khỏe và phòng ngừa',
    'character.doctor-female.greeting': 'Xin chào! Tôi là bác sĩ Sarah. Tôi ở đây để cung cấp hướng dẫn và hỗ trợ về sức khỏe. Hôm nay tôi có thể giúp gì cho bạn?',

    'character.counselor-male.name': 'Tư vấn viên Mike',
    'character.counselor-male.role': 'Tư vấn Tâm lý',
    'character.counselor-male.description': 'Tư vấn viên chuyên nghiệp chuyên về hỗ trợ cảm xúc',
    'character.counselor-male.greeting': 'Chào mừng! Tôi là tư vấn viên Mike. Đây là không gian an toàn nơi bạn có thể chia sẻ suy nghĩ và cảm xúc. Hôm nay bạn cảm thấy thế nào?',

    // Main App
    'app.title': 'Phòng Tư Vấn Ảo',
    'app.chatting': 'Đang trò chuyện với',
    'app.safe': 'An toàn & Bảo mật',
    'app.available': 'Có sẵn 24/7',
    'app.status.processing': 'Đang xử lý',
    'app.status.speaking': 'Đang nói',
    'app.status.listening': 'Đang nghe',
    'app.status.ready': 'Sẵn sàng',

    // Chat Interface
    'chat.title': '💬 Trò chuyện với AI',
    'chat.processing': 'Đang xử lý...',
    'chat.speaking': 'Đang nói...',
    'chat.listening': 'Đang nghe...',
    'chat.ready': 'Sẵn sàng hỗ trợ',
    'chat.placeholder.listening': '🎤 Đang nghe... ',
    'chat.placeholder.processing': '⏳ Đang chờ AI trả lời...',
    'chat.placeholder.default': '💬 Nhập tin nhắn hoặc dùng voice...',
    'chat.status.listening': '🎤 Đang nghe giọng nói của bạn...',
    'chat.status.processing': '🤖 AI đang suy nghĩ...',
    'chat.status.speaking': '🔊 AI đang nói...',
    'chat.ai.thinking': 'AI đang suy nghĩ',
    'chat.speak.stop': 'Dừng phát âm',
    'chat.speak.play': 'Nghe tin nhắn này',
    'chat.audio.on': 'Tắt âm thanh',
    'chat.audio.off': 'Bật âm thanh',

    // Virtual Room
    'room.listening': 'Đang nghe...',
    'room.speaking': 'Đang nói...',
    'room.ready': 'sẵn sàng hỗ trợ',

    // Language Selector
    'language.vietnamese': 'Tiếng Việt',
    'language.english': 'English',
    'language.select': 'Chọn ngôn ngữ',

    // Authentication
    'auth.login': 'Đăng nhập',
    'auth.register': 'Đăng ký tài khoản',
    'auth.forgotPassword': 'Quên mật khẩu',
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.confirmPassword': 'Xác nhận mật khẩu',
    'auth.name': 'Họ và tên',
    'auth.loginButton': 'Đăng nhập',
    'auth.registerButton': 'Đăng ký',
    'auth.resetPasswordButton': 'Gửi email khôi phục',
    'auth.processing': 'Đang xử lý...',
    'auth.welcomeBack': 'Chào mừng bạn quay trở lại!',
    'auth.createAccount': 'Tạo tài khoản mới để bắt đầu',
    'auth.resetPasswordDesc': 'Nhập email để khôi phục mật khẩu',
    'auth.forgotPasswordLink': 'Quên mật khẩu?',
    'auth.noAccount': 'Chưa có tài khoản?',
    'auth.registerNow': 'Đăng ký ngay',
    'auth.hasAccount': 'Đã có tài khoản?',
    'auth.loginNow': 'Đăng nhập',
    'auth.rememberPassword': 'Nhớ mật khẩu rồi?',
    'auth.enterEmail': 'Nhập email của bạn',
    'auth.enterPassword': 'Nhập mật khẩu',
    'auth.enterName': 'Nhập họ và tên',
    'auth.confirmPasswordPlaceholder': 'Nhập lại mật khẩu',
    'auth.emailRequired': 'Email là bắt buộc',
    'auth.emailInvalid': 'Email không hợp lệ',
    'auth.passwordRequired': 'Mật khẩu là bắt buộc',
    'auth.passwordMinLength': 'Mật khẩu phải có ít nhất 6 ký tự',
    'auth.nameRequired': 'Tên là bắt buộc',
    'auth.passwordMismatch': 'Mật khẩu xác nhận không khớp',
    'auth.invalidCredentials': 'Email hoặc mật khẩu không đúng',
    'auth.emailExists': 'Email này đã được sử dụng',
    'auth.userNotFound': 'Không tìm thấy tài khoản với email này',
    'auth.resetEmailSent': 'Email khôi phục mật khẩu đã được gửi!',
    'auth.accountSettings': 'Cài đặt tài khoản',
    'auth.logout': 'Đăng xuất'
  },
  en: {
    // Character Selection
    'character.selection.title': 'Choose Your AI Companion',
    'character.selection.subtitle': 'Select a virtual assistant to help you learn, grow, and explore new topics in an interactive 3D environment',
    'character.selection.select': 'Select',
    'character.selection.loading': 'Loading...',
    'character.selection.clickToSelect': 'Click to select!',
    'character.selection.footer': 'Each character has unique personality traits and specialized knowledge areas',
    'character.selection.experience': 'Experience',
    'character.selection.friendliness': 'Friendliness',
    'character.selection.male': 'Male',
    'character.selection.female': 'Female',

    // Characters
    'character.teacher-a-female.name': 'Teacher Anna',
    'character.teacher-a-female.role': 'English Teacher',
    'character.teacher-a-female.description': 'Friendly and patient English teacher with 10+ years experience',
    'character.teacher-a-female.greeting': "Hello! I'm Teacher Anna. I'm here to help you with your English learning journey. What would you like to study today?",

    'character.teacher-b-male.name': 'Teacher Ben',
    'character.teacher-b-male.role': 'Math Teacher',
    'character.teacher-b-male.description': 'Enthusiastic math teacher who makes complex concepts simple',
    'character.teacher-b-male.greeting': "Hi there! I'm Teacher Ben. Mathematics can be fun and exciting. What math topic can I help you with?",

    'character.doctor-female.name': 'Dr. Sarah',
    'character.doctor-female.role': 'Health Counselor',
    'character.doctor-female.description': 'Caring health professional focused on wellness and prevention',
    'character.doctor-female.greeting': "Hello! I'm Dr. Sarah. I'm here to provide health guidance and support. How can I help you today?",

    'character.counselor-male.name': 'Counselor Mike',
    'character.counselor-male.role': 'Mental Health Counselor',
    'character.counselor-male.description': 'Professional counselor specializing in emotional support',
    'character.counselor-male.greeting': "Welcome! I'm Counselor Mike. This is a safe space where you can share your thoughts and feelings. How are you doing today?",

    // Main App
    'app.title': 'Virtual Consultation Room',
    'app.chatting': 'Chatting with',
    'app.safe': 'Safe & Confidential',
    'app.available': '24/7 Available',
    'app.status.processing': 'Processing',
    'app.status.speaking': 'Speaking',
    'app.status.listening': 'Listening',
    'app.status.ready': 'Ready',

    // Chat Interface
    'chat.title': '💬 Chat with AI',
    'chat.processing': 'Processing...',
    'chat.speaking': 'Speaking...',
    'chat.listening': 'Listening...',
    'chat.ready': 'Ready to help',
    'chat.placeholder.listening': '🎤 Listening... ',
    'chat.placeholder.processing': '⏳ Waiting for AI response...',
    'chat.placeholder.default': '💬 Type message or use voice...',
    'chat.status.listening': '🎤 Listening to your voice...',
    'chat.status.processing': '🤖 AI is thinking...',
    'chat.status.speaking': '🔊 AI is speaking...',
    'chat.ai.thinking': 'AI is thinking',
    'chat.speak.stop': 'Stop speaking',
    'chat.speak.play': 'Listen to this message',
    'chat.audio.on': 'Turn off audio',
    'chat.audio.off': 'Turn on audio',

    // Virtual Room
    'room.listening': 'Listening...',
    'room.speaking': 'Speaking...',
    'room.ready': 'is ready to help',

    // Language Selector
    'language.vietnamese': 'Tiếng Việt',
    'language.english': 'English',
    'language.select': 'Select language',

    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.forgotPassword': 'Forgot Password',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.resetPasswordButton': 'Send Reset Email',
    'auth.processing': 'Processing...',
    'auth.welcomeBack': 'Welcome back!',
    'auth.createAccount': 'Create a new account to get started',
    'auth.resetPasswordDesc': 'Enter your email to reset password',
    'auth.forgotPasswordLink': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.registerNow': 'Register now',
    'auth.hasAccount': 'Already have an account?',
    'auth.loginNow': 'Login',
    'auth.rememberPassword': 'Remember your password?',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.enterName': 'Enter your full name',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.emailRequired': 'Email is required',
    'auth.emailInvalid': 'Invalid email address',
    'auth.passwordRequired': 'Password is required',
    'auth.passwordMinLength': 'Password must be at least 6 characters',
    'auth.nameRequired': 'Name is required',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.emailExists': 'This email is already in use',
    'auth.userNotFound': 'No account found with this email',
    'auth.resetEmailSent': 'Password reset email has been sent!',
    'auth.accountSettings': 'Account Settings',
    'auth.logout': 'Logout'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}