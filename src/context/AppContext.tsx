import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ScheduleItem, NewsPost, ChatMessage, UserRole, SchoolFile } from '../types';
import { INITIAL_USERS, INITIAL_NEWS, INITIAL_SCHEDULES, INITIAL_MESSAGES } from '../data/mockData';

interface AppContextType {
  users: User[];
  currentUser: User | null;
  news: NewsPost[];
  schedules: ScheduleItem[];
  messages: ChatMessage[];
  files: SchoolFile[];
  activeTab: 'news' | 'schedules' | 'messages' | 'files' | 'admin';
  setActiveTab: (tab: 'news' | 'schedules' | 'messages' | 'files' | 'admin') => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (identifier: string, password?: string) => { success: boolean; message?: string; user?: User };
  loginWithMicrosoftAccount: (name: string, role: UserRole, phone: string) => void;
  loginWithGoogleAccount: (name: string, role: UserRole, phone: string) => void;
  loginWithMicrosoft: () => void;
  loginWithGoogle: () => void;
  register: (userData: {
    name: string;
    username: string;
    phone: string;
    password: string;
    role: UserRole;
    grade?: string;
    subject?: string;
    studentName?: string;
  }) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  switchUser: (userId: string) => void;
  // School Files / Drive Actions
  addSchoolFile: (data: Omit<SchoolFile, 'id' | 'uploadDate' | 'uploaderName' | 'uploaderRole'>) => void;
  deleteSchoolFile: (id: string) => void;
  // News Actions
  addNewsPost: (data: { title: string; content: string; category: NewsPost['category']; image?: string; isPinned?: boolean }) => boolean;
  updateNewsPost: (id: string, updates: Partial<NewsPost>) => void;
  deleteNewsPost: (id: string) => void;
  likeNewsPost: (id: string) => void;
  addNewsComment: (postId: string, text: string) => void;
  // Schedule Actions
  addScheduleItem: (data: Omit<ScheduleItem, 'id' | 'teacherName'>) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  // Messaging Actions
  sendMessage: (receiverUsernameOrId: string, content: string, imageUrl?: string) => { success: boolean; message?: string };
  markMessagesAsRead: (otherUsernameOrId: string) => void;
  // User Management
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addUser: (userData: Omit<User, 'id' | 'joinedDate'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fresh storage key so previous automatic login sessions are completely cleared
const STORAGE_KEYS = {
  USERS: 'school_platform_users_v10',
  NEWS: 'school_platform_news_v10',
  SCHEDULES: 'school_platform_schedules_v10',
  MESSAGES: 'school_platform_messages_v10',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // STRICTLY NULL: NEVER automatically log into Mohamed Omar or any account!
  // The user MUST choose to log in or create an account.
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [news, setNews] = useState<NewsPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NEWS;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SCHEDULES;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });

