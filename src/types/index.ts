export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  username: string; // e.g. "115007" for VIP Admin Mohamed Omar, "oday_jamal", "t_ahmed"
  name: string; // e.g. "محمد عمر", "عدي جمال"
  role: UserRole;
  phone: string;
  password?: string;
  email?: string;
  avatar: string;
  grade?: string; // For students or parent's child
  subject?: string; // For teachers
  studentName?: string; // For parents
  studentId?: string; // For parents
  status: 'active' | 'suspended';
  joinedDate: string;
  isVipAdmin?: boolean;
  jobTitle?: string; // e.g. "مدير المدرسة", "الأخصائية الاجتماعية", "مدير الكنترول"
}

export interface ScheduleItem {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  day: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  startTime: string; // e.g. "08:00 ص"
  endTime: string; // e.g. "08:50 ص"
  period: number; // 1, 2, 3...
  classroom: string; // e.g. "قاعة 101"
  grade: string; // e.g. "الصف الثالث الثانوي"
  notes?: string;
}

export interface NewsComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  time: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: 'إعلان عاجل' | 'فعالية مدرسية' | 'جدول الامتحانات' | 'تكريم وتفوق' | 'أخبار عامة';
  date: string;
  authorName: string;
  authorRole: 'admin';
  image?: string;
  likesCount: number;
  comments: NewsComment[];
  isPinned?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverUsername: string;
  receiverName: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface SchoolFile {
  id: string;
  name: string;
  category: 'مذكرات دراسية' | 'جداول واختبارات' | 'كتب وواجبات' | 'أوراق عمل' | 'أخرى';
  uploaderName: string;
  uploaderRole: UserRole;
  size: string;
  uploadDate: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'image' | 'link';
  isGoogleDriveLink?: boolean;
}
