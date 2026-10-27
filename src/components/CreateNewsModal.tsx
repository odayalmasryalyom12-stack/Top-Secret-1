import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewsPost } from '../types';
import { PlusCircle, Image, Sparkles, X, AlertCircle } from 'lucide-react';

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ isOpen, onClose }) => {
  const { addNewsPost, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsPost['category']>('إعلان عاجل');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/school_campus_hero_1793123394239.jpg');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  if (currentUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center" dir="rtl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">صلاحية غير مصرح بها</h3>
          <p className="text-sm text-slate-600 mb-4">
            وفقاً لتعليمات النظام، نشر الأخبار والإعلانات الرسمية محصور بإدارة المدرسة (المدير: محمد عمر) فقط، ولا يحق للمعلم أو ولي الأمر النشر.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold"
          >
            حسناً
          </button>
        </div>
      </div>
    );
  }

  const presetImages = [
    { label: 'مبنى المدرسة والفناء', url: '/src/assets/images/school_campus_hero_1793123394239.jpg' },
    { label: 'معرض العلوم والابتكار', url: '/src/assets/images/school_science_fair_1793123394557.jpg' },
    { label: 'الفصول التفاعلية الذكية', url: '/src/assets/images/school_classroom_lesson_1793123395098.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('يرجى كتابة عنوان وتفاصيل الخبر');
      return;
    }

    const success = addNewsPost({
      title: title.trim(),
      content: content.trim(),
      category,
      image: imageUrl || undefined,
      isPinned,
    });

    if (success) {
      setTitle('');
      setContent('');
      onClose();
    } else {
      setError('حدث خطأ أثناء نشر الخبر');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden text-right max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold">نشر خبر مدرسي رسمي</h3>
              <p className="text-xs text-blue-100">بصلاحية الإدارة المدرسية: المدير محمد عمر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              تصنيف الخبر:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsPost['category'])}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="إعلان عاجل">إعلان عاجل</option>
              <option value="فعالية مدرسية">فعالية مدرسية</option>
              <option value="جدول الامتحانات">جدول الامتحانات</option>
              <option value="تكريم وتفوق">تكريم وتفوق</option>
              <option value="أخبار عامة">أخبار عامة</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              عنوان الخبر أو الإعلان:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: موعد اختبارات نهاية الشهر الأول وتكريم الأوائل"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
            </input>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              تفاصيل المحتوى:
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب البيان الرسمي أو الإعلان لجميع المعلمين وأولياء الأمور والطلاب..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>صورة الخبر:</span>
              <span className="text-[11px] text-slate-400 font-normal">اختر من النماذج أو ارفع صورة</span>
            </label>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetImages.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUrl(img.url)}
                  className={`border rounded-lg p-1 text-center transition-all ${
                    imageUrl === img.url
                      ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-16 object-cover rounded mb-1"
                  />
                  <span className="text-[10px] text-slate-600 line-clamp-1">{img.label}</span>
                </button>
              ))}
            </div>

            {/* Custom file upload */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors border border-slate-300">
                <Image className="w-4 h-4 text-slate-600" />
                <span>رفع صورة من جهازك</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {imageUrl && (
                <span className="text-xs text-emerald-600 font-medium">
                  تم تحديد الصورة بنجاح
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pin-post"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="pin-post" className="text-xs font-medium text-slate-700 cursor-pointer">
              تثبيت الخبر في أعلى الصفحة المدرسية (مهم جداً)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>نشر الخبر الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