  const [files, setFiles] = useState<SchoolFile[]>(() => {
    try {
      const saved = localStorage.getItem('school_platform_files_v10');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'file-1',
        name: 'جدول مواعيد الحصص والاختبارات الشهرية الفصل الأول.pdf',
        category: 'جداول واختبارات',
        uploaderName: 'محمد عمر (المدير)',
        uploaderRole: 'admin',
        size: '1.4 ميجابايت',
        uploadDate: 'اليوم',
        fileUrl: '#',
        fileType: 'pdf',
      },
      {
        id: 'file-2',
        name: 'مذكرة المراجعة النهائية في الجبر والهندسة الفراغية.pdf',
        category: 'مذكرات دراسية',
        uploaderName: 'أحمد الشناوي',
        uploaderRole: 'teacher',
        size: '3.2 ميجابايت',
        uploadDate: 'أمس',
        fileUrl: '#',
        fileType: 'pdf',
      },
      {
        id: 'file-3',
        name: 'رابط مجلد Google Drive المشترك للمواد العلمية',
        category: 'أخرى',
        uploaderName: 'صلاح اللبان',
        uploaderRole: 'admin',
        size: 'رابط سحابي',
        uploadDate: '26 أكتوبر',
        fileUrl: 'https://drive.google.com',
        fileType: 'link',
        isGoogleDriveLink: true,
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<'news' | 'schedules' | 'messages' | 'files' | 'admin'>('news');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('school_platform_files_v10', JSON.stringify(files));
  }, [files]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  // Login handler
  const login = (identifier: string, password?: string) => {
    const trimmedId = identifier.trim();
    const trimmedPass = (password || '').trim();

    // 1. VIP Admin Accounts:
    if (trimmedId === '115007' && trimmedPass === '160508') {
      const admin = users.find((u) => u.username === '115007');
      if (admin) {
        setCurrentUserId(admin.id);
        setAuthModalOpen(false);
        return { success: true, user: admin, message: 'مرحباً بسيادة المدير محمد عمر!' };
      }
    }

    if (trimmedId === '115008' && trimmedPass === '160509') {
      const admin = users.find((u) => u.username === '115008');
      if (admin) {
        setCurrentUserId(admin.id);
        setAuthModalOpen(false);
        return { success: true, user: admin, message: 'مرحباً بالأخصائية الاجتماعية همت صادق!' };
      }
    }

    if (trimmedId === '115009' && trimmedPass === '160510') {
      const admin = users.find((u) => u.username === '115009');
      if (admin) {
        setCurrentUserId(admin.id);
        setAuthModalOpen(false);
        return { success: true, user: admin, message: 'مرحباً بالأستاذ صلاح اللبان مدير الكنترول!' };
      }
    }

    // 2. Regular User Login by Phone, Username or Name
    const cleanPhone = trimmedId.replace(/[\s-]/g, '');
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === trimmedId.toLowerCase() ||
        u.name.toLowerCase() === trimmedId.toLowerCase() ||
        u.phone.replace(/[\s-]/g, '').includes(cleanPhone)
    );

    if (!found) {
      return { success: false, message: 'لم يتم العثور على حساب بهذا الاسم أو الرقم' };
    }

    if (found.status === 'suspended') {
      return { success: false, message: 'تم إيقاف هذا الحساب مؤقتاً' };
    }

    if (found.password && trimmedPass && found.password !== trimmedPass) {
      return { success: false, message: 'كلمة المرور غير صحيحة' };
    }

    setCurrentUserId(found.id);
    setAuthModalOpen(false);
    return { success: true, user: found, message: `أهلاً بك يا ${found.name}` };
  };

  // Real Microsoft Account Sign Up / Sign In
  const loginWithMicrosoftAccount = (name: string, role: UserRole, phone: string) => {
    const cleanName = name.trim();
    // Check if account already exists with this name or phone
    let existing = users.find(
      (u) => u.name.toLowerCase() === cleanName.toLowerCase() || u.phone === phone
    );

    if (existing) {
      setCurrentUserId(existing.id);
      return;
    }

    // Create real user with their Microsoft account details
    const newUser: User = {
      id: `ms-user-${Date.now()}`,
      username: `ms_${Date.now().toString().slice(-4)}`,
      name: cleanName,
      role: role,
      phone: phone || '+201000000000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      status: 'active',
      joinedDate: 'اليوم',
      subject: role === 'teacher' ? 'معلم مادة' : undefined,
      studentName: role === 'parent' ? 'طالب بالمدرسة' : undefined,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
  };

  // Real Google Account Sign Up / Sign In
  const loginWithGoogleAccount = (name: string, role: UserRole, phone: string) => {
    const cleanName = name.trim();
    let existing = users.find(
      (u) => u.name.toLowerCase() === cleanName.toLowerCase() || u.phone === phone
    );

    if (existing) {
      setCurrentUserId(existing.id);
      return;
    }

    const newUser: User = {
      id: `google-user-${Date.now()}`,
      username: `g_${Date.now().toString().slice(-4)}`,
      name: cleanName,
      role: role,
      phone: phone || '+201000000000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      status: 'active',
      joinedDate: 'اليوم',
      subject: role === 'teacher' ? 'معلم مادة' : undefined,
      studentName: role === 'parent' ? 'طالب بالمدرسة' : undefined,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
  };

  const loginWithMicrosoft = () => {
    loginWithMicrosoftAccount('مستخدم مايكروسوفت', 'teacher', '+20101150071');
  };

  const loginWithGoogle = () => {
    loginWithGoogleAccount('مستخدم جوجل التعليمي', 'parent', '+20101150072');
  };

  const register = (data: {
    name: string;
    username: string;
    phone: string;
    password: string;
    role: UserRole;
    grade?: string;
    subject?: string;
    studentName?: string;
  }) => {
    const usernameClean = data.username.trim().toLowerCase();
    const existing = users.find(
      (u) => u.username.toLowerCase() === usernameClean || u.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, message: 'اسم المستخدم أو الاسم مسجل بالفعل، يرجى اختيار اسم آخر' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: usernameClean,
      name: data.name.trim(),
      phone: data.phone.trim(),
      password: data.password.trim(),
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      grade: data.grade,
      subject: data.subject,
      studentName: data.studentName,
      status: 'active',
      joinedDate: 'اليوم',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setAuthModalOpen(false);
    return { success: true, user: newUser, message: 'تم إنشاء الحساب بنجاح، أهلاً بك!' };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Only Admin can post/edit news
  const addNewsPost = (data: {
    title: string;
    content: string;
    category: NewsPost['category'];
    image?: string;
    isPinned?: boolean;
  }) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }

    const newPost: NewsPost = {
      id: `news-${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category,
      date: 'اليوم',
      authorName: `${currentUser.jobTitle || 'المدير'}: ${currentUser.name}`,
      authorRole: 'admin',
      image: data.image,
      likesCount: 0,
      comments: [],
      isPinned: data.isPinned || false,
    };

    setNews((prev) => [newPost, ...prev]);
    return true;
  };

  const updateNewsPost = (id: string, updates: Partial<NewsPost>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setNews((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteNewsPost = (id: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setNews((prev) => prev.filter((p) => p.id !== id));
  };

  const likeNewsPost = (id: string) => {
    setNews((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  const addNewsComment = (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const comment = {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: text.trim(),
      time: 'الآن',
    };
    setNews((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
    );
  };

  const addSchoolFile = (data: Omit<SchoolFile, 'id' | 'uploadDate' | 'uploaderName' | 'uploaderRole'>) => {
    if (!currentUser) return;
    const newFile: SchoolFile = {
      ...data,
      id: `file-${Date.now()}`,
      uploadDate: 'اليوم',
      uploaderName: currentUser.name,
      uploaderRole: currentUser.role,
    };
    setFiles((prev) => [newFile, ...prev]);
  };

  const deleteSchoolFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Schedules
  const addScheduleItem = (data: Omit<ScheduleItem, 'id' | 'teacherName'>) => {
    const teacher = users.find((u) => u.id === data.teacherId);
    const newItem: ScheduleItem = {
      ...data,
      id: `sch-${Date.now()}`,
      teacherName: teacher ? teacher.name : 'معلم المادة',
    };
    setSchedules((prev) => [...prev, newItem]);
  };

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteScheduleItem = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // Messaging by name or username
  const sendMessage = (receiverUsernameOrId: string, content: string, imageUrl?: string) => {
    if (!currentUser) {
      return { success: false, message: 'يرجى تسجيل الدخول أولاً' };
    }
    const cleanSearch = receiverUsernameOrId.trim().toLowerCase();
    const receiver = users.find(
      (u) =>
        u.id === cleanSearch ||
        u.username.toLowerCase() === cleanSearch ||
        u.name.toLowerCase() === cleanSearch
    );
    if (!receiver) {
      return { success: false, message: 'لم يتم العثور على هذا المستخدم' };
    }

    if (receiver.id === currentUser.id) {
      return { success: false, message: 'لا يمكنك مراسلة نفسك' };
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: receiver.id,
      receiverUsername: receiver.username,
      receiverName: receiver.name,
      content: content.trim(),
      imageUrl,
      timestamp: 'الآن',
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    return { success: true };
  };

  const markMessagesAsRead = (otherUsernameOrId: string) => {
    if (!currentUser) return;
    const clean = otherUsernameOrId.toLowerCase();
    setMessages((prev) =>
      prev.map((m) => {
        if (
          m.receiverId === currentUser.id &&
          (m.senderUsername.toLowerCase() === clean || m.senderId === clean || m.senderName.toLowerCase() === clean)
        ) {
          return { ...m, read: true };
        }
        return m;
      })
    );
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const addUser = (userData: Omit<User, 'id' | 'joinedDate'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      joinedDate: 'اليوم',
    };
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        news,
        schedules,
        messages,
        files,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        loginWithMicrosoftAccount,
        loginWithGoogleAccount,
        loginWithMicrosoft,
        loginWithGoogle,
        register,
        logout,
        switchUser,
        addSchoolFile,
        deleteSchoolFile,
        addNewsPost,
        updateNewsPost,
        deleteNewsPost,
        likeNewsPost,
        addNewsComment,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        sendMessage,
        markMessagesAsRead,
        updateUser,
        deleteUser,
        addUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
