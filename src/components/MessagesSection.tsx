import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, ChatMessage } from '../types';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  UserCheck, 
  CheckCheck, 
  MessageSquare, 
  X, 
  ExternalLink,
  ShieldCheck,
  Phone,
  Sparkles
} from 'lucide-react';

export const MessagesSection: React.FC = () => {
  const { 
    currentUser, 
    users, 
    messages, 
    sendMessage, 
    markMessagesAsRead, 
    setAuthModalOpen 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceiverUsername, setActiveReceiverUsername] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewLightboxImage, setPreviewLightboxImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If not logged in, prompt user to log in
  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">سجل الدخول لبدء المراسلة</h3>
        <p className="text-sm text-slate-500">
          يمكنك البحث عن أي اسم مستخدم (Username) موجود في المنصة وإرسال واستقبال الرسائل والصور بشكل مباشر وآمن.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          تسجيل الدخول الآن
        </button>
      </div>
    );
  }

  // Find all distinct conversation partners for current user
  const userConversations = Array.from(
    new Set(
      messages
        .filter(
          (m) =>
            m.senderUsername.toLowerCase() === currentUser.username.toLowerCase() ||
            m.receiverUsername.toLowerCase() === currentUser.username.toLowerCase()
        )
        .map((m) =>
          m.senderUsername.toLowerCase() === currentUser.username.toLowerCase()
            ? m.receiverUsername
            : m.senderUsername
        )
    )
  ).map((username) => {
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    const userMsgs = messages.filter(
      (m) =>
        (m.senderUsername.toLowerCase() === currentUser.username.toLowerCase() &&
          m.receiverUsername.toLowerCase() === username.toLowerCase()) ||
        (m.senderUsername.toLowerCase() === username.toLowerCase() &&
          m.receiverUsername.toLowerCase() === currentUser.username.toLowerCase())
    );
    const lastMsg = userMsgs[userMsgs.length - 1];
    const unreadCount = userMsgs.filter(
      (m) => m.receiverUsername.toLowerCase() === currentUser.username.toLowerCase() && !m.read
    ).length;

    return {
      username,
      user,
      lastMsg,
      unreadCount,
    };
  });

  // Set default active conversation if none selected
  useEffect(() => {
    if (!activeReceiverUsername && userConversations.length > 0) {
      setActiveReceiverUsername(userConversations[0].username);
    }
  }, [userConversations, activeReceiverUsername]);

  // Mark read when conversation is open
  useEffect(() => {
    if (activeReceiverUsername) {
      markMessagesAsRead(activeReceiverUsername);
    }
  }, [activeReceiverUsername, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeReceiverUsername]);

  // Current active receiver object
  const activeReceiver = users.find(
    (u) => u.username.toLowerCase() === (activeReceiverUsername || '').toLowerCase()
  );

  // Filtered conversation messages
  const activeConversationMessages = messages.filter(
    (m) =>
      (m.senderUsername.toLowerCase() === currentUser.username.toLowerCase() &&
        m.receiverUsername.toLowerCase() === (activeReceiverUsername || '').toLowerCase()) ||
      (m.senderUsername.toLowerCase() === (activeReceiverUsername || '').toLowerCase() &&
        m.receiverUsername.toLowerCase() === currentUser.username.toLowerCase())
  );

  // Search results based on username or name
  const searchResults = users.filter((u) => {
    if (u.id === currentUser.id) return false;
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      u.username.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || !activeReceiverUsername) return;

    sendMessage(activeReceiverUsername, inputText, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير المدرسة / إدارة';
      case 'teacher':
        return 'معلم';
      case 'parent':
        return 'ولي أمر';
      case 'student':
        return 'طالب';
      default:
        return 'مستخدم';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4" dir="rtl">
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>نظام الرسائل والمحادثات المدرسية المباشرة</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ابحث عن أي يوزر نيم (Username) في المدرسة وتواصل معه فورياً مع إمكانية مشاركة الصور
            </p>
          </div>

          {/* Quick Username Suggestions Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">حسابات سريعة:</span>
            {users.slice(0, 5).map((u) => {
              if (u.id === currentUser.id) return null;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setActiveReceiverUsername(u.username);
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] rounded-lg transition-colors border border-slate-200 font-mono"
                >
                  @{u.username} ({u.name.split(' ')[0]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedicated Search Bar By Name */}
        <div className="mt-4 relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearching(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              placeholder="🔍 ابحث بالاسم الشخصي (مثال: محمد، همت، صلاح، عدي...) أو باليوزر نيم"
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearching(false);
                }}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Member Directory below search */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-700">دليل الأعضاء المتاحين للمحادثة:</span>
            {users
              .filter((u) => u.id !== currentUser.id)
              .map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setActiveReceiverUsername(u.username);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    activeReceiverUsername?.toLowerCase() === u.username.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-[10px] opacity-75">
                    ({u.role === 'admin' ? (u.jobTitle || 'إدارة') : u.role === 'teacher' ? 'معلم' : 'ولي أمر'})
                  </span>
                </button>
              ))}
          </div>

          {/* Search Results Dropdown */}
          {isSearching && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden max-h-72 overflow-y-auto">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                نتائج البحث بالاسم أو اليوزر نيم عن: "{searchQuery}"
              </div>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  لم يتم العثور على شخص بهذا الاسم. تأكد من صحة الحروف.
                </div>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setActiveReceiverUsername(user.username);
                      setSearchQuery('');
                      setIsSearching(false);
                    }}
                    className="w-full p-3 hover:bg-blue-50 transition-colors flex items-center justify-between text-right border-b border-slate-100 last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {user.jobTitle || getRoleLabel(user.role)}
                        </div>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                        مراسلة فورية
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Messaging Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar: Recent Conversations List */}
        <div className="md:col-span-4 border-l border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="text-xs font-bold text-slate-700">المحادثات النشطة</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {userConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                لا توجد محادثات سابقة. استخدم شريط البحث أعلاه باليوزر نيم لبدء محادثتك الأولى.
              </div>
            ) : (
              userConversations.map((conv) => {
                const isActive =
                  activeReceiverUsername?.toLowerCase() === conv.username.toLowerCase();
                return (
                  <button
                    key={conv.username}
                    onClick={() => setActiveReceiverUsername(conv.username)}
                    className={`w-full p-3.5 flex items-start gap-3 transition-colors text-right ${
                      isActive ? 'bg-white shadow-2xs border-r-3 border-blue-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <img
                      src={conv.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                      alt={conv.user?.name || conv.username}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover bg-slate-200 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {conv.user?.name || conv.username}
                        </span>
                        {conv.lastMsg && (
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {conv.lastMsg.timestamp}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {conv.lastMsg?.imageUrl && !conv.lastMsg?.content ? (
                            <span className="text-blue-600 font-medium">📷 صورة مرفقة</span>
                          ) : (
                            conv.lastMsg?.content || 'ابدأ المحادثة الآن'
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold font-mono">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Active Chat Conversation */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {activeReceiver ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={activeReceiver.avatar}
                    alt={activeReceiver.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{activeReceiver.name}</span>
                      {activeReceiver.role === 'admin' && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-600" /> إدارة
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      اليوزر نيم: @{activeReceiver.username} · {getRoleLabel(activeReceiver.role)}
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> متصل الآن
                  </span>
                  {activeReceiver.phone && (
                    <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                      {activeReceiver.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
                {activeConversationMessages.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                    <Sparkles className="w-8 h-8 text-blue-500 mx-auto" />
                    <p className="font-bold text-slate-700">هذه بداية المحادثة مع {activeReceiver.name}</p>
                    <p>أرسل أول رسالة أو شارك صورة للمتابعة والتواصل.</p>
                  </div>
                ) : (
                  activeConversationMessages.map((msg) => {
                    const isMe = msg.senderUsername.toLowerCase() === currentUser.username.toLowerCase();
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 shadow-2xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          {/* Attached image in chat */}
                          {msg.imageUrl && (
                            <div 
                              onClick={() => setPreviewLightboxImage(msg.imageUrl || null)}
                              className="relative rounded-xl overflow-hidden cursor-pointer group bg-slate-900/10 border border-black/10"
                            >
                              <img
                                src={msg.imageUrl}
                                alt="مرفق صورة"
                                referrerPolicy="no-referrer"
                                className="w-full max-h-60 object-cover rounded-lg group-hover:opacity-95 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>تكبير الصورة</span>
                              </div>
                            </div>
                          )}

                          {msg.content && <p className="whitespace-pre-line">{msg.content}</p>}

                          <div
                            className={`flex items-center justify-between text-[10px] pt-1 gap-3 ${
                              isMe ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            <span className="font-mono">{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 bg-white space-y-2 shrink-0">
                {/* Image Attachment Preview before send */}
                {selectedImage && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <img
                      src={selectedImage}
                      alt="معاينة الصورة"
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                    <div className="text-xs text-slate-600 flex-1">
                      <span className="font-bold block">تم تجهيز الصورة للإرسال</span>
                      <span className="text-[10px] text-slate-400">ستظهر في المحادثة مع نص رسالتك</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="p-1 hover:bg-slate-200 rounded-lg text-slate-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  {/* Image attachment button */}
                  <label 
                    title="إرفاق صورة"
                    className="p-2.5 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer transition-colors border border-slate-200 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Text input */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`اكتب رسالة إلى @${activeReceiver.username}...`}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() && !selectedImage}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                    <span>إرسال</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center text-slate-400 text-xs">
              اختر محادثة من القائمة الجانبية أو ابحث باليوزر نيم في الأعلى لبدء الدردشة ومشاركة الصور.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for Full-screen Image Viewing */}
      {previewLightboxImage && (
        <div
          onClick={() => setPreviewLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={previewLightboxImage}
              alt="معاينة الصورة بالحجم الكامل"
              className="max-h-[85vh] w-auto mx-auto rounded-xl shadow-2xl border border-white/20"
            />
            <div className="text-center text-white/80 text-xs mt-3">انقر في أي مكان للإغلاق</div>
          </div>
        </div>
      )}
    </div>
  );
};
