import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleItem } from '../types';
import { PlusCircle, Calendar, Clock, MapPin, BookOpen, Users, X, AlertCircle } from 'lucide-react';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: ScheduleItem | null;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, editItem }) => {
  const { addScheduleItem, updateScheduleItem, currentUser, users } = useApp();

  const [subject, setSubject] = useState(editItem ? editItem.subject : '');
  const [day, setDay] = useState<ScheduleItem['day']>(editItem ? editItem.day : 'الأحد');
  const [startTime, setStartTime] = useState(editItem ? editItem.startTime : '08:00 ص');
  const [endTime, setEndTime] = useState(editItem ? editItem.endTime : '08:50 ص');
  const [period, setPeriod] = useState<number>(editItem ? editItem.period : 1);
  const [classroom, setClassroom] = useState(editItem ? editItem.classroom : 'قاعة 101');
  const [grade, setGrade] = useState(editItem ? editItem.grade : 'الصف الثاني الثانوي');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    editItem ? editItem.teacherId : currentUser?.role === 'teacher' ? currentUser.id : ''
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const teachers = users.filter((u) => u.role === 'teacher');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !classroom.trim() || !grade.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const teacherIdToUse = currentUser?.role === 'teacher' ? currentUser.id : selectedTeacherId;

    if (!teacherIdToUse) {
      setError('يرجى تحديد المعلم المسئول عن الحصة');
      return;
    }

    if (editItem) {
      updateScheduleItem(editItem.id, {
        subject: subject.trim(),
        day,
        startTime,
        endTime,
        period: Number(period),
        classroom: classroom.trim(),
        grade: grade.trim(),
        notes: notes.trim() || undefined,
        teacherId: teacherIdToUse,
      });
    } else {
      addScheduleItem({
        teacherId: teacherIdToUse,
        subject: subject.trim(),
        day,
        startTime,
        endTime,
        period: Number(period),
        classroom: classroom.trim(),
        grade: grade.trim(),
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden text-right max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold">
              {editItem ? 'تعديل بيانات الحصة المدرسية' : 'إضافة حصة جديدة إلى الجدول اليومي'}
            </h3>
            <p className="text-xs text-blue-100">تنظيم ومتابعة الحصص عبر الهاتف أو الكمبيوتر</p>
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
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Teacher selector if admin is adding */}
          {currentUser?.role === 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المعلم المسئول عن الحصة:
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- اختر المعلم --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject || 'معلم'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              اسم المادة الدراسية:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: الرياضيات التطبيقية، الفيزياء، النحو"
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <BookOpen className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Day & Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                يوم الحصة:
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as ScheduleItem['day'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="الأحد">الأحد</option>
                <option value="الإثنين">الإثنين</option>
                <option value="الثلاثاء">الثلاثاء</option>
                <option value="الأربعاء">الأربعاء</option>
                <option value="الخميس">الخميس</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الحصة:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={1}>الحصة الأولى</option>
                <option value={2}>الحصة الثانية</option>
                <option value={3}>الحصة الثالثة</option>
                <option value={4}>الحصة الرابعة</option>
                <option value={5}>الحصة الخامسة</option>
                <option value={6}>الحصة السادسة</option>
                <option value={7}>الحصة السابعة</option>
              </select>
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                وقت البدء:
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="08:00 ص"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                وقت الانتهاء:
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="08:50 ص"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          {/* Classroom & Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                القاعة / المختبر:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="قاعة 101"
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الصف / الفصل:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="الصف الثاني الثانوي"
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Users className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات أو واجبات الحصة (اختياري):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: إحضار كشكول التمارين، اختبار قصير 10 دقائق..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              {editItem ? 'حفظ التعديلات' : 'إضافة الحصة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
