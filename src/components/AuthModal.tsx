import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  LogIn, 
  UserPlus, 
  Phone, 
  Lock, 
  User, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    login, 
    loginWithGoogle, 
    loginWithMicrosoft, 
    register 
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSubject, setRegSubject] = useState('');
  const [regGrade, setRegGrade] = useState('');
  const [regStudentName, setRegStudentName] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!loginIdentifier.trim()) {
      setLoginError('يرجى إدخال رقم الهاتف أو اسم المستخدم / كود الدخول');
      return;
    }

    const res = login(loginIdentifier, loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'فشل تسجيل الدخول، تأكد من البيانات المدخلة');
    } else {
      setLoginSuccess(res.message || 'تم تسجيل الدخول بنجاح');
    }
  };

  const handleQuickVipLogin = (userCode: string, passCode: string) => {
    setLoginIdentifier(userCode);
    setLoginPassword(passCode);
    setLoginError(null);
    const res = login(userCode, passCode);
    if (res.success) {
      setLoginSuccess(res.message || 'تم تسجيل الدخول بنجاح');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regUsername.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const res = register({
      name: regName,
      username: regUsername,
      phone: regPhone,
      password: regPassword,
      role: selectedRole,
      subject: selectedRole === 'teacher' ? regSubject : undefined,
      grade: selectedRole === 'student' ? regGrade : undefined,
      studentName: selectedRole === 'parent' ? regStudentName : undefined,
    });

    if (!res.success) {
      setRegError(res.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden text-right max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold">بوابة تسجيل الدخول والمستخدمين</h3>
            <p className="text-xs text-blue-100">
              الدخول بالهاتف، مايكروسوفت، جوجل أو كود المدير VIP
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setAuthMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('register');
              setRegError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>تسجيل حساب جديد</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Social Logins: Microsoft & Google */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              تسجيل الدخول السريع عبر الحسابات الرسمية:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Microsoft Login */}
              <button
                type="button"
                onClick={loginWithMicrosoft}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span>دخول بحساب مايكروسوفت</span>
              </button>

              {/* Google Login */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>دخول بحساب جوجل التعليمي</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-3 text-xs text-slate-400">أو تسجيل الدخول اليدوي</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* MODE: LOGIN */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
                بوابة الدخول الموحدة للمعلمين وأولياء الأمور وإدارة المدرسة.
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الهاتف أو كود الدخول / اسم المستخدم:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="مثال: 115007 أو رقم الهاتف أو oday_jamal"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كلمة المرور:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="مثال: 160508 أو كلمة سر حسابك"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
              >
                تسجيل الدخول للمنصة
              </button>
            </form>
          ) : (
            /* MODE: REGISTER */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Role Picker for Registration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  نوع الحساب المراد تسجيله:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('parent')}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                      selectedRole === 'parent'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span>ولي أمر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                      selectedRole === 'teacher'
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span>معلم</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                      selectedRole === 'student'
                        ? 'border-purple-500 bg-purple-50 text-purple-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span>طالب</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الاسم الكامل:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={
                      selectedRole === 'parent' 
                        ? 'مثال: عدي جمال' 
                        : selectedRole === 'teacher' 
                        ? 'مثال: أ. أحمد الشناوي' 
                        : 'مثال: سيف عدي'
                    }
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Username for lookup and direct message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسم المستخدم (Username) للبحث والمراسلة:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="مثال: oday_jamal أو t_teacher"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                    dir="ltr"
                  />
                  <span className="text-slate-400 text-sm absolute right-3 top-2.5 font-mono">@</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  سيستخدم هذا المعرّف للبحث عنك في قسم الرسائل الخاصة.
                </span>
              </div>

              {/* Specific fields depending on role */}
              {selectedRole === 'parent' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    اسم الطالب التابع لولي الأمر:
                  </label>
                  <input
                    type="text"
                    value={regStudentName}
                    onChange={(e) => setRegStudentName(e.target.value)}
                    placeholder="مثال: سيف عدي جمال"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              )}

              {selectedRole === 'teacher' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    المادة / التخصص الدراسي:
                  </label>
                  <input
                    type="text"
                    value={regSubject}
                    onChange={(e) => setRegSubject(e.target.value)}
                    placeholder="مثال: الرياضيات، اللغة العربية، العلوم"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              )}

              {selectedRole === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الصف الدراسي:
                  </label>
                  <input
                    type="text"
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    placeholder="مثال: الصف الثاني الثانوي (علمي)"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الهاتف:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+2010..."
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كلمة المرور:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="اختر كلمة مرور قوية"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
              >
                تأكيد إنشاء الحساب
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
