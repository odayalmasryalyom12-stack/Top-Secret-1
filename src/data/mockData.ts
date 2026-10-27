import { User, ScheduleItem, NewsPost, ChatMessage } from '../types';
import avatarMohamed from '../assets/images/school_principal_portrait_1793123394275.jpg';
import avatarHekmat from '../assets/images/avatar_social_specialist_1793123652675.jpg';
import avatarSalah from '../assets/images/avatar_control_director_1793123652325.jpg';
import imgScienceFair from '../assets/images/school_science_fair_1793123394557.jpg';
import imgClassroom from '../assets/images/school_classroom_lesson_1793123395098.jpg';

// Only the 3 official administration accounts requested by the user. No fake accounts!
export const INITIAL_USERS: User[] = [
  {
    id: 'admin-mohamed-omar',
    username: '115007',
    name: 'محمد عمر',
    role: 'admin',
    jobTitle: 'مدير المدرسة',
    phone: '+20101150070',
    password: '160508',
    avatar: avatarMohamed,
    status: 'active',
    joinedDate: '2024-01-01',
    isVipAdmin: true,
  },
  {
    id: 'admin-hekmat-sadek',
    username: '115008',
    name: 'همت صادق',
    role: 'admin',
    jobTitle: 'الأخصائية الاجتماعية',
    phone: '+20101150080',
    password: '160509',
    avatar: avatarHekmat,
    status: 'active',
    joinedDate: '2024-01-01',
    isVipAdmin: true,
  },
  {
    id: 'admin-salah-labban',
    username: '115009',
    name: 'صلاح اللبان',
    role: 'admin',
    jobTitle: 'مدير الكنترول',
    phone: '+20101150090',
    password: '160510',
    avatar: avatarSalah,
    status: 'active',
    joinedDate: '2024-01-01',
    isVipAdmin: true,
  },
];

// Official school news posted by the administration
export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'news-1',
    title: 'افتتاح معرض الابتكار العلمي والروبوتيك برعاية إدارة المدرسة',
    content: 'تعلن إدارة المدرسة عن انطلاق فعاليات معرض الابتكار والذكاء الاصطناعي السنوي بمشاركة طلاب المدرسة في مختبرات العلوم والتكنولوجيا، نرحب بجميع أولياء الأمور والطلاب.',
    category: 'فعالية مدرسية',
    date: '27 أكتوبر 2026',
    authorName: 'المدير: محمد عمر',
    authorRole: 'admin',
    image: imgScienceFair,
    likesCount: 12,
    isPinned: true,
    comments: [],
  },
  {
    id: 'news-2',
    title: 'بدء تطبيق نظام الحصص التفاعلية في الفصول الذكية المتطورة',
    content: 'تم تزويد كافة قاعات المدرسة بشاشات تفاعلية ذكية متصلة بالشبكة الداخلية، لتسهيل متابعة الدروس والجداول اليومية.',
    category: 'أخبار عامة',
    date: '25 أكتوبر 2026',
    authorName: 'المدير: محمد عمر',
    authorRole: 'admin',
    image: imgClassroom,
    likesCount: 8,
    comments: [],
  },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [];
export const INITIAL_MESSAGES: ChatMessage[] = [];
