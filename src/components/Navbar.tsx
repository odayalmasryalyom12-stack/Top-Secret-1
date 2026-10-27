import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Newspaper, 
  CalendarDays, 
  MessageSquare, 
  ShieldAlert, 
  LogIn, 
  LogOut, 
  UserCheck, 
  Globe, 
  ChevronDown,
  Menu,
  X,
  FolderDown,
  Download
} from 'lucide-react';
import { IpLinkModal } from './IpLinkModal';
import { InstallAppModal } from './InstallAppModal';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setAuthModalOpen, 
    logout, 
    users, 
    switchUser,
    messages
  } = useApp();

  const [isIpModalOpen, setIpModalOpen] = useState(false);
  const [isInstallModalOpen, setInstallModalOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Unread messages count for current user
  const unreadCount = currentUser 
    ? messages.filter(m => m.receiverUsername.toLowerCase() === currentUser.username.toLowerCase() && !m.read).length 
    : 0;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="text-amber-700 font-semibold text-xs">مدير المدرسة (VIP)</span>;
      case 'teacher':
        return <span className="text-blue-700 font-semibold text-xs">معلم معتمد</span>;
      case 'parent':
        return <span className="text-emerald-700 font-semibold text-xs">ولي أمر</span>;
      case 'student':
        return <span className="text-purple-700 font-semibold text-xs">طالب</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Zone 1: Brand Mark */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div 
                onClick={() => setActiveTab('news')}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                    مدرسة المستقبل الذكية
                  </span>
                  <span className="text-xs text-slate-500 hidden sm:block">
                    منصة التواصل والجداول المدرسية
                  </span>
                </div>
              </div>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'news'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>أخبار المدرسة</span>
              </button>

              <button
                onClick={() => setActiveTab('schedules')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'schedules'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>جدول الحصص</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>الرسائل الخاصة</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Files / Drive Tab */}
              <button
                onClick={() => setActiveTab('files')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'files'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FolderDown className="w-4 h-4" />
                <span>المستندات والملفات (Drive)</span>
              </button>

              {/* Admin Panel button - visible for everyone, full access for admin */}
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>لوحة المدير</span>
                {currentUser?.role === 'admin' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                )}
              </button>
            </nav>

            {/* Zone 3: Actions & Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Install on PC / Mobile button */}
              <button
                onClick={() => setInstallModalOpen(true)}
                title="تثبيت التطبيق على جهاز الكمبيوتر وسطح المكتب"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تثبيت كبرنامج (PC)</span>
                <span className="sm:hidden">تثبيت</span>
              </button>

              {/* Numerical IP Link Trigger */}
              <button
                onClick={() => setIpModalOpen(true)}
                title="عرض رابط السيرفر الرقمي IP"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden lg:inline" dir="ltr">10.14.88.25:8080</span>
                <span className="lg:hidden" dir="ltr">IP</span>
              </button>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200"
                    />
                    <div className="text-right hidden lg:block leading-tight pr-1">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{currentUser.name}</span>
                        {currentUser.isVipAdmin && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">VIP</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {getRoleBadge(currentUser.role)}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div 
                      className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-right"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="p-3 bg-slate-50 rounded-lg mb-2 border border-slate-100">
                        <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          اليوزر نيم: {currentUser.username}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          الهاتف: {currentUser.phone}
                        </div>
                        {currentUser.grade && (
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            {currentUser.grade}
                          </div>
                        )}
                        {currentUser.subject && (
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            التخصص: {currentUser.subject}
                          </div>
                        )}
                      </div>

                      {/* Quick Role Switcher for Test and Evaluation */}
                      <div className="px-2 py-1 text-xs text-slate-400 font-medium border-b border-slate-100 pb-1 mb-1">
                        تبديل الحساب السريع للمعاينة:
                      </div>

                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => switchUser(u.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-right ${
                              u.id === currentUser.id
                                ? 'bg-blue-50 text-blue-700 font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 rounded-md object-cover"
                              />
                              <div>
                                <span className="block leading-none">{u.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">@{u.username}</span>
                              </div>
                            </div>
                            {getRoleBadge(u.role)}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <button
                          onClick={logout}
                          className="w-full flex items-center justify-center gap-2 p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول / إنشاء حساب</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setActiveTab('news');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'news' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>أخبار المدرسة</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('schedules');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'schedules' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>جدول الحصص واليوم</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('messages');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'messages' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>الرسائل والمحادثات</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'admin' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>لوحة تحكم المدير</span>
            </button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setIpModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-blue-600 font-medium flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>رابط السيرفر IP: 10.14.88.25:8080</span>
              </button>

              <button
                onClick={() => {
                  setInstallModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-emerald-700 font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت التطبيق</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* IP Address Modal */}
      <IpLinkModal isOpen={isIpModalOpen} onClose={() => setIpModalOpen(false)} />

      {/* Install Desktop App Modal */}
      <InstallAppModal isOpen={isInstallModalOpen} onClose={() => setInstallModalOpen(false)} />
    </>
  );
};
