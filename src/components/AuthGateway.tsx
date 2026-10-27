import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  LogIn, 
  UserPlus, 
  Lock, 
  User as UserIcon, 
  BookOpen, 
  Users, 
  Globe, 
  Check, 
  MapPin,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  X
} from 'lucide-react';

export const AuthGateway: React.FC = () => {
  const { 
    login, 
    loginWithMicrosoftAccount, 
    loginWithGoogleAccount, 
    register 
  } = useApp();

  const [activePortal, setActivePortal] = useState<'teacher_login' | 'parent_login' | 'reg_teacher' | 'reg_parent'>('teacher_login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regExtra, setRegExtra] = useState('');
  const [copiedIp, setCopiedIp] = useState(false);

  // Microsoft & Google Interactive Modal State
  const [socialModalType, setSocialModalType] = useState<'microsoft' | 'google' | null>(null);
  const [socialName, setSocialName] = useState('');
  const [socialPhone, setSocialPhone] = useState('');
  const [socialRole, setSocialRole] = useState<UserRole>('teacher');

  const primaryIp = 'http://10.14.88.25:8080';
  const schoolAddress = 'جمهورية مصر العربية، دمياط، دمياط الجديدة، المجاورة الثالثة';

  const handleCopyIp = () => {
    navigator.clipboard.writeText(primaryIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('يرجى كتابة اسم المستخدم/كود الدخول وكلمة المرور');
      return;
    }

    const res = login(identifier, password);
    if (!res.success) {
      setErrorMsg(res.message || 'بيانات الدخول غير صحيحة، يرجى التأكد وإعادة المحاولة');
    } else {
      setSuccessMsg(res.message || 'تم تسجيل الدخول بنجاح! جاري فتح المنصة...');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regUsername.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('يرجى ملء جميع البيانات المطلوبة');
      return;
    }

    const res = register({
      name: regName.trim(),
      username: regUsername.trim(),
      phone: regPhone.trim(),
      password: regPassword.trim(),
      role: role,
      subject: role === 'teacher' ? regExtra.trim() || 'معلم' : undefined,
      studentName: role === 'parent' ? regExtra.trim() || 'طالب بالمدرسة' : undefined,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'اسم المستخدم محجوز بالفعل، اختر اسماً آخر');
    }
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialName.trim()) return;

    if (socialModalType === 'microsoft') {
      loginWithMicrosoftAccount(socialName.trim(), socialRole, socialPhone.trim());
    } else if (socialModalType === 'google') {
      loginWithGoogleAccount(socialName.trim(), socialRole, socialPhone.trim());
    }
    setSocialModalType(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-6" dir="rtl">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              منصة مدرسة المستقبل الذكية
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 justify-center sm:justify-start">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{schoolAddress}</span>
            </div>
          </div>
        </div>

        {/* Server IP */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-mono text-slate-700 font-bold" dir="ltr">
            10.14.88.25:8080
          </span>
          <button
            onClick={handleCopyIp}
            className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors"
          >
            {copiedIp ? <Check className="w-3 h-3 inline" /> : 'نسخ'}
          </button>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="max-w-xl w-full mx-auto my-6 bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        {/* Portal Tabs: Teacher Login vs Parent Login */}
        <div className="grid grid-cols-2 bg-slate-200/90 p-1.5 gap-1.5 border-b border-slate-300 text-xs font-bold text-center">
          <button
            onClick={() => {
              setActivePortal('teacher_login');
              setErrorMsg(null);
            }}
            className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activePortal === 'teacher_login' || activePortal === 'reg_teacher'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>بوابة المعلمين والإدارة</span>
          </button>

          <button
            onClick={() => {
              setActivePortal('parent_login');
              setErrorMsg(null);
            }}
            className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activePortal === 'parent_login' || activePortal === 'reg_parent'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>بوابة أولياء الأمور</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Logins: Microsoft & Google Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block text-center">
              الدخول والاشتراك بحساب مايكروسوفت أو جوجل:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSocialModalType('microsoft');
                  setSocialRole(activePortal.includes('teacher') ? 'teacher' : 'parent');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M12 12h10v10H1z"/>
                  <path fill="#ffba08" d="M1 12h10v10H1z"/>
                </svg>
                <span>دخول بحساب مايكروسوفت</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSocialModalType('google');
                  setSocialRole(activePortal.includes('teacher') ? 'teacher' : 'parent');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>دخول بحساب جوجل</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-300"></div>
            <span className="shrink-0 mx-3 text-xs text-slate-500 font-semibold">
              أو تسجيل الدخول بالاسم / الهاتف وكلمة المرور
            </span>
            <div className="grow border-t border-slate-300"></div>
          </div>

          {/* VIEW 1: TEACHER / VIP LOGIN */}
          {activePortal === 'teacher_login' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
                بوابة دخول السادة المعلمين وأعضاء الإدارة المدرسية المعتمدين.
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    اسم المستخدم أو رقم الهاتف أو كود الدخول:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="كود الدخول أو رقم الهاتف"
                      className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    كلمة المرور:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  تسجيل الدخول كمعلم / إدارة
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('reg_teacher');
                    setErrorMsg(null);
                  }}
                  className="text-xs text-blue-700 hover:underline font-bold"
                >
                  ليس لديك حساب معلم؟ اضغط هنا لإنشاء حساب جديد
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: PARENT LOGIN */}
          {activePortal === 'parent_login' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                بوابة دخول أولياء الأمور لمتابعة الأبناء والجداول والتواصل المباشر مع المعلمين.
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    اسم المستخدم أو رقم الهاتف أو الاسم:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="الاسم أو رقم الهاتف المسجل"
                      className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    كلمة المرور:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  تسجيل الدخول كولي أمر
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('reg_parent');
                    setErrorMsg(null);
                  }}
                  className="text-xs text-emerald-700 hover:underline font-bold"
                >
                  ليس لديك حساب ولي أمر؟ اضغط هنا لإنشاء حساب جديد
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: REGISTER TEACHER */}
          {activePortal === 'reg_teacher' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium flex items-center justify-between">
                <span>إنشاء حساب معلم جديد</span>
                <button
                  type="button"
                  onClick={() => setActivePortal('teacher_login')}
                  className="text-xs font-bold text-blue-700 underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>

              <form onSubmit={(e) => handleRegisterSubmit(e, 'teacher')} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">اسم المعلم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="اكتب اسمك الثلاثي"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">المادة الدراسية / التخصص:</label>
                  <input
                    type="text"
                    required
                    value={regExtra}
                    onChange={(e) => setRegExtra(e.target.value)}
                    placeholder="مثال: الرياضيات، العلوم، اللغة العربية"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">اسم مستخدم (اليوزر):</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="t_name"
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">كلمة المرور:</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="******"
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">رقم الهاتف المحمول:</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+2010..."
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  تأكيد إنشاء حساب معلم والدخول فوراً
                </button>
              </form>
            </div>
          )}

          {/* VIEW 4: REGISTER PARENT */}
          {activePortal === 'reg_parent' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium flex items-center justify-between">
                <span>إنشاء حساب ولي أمر جديد</span>
                <button
                  type="button"
                  onClick={() => setActivePortal('parent_login')}
                  className="text-xs font-bold text-emerald-700 underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>

              <form onSubmit={(e) => handleRegisterSubmit(e, 'parent')} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">اسم ولي الأمر بالكامل:</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: عدي جمال"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">اسم الطالب التابع له:</label>
                  <input
                    type="text"
                    required
                    value={regExtra}
                    onChange={(e) => setRegExtra(e.target.value)}
                    placeholder="اسم الابن أو الابنة بالمدرسة"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">اسم مستخدم (اليوزر):</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="oday_jamal"
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">كلمة المرور:</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="******"
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">رقم الهاتف المحمول:</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+2010..."
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  تأكيد إنشاء حساب ولي أمر والدخول فوراً
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Modal for Microsoft & Google Account Sign-In / Creation */}
      {socialModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-right space-y-4 border border-slate-300">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                {socialModalType === 'microsoft' ? (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M12 12h10v10H12z"/>
                    <path fill="#ffba08" d="M1 12h10v10H1z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                )}
                <h3 className="font-bold text-sm text-slate-900">
                  {socialModalType === 'microsoft' ? 'تسجيل دخول حساب مايكروسوفت' : 'تسجيل دخول حساب جوجل'}
                </h3>
              </div>
              <button onClick={() => setSocialModalType(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSocialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">اسم صاحب الحساب الكامل:</label>
                <input
                  type="text"
                  required
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  placeholder="اكتب اسمك الحقيقي"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">نوع الحساب:</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSocialRole('teacher')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      socialRole === 'teacher' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    معلم
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialRole('parent')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      socialRole === 'parent' ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    ولي أمر
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  required
                  value={socialPhone}
                  onChange={(e) => setSocialPhone(e.target.value)}
                  placeholder="+2010..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSocialModalType(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  دخول للمنصة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-3 space-y-1">
        <div>{schoolAddress}</div>
        <div className="font-mono text-slate-400" dir="ltr">Primary IP: 10.14.88.25:8080</div>
      </footer>
    </div>
  );
};
