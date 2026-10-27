import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewsPost } from '../types';
import { 
  PlusCircle, 
  Heart, 
  MessageCircle, 
  Pin, 
  ShieldCheck, 
  Trash2, 
  ExternalLink, 
  Send,
  Calendar,
  Lock,
  Sparkles
} from 'lucide-react';
import { CreateNewsModal } from './CreateNewsModal';

export const NewsSection: React.FC = () => {
  const { news, currentUser, likeNewsPost, addNewsComment, deleteNewsPost } = useApp();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const categories = ['all', 'إعلان عاجل', 'فعالية مدرسية', 'جدول الامتحانات', 'تكريم وتفوق', 'أخبار عامة'];

  const filteredNews = news.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (text && text.trim()) {
      addNewsComment(postId, text);
      setCommentInputs({ ...commentInputs, [postId]: '' });
      setExpandedComments({ ...expandedComments, [postId]: true });
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              المركز الإعلامي واللوحة الرسمية
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">سيرفر: 10.14.88.25</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            أخبار وإعلانات مدرسة المستقبل
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حية للقرارات الرسمية، الأنشطة المدرسية، والمواعيد الدراسية المعتمدة
          </p>
        </div>

        {/* Action Button: ONLY Admin can publish news! */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {isAdmin ? (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>نشر خبر أو إعلان رسمي جديد</span>
            </button>
          ) : (
            <div className="w-full md:w-auto flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs border border-slate-200">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>نشر الأخبار مقتصر على إدارة المدرسة فقط</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'جميع الأخبار والبيانات' : cat}
          </button>
        ))}
      </div>

      {/* News Feed Cards */}
      <div className="space-y-6">
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-sm">لا توجد أخبار في هذا التصنيف حالياً.</p>
          </div>
        ) : (
          filteredNews.map((post) => (
            <article
              key={post.id}
              className={`bg-white rounded-2xl border transition-shadow overflow-hidden ${
                post.isPinned ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {post.authorName.includes('محمد عمر') ? 'م.ع' : 'إدارة'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-600" /> إدارة معتمدة
                      </span>
                      {post.isPinned && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                          <Pin className="w-3 h-3" /> مثبت
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-blue-600 font-medium">{post.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin controls: delete */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من حذف هذا الخبر نهائياً؟')) {
                        deleteNewsPost(post.id);
                      }
                    }}
                    title="حذف هذا الخبر (صلاحية المدير)"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Title & Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Attached Image if present */}
                {post.image && (
                  <div 
                    onClick={() => setPreviewImage(post.image || null)}
                    className="relative cursor-pointer group rounded-xl overflow-hidden border border-slate-200 mt-3 max-h-[420px] bg-slate-900"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[420px] object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                      <ExternalLink className="w-4 h-4" />
                      <span>تكبير الصورة</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement Bar: Likes & Comments */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => likeNewsPost(post.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                    <span className="font-mono tabular-nums">{post.likesCount}</span>
                    <span>إعجاب</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments({
                        ...expandedComments,
                        [post.id]: !expandedComments[post.id],
                      })
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="font-mono tabular-nums">{post.comments.length}</span>
                    <span>تعليقات</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400">
                  مشاركة وتفاعل أولياء الأمور والمعلمين
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-5 pt-3 bg-slate-50/60 border-t border-slate-100 space-y-3">
                {post.comments.length > 0 && (
                  <div className="space-y-2.5">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs shadow-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{comment.authorName}</span>
                            <span className="text-[10px] text-slate-400">
                              ({comment.authorRole === 'parent' ? 'ولي أمر' : comment.authorRole === 'teacher' ? 'معلم' : 'إدارة'})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{comment.time}</span>
                        </div>
                        <p className="text-slate-700 leading-normal">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                {currentUser ? (
                  <form
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="flex items-center gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      placeholder={`اكتب تعليقاً بصفتك ${currentUser.name}...`}
                      className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5 rotate-180" />
                      <span>إرسال</span>
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-1">
                    سجل الدخول للمشاركة بالتعليق على الإعلانات الرسمية
                  </p>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal for Admin to create news */}
      <CreateNewsModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={previewImage}
              alt="معاينة الصورة"
              className="max-h-[85vh] w-auto mx-auto rounded-xl shadow-2xl border border-white/20"
            />
            <div className="text-center text-white/80 text-xs mt-3">انقر في أي مكان للإغلاق</div>
          </div>
        </div>
      )}
    </div>
  );
};
