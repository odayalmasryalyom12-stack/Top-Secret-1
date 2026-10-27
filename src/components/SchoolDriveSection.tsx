import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolFile } from '../types';
import { 
  FolderPlus, 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Trash2, 
  UploadCloud, 
  File, 
  Image, 
  Link, 
  CheckCircle, 
  Sparkles,
  ShieldAlert,
  X
} from 'lucide-react';

export const SchoolDriveSection: React.FC = () => {
  const { files, addSchoolFile, deleteSchoolFile, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  // New file form
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<SchoolFile['category']>('مذكرات دراسية');
  const [fileType, setFileType] = useState<SchoolFile['fileType']>('pdf');
  const [fileLink, setFileLink] = useState('');
  const [fileSize, setFileSize] = useState('2.5 ميجابايت');

  const categories = ['all', 'مذكرات دراسية', 'جداول واختبارات', 'كتب وواجبات', 'أوراق عمل', 'أخرى'];

  const filteredFiles = files.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return f.name.toLowerCase().includes(q) || f.uploaderName.toLowerCase().includes(q);
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    addSchoolFile({
      name: fileName.trim(),
      category: fileCategory,
      fileType: fileType,
      fileUrl: fileLink.trim() || '#',
      size: fileSize,
      isGoogleDriveLink: fileType === 'link' || fileLink.includes('drive.google.com'),
    });

    setFileName('');
    setFileLink('');
    setUploadModalOpen(false);
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت`);
      if (file.type.includes('pdf')) setFileType('pdf');
      else if (file.type.includes('image')) setFileType('image');
      else setFileType('doc');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileLink(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canUpload = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              خزنة الملفات والمذكرات المدرسية
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 font-bold">مجاني 100% بدون أي رسوم</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            مكتبة الملفات ومستندات Google Drive
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تحميل المذكرات، نماذج الامتحانات، وأوراق العمل أو مشاركة روابط Google Drive مباشرة
          </p>
        </div>

        {canUpload ? (
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>رفع ملف أو إضافة رابط Google Drive</span>
          </button>
        ) : (
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
            يمكن للطلاب وأولياء الأمور تحميل وقراءة الملفات مباشرة
          </div>
        )}
      </div>

      {/* Free notice box */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-950">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>تنبيه هام ومريح:</strong> لا داعي لدفع 300 دولار أو الاشتراك في أي خدمات مدفوعة! يمكنك تخزين ومشاركة جميع ملفاتك ومذكراتك الدراسية هنا مجاناً تماماً، أو ربط روابط مجلدات Google Drive العادية دون الحاجة لأي بطاقة بنكية.
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 ابحث في الملفات والمذكرات بالاسم أو المعلم..."
            className="w-full pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'all' ? 'جميع الملفات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFiles.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            لا توجد ملفات حالياً في هذا التصنيف. يمكنك رفع أول ملف بالنقر على الزر أعلاه.
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  {file.isGoogleDriveLink ? (
                    <ExternalLink className="w-5 h-5 text-emerald-600" />
                  ) : file.fileType === 'pdf' ? (
                    <FileText className="w-5 h-5 text-rose-500" />
                  ) : (
                    <File className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{file.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span className="text-blue-600 font-medium">{file.category}</span>
                    <span>·</span>
                    <span>بواسطة: {file.uploaderName}</span>
                    <span>·</span>
                    <span className="font-mono">{file.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {file.isGoogleDriveLink ? (
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح في Drive</span>
                  </a>
                ) : (
                  <a
                    href={file.fileUrl}
                    download={file.name}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل</span>
                  </a>
                )}

                {(currentUser?.role === 'admin' || currentUser?.name === file.uploaderName) && (
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف ملف "${file.name}"؟`)) {
                        deleteSchoolFile(file.id);
                      }
                    }}
                    title="حذف الملف"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload File / Add Drive Link Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-300 overflow-hidden text-right"
            dir="rtl"
          >
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">رفع ملف جديد أو ربط Google Drive</h3>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  طريقة الإضافة:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setFileType('pdf')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      fileType !== 'link' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    ملف من جهازك (PDF / Word)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFileType('link')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      fileType === 'link' ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    رابط Google Drive
                  </button>
                </div>
              </div>

              {fileType !== 'link' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    اختر الملف من جهازك:
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-xs font-bold text-slate-700">اضغط لتحديد ملف من الكمبيوتر أو الهاتف</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">يدعم PDF, Word, الصور ومستندات الاختبارات</span>
                    <input
                      type="file"
                      onChange={handleLocalFile}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    رابط Google Drive المباشر:
                  </label>
                  <input
                    type="url"
                    required
                    value={fileLink}
                    onChange={(e) => setFileLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    dir="ltr"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    انسخ رابط مشاركة الملف أو المجلد من Google Drive والصقه هنا.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">اسم الملف أو المذكرة:</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="مثال: مذكرة الرياضيات - الوحدة الثانية"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">التصنيف:</label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value as SchoolFile['category'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="مذكرات دراسية">مذكرات دراسية</option>
                  <option value="جداول واختبارات">جداول واختبارات</option>
                  <option value="كتب وواجبات">كتب وواجبات</option>
                  <option value="أوراق عمل">أوراق عمل</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  حفظ ونشر الملف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
