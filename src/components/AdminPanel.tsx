import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  GraduationCap, 
  CalendarDays, 
  Newspaper, 
  Search, 
  Edit3, 
  Trash2, 
  UserPlus, 
  Globe, 
  Copy, 
  Check, 
  Sparkles,
  Lock,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { EditUserModal } from './EditUserModal';
import { CreateNewsModal } from './CreateNewsModal';

export const AdminPanel: React.FC = () => {
  const { 
    currentUser, 
    users, 
    schedules, 
    news, 
    deleteUser, 
    addUser, 
    switchUser,
    login 
  } = useApp();

  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isCreateNewsModalOpen, setCreateNewsModalOpen] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);

  // New user state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newRole, setNewRole] = useState<UserRole>('teacher');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  const primaryIp = 'http://10.14.88.25:8080';

  const handleCopyIp = () => {
    navigator.clipboard.writeText(primaryIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const isAdmin = currentUser?.role === 'admin';

  // If current user is not admin, show friendly message without exposing passwords
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs" dir="rtl">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">لوحة تحكم إدارة المدرسة (VIP)</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            هذه المنطقة مخصصة حصرياً لأعضاء الإدارة المدرسية المعتمدين (المدير محمد عمر، الأخصائية الاجتماعية همت صادق، ومدير الكنترول صلاح اللبان).
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
          يرجى تسجيل الدخول بحساب المعلمين / الإدارة الخاص بك من بوابة الدخول للحصول على صلاحيات الإدارة الكاملة.
        </div>
      </div>
    );
  }

  // Filtered users for table
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (!searchUser.trim()) return true;
    const q = searchUser.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      (u.subject && u.subject.toLowerCase().includes(q))
    );
  });

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !newPhone.trim()) return;

    addUser({
      name: newName.trim(),
      username: newUsername.trim(),
      phone: newPhone.trim(),
      password: newPassword.trim(),
      role: newRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newName)}`,
      status: 'active',
      subject: newRole === 'teacher' ? newSubject.trim() : undefined,
      grade: newRole === 'student' ? newGrade.trim() : undefined,
      studentName: newRole === 'parent' ? newStudentName.trim() : undefined,
    });

    setNewName('');
    setNewUsername('');
    setNewPhone('');
    setNewSubject('');
    setNewGrade('');
    setNewStudentName('');
    setAddUserModalOpen(false);
  };

  const getRoleText = (u: User) => {
    if (u.role === 'admin') {
      return u.jobTitle || 'مدير المدرسة';
    }
    if (u.role === 'teacher') return `معلم (${u.subject || 'عام'})`;
    if (u.role === 'parent') return `ولي أمر (${u.studentName || 'طالب'})`;
    if (u.role === 'student') return `طالب (${u.grade || 'ثانوي'})`;
    return 'مستخدم';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      {/* Admin Welcome & Intranet Server IP Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md bg-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                  VIP SUPER ADMIN
                </span>
                <span className="text-xs text-blue-200">
                  {currentUser.jobTitle || 'مدير المدرسة'}
                </span>
              </div>
              <h2 className="text-xl font-bold mt-1">
                مرحباً بك، سيادة {currentUser.name}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                لديك كامل الصلاحيات لتعديل بيانات المعلمين والطلاب وأولياء الأمور ونشر الأخبار وإدارة الجداول
              </p>
            </div>
          </div>

          {/* Intranet IP Link Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 w-full md:w-auto text-right space-y-1.5">
            <div className="flex items-center justify-between text-xs text-blue-100 gap-4">
              <span className="flex items-center gap-1.5 font-bold">
                <Globe className="w-3.5 h-3.5 text-blue-300" />
                رابط السيرفر الرقمي للمدرسة:
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                Active IP
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1.5 border border-white/10">
              <span className="font-mono text-sm font-bold text-amber-300 px-2" dir="ltr">
                {primaryIp}
              </span>
              <button
                onClick={handleCopyIp}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedIp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIp ? 'تم' : 'نسخ'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>كل المستخدمين</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {users.length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>المعلمون</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
            {users.filter((u) => u.role === 'teacher').length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>أولياء الأمور</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-700 mt-2 tabular-nums">
            {users.filter((u) => u.role === 'parent').length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>الطلاب</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-700 mt-2 tabular-nums">
            {users.filter((u) => u.role === 'student').length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>الحصص المجدولة</span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-2 tabular-nums">
            {schedules.length}
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>إدارة الحسابات والمستخدمين (المعلمون، أولياء الأمور، الطلاب)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              تعديل أسماء المستخدمين، كلمات المرور، الصلاحيات وحالة الحساب
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setAddUserModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="ابحث بالاسم أو اليوزر نيم أو الهاتف..."
              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'teacher', label: 'المعلمون' },
              { id: 'parent', label: 'أولياء الأمور' },
              { id: 'student', label: 'الطلاب' },
              { id: 'admin', label: 'الإدارة' },
            ].map((rf) => (
              <button
                key={rf.id}
                onClick={() => setRoleFilter(rf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  roleFilter === rf.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3.5">المستخدم</th>
                <th className="p-3.5">اليوزر نيم (كود الدخول)</th>
                <th className="p-3.5">رقم الهاتف</th>
                <th className="p-3.5">الدور / التخصص</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات المدير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <span>{u.name}</span>
                          {u.isVipAdmin && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          كلمة المرور: {u.password || '******'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-blue-700" dir="ltr">
                    @{u.username}
                  </td>

                  <td className="p-3.5 font-mono text-slate-600" dir="ltr">
                    {u.phone}
                  </td>

                  <td className="p-3.5 text-slate-700 font-medium">
                    {getRoleText(u)}
                  </td>

                  <td className="p-3.5">
                    {u.status === 'active' ? (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> نشط
                      </span>
                    ) : (
                      <span className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> موقوف
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingUser(u)}
                        title="تعديل بيانات المستخدم بالكامل"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-medium text-[11px]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      {/* Switch User Button for Admin inspection */}
                      <button
                        onClick={() => switchUser(u.id)}
                        title="معاينة التطبيق كما يراه هذا المستخدم"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 font-medium text-[11px]"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>معاينة</span>
                      </button>

                      {/* Delete Button (disabled for VIP admins) */}
                      {!u.isVipAdmin && (
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف حساب ${u.name} نهائياً؟`)) {
                              deleteUser(u.id);
                            }
                          }}
                          title="حذف المستخدم نهائياً"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden text-right max-h-[90vh] flex flex-col"
            dir="rtl"
          >
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold">إضافة مستخدم جديد للنظام المالي والتعليمي</h3>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="p-1 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الدور:
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="teacher">معلم</option>
                  <option value="parent">ولي أمر</option>
                  <option value="student">طالب</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المستخدم:</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="t_name or p_name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور:</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+2010..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                  dir="ltr"
                />
              </div>

              {newRole === 'teacher' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المادة:</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="مثال: الكيمياء، التاريخ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              )}

              {newRole === 'parent' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">اسم الطالب:</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="اسم ابنه المسجل بالمدرسة"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              )}

              {newRole === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الصف:</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="الصف الأول الثانوي"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg"
                >
                  إضافة المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Modal trigger if admin wants to post directly */}
      <CreateNewsModal
        isOpen={isCreateNewsModalOpen}
        onClose={() => setCreateNewsModalOpen(false)}
      />
    </div>
  );
};
