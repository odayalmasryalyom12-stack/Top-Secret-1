import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleItem } from '../types';
import { 
  PlusCircle, 
  Clock, 
  MapPin, 
  BookOpen, 
  User, 
  Trash2, 
  Edit3, 
  Smartphone, 
  Monitor, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { AddScheduleModal } from './AddScheduleModal';

export const ScheduleSection: React.FC = () => {
  const { schedules, currentUser, deleteScheduleItem } = useApp();
  const [selectedDay, setSelectedDay] = useState<ScheduleItem['day']>('الأحد');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');

  const days: ScheduleItem['day'][] = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const canManage = isTeacher || isAdmin;

  // Filter schedules
  const daySchedules = schedules
    .filter((s) => s.day === selectedDay)
    .filter((s) => {
      if (isTeacher && !isAdmin) {
        // Teacher sees their own classes by default, or all
        if (teacherFilter === 'my') return s.teacherId === currentUser.id;
        if (teacherFilter !== 'all') return s.teacherId === teacherFilter;
        return true;
      }
      if (teacherFilter !== 'all') return s.teacherId === teacherFilter;
      return true;
    })
    .sort((a, b) => a.period - b.period);

  // Unique teachers in schedule
  const uniqueTeachers = Array.from(
    new Set(schedules.map((s) => JSON.stringify({ id: s.teacherId, name: s.teacherName })))
  ).map((str) => JSON.parse(str));

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              الجداول اليومية والأسبوعية
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">متوافق مع الهواتف والكمبيوتر</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            جدول الحصص واليوم الدراسي
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة دقيقة لمواعيد الحصص، القاعات الدراسية، والواجبات المدرسية
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* View mode toggle for desktop */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              title="عرض كروت تفاعلية (ممتاز للموبايل)"
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === 'cards' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>كروت</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="عرض جدول منظم (للكمبيوتر)"
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>جدول</span>
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => {
                setEditingItem(null);
                setAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة حصة للجدول</span>
            </button>
          )}
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => {
          const count = schedules.filter((s) => s.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] py-3 px-3 rounded-xl text-center border transition-all ${
                selectedDay === day
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm">{day}</div>
              <div
                className={`text-[11px] font-mono mt-0.5 ${
                  selectedDay === day ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {count} حصص
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Filter: By Teacher */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">تصفية حسب المعلم:</span>
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">جميع المعلمين والمواد</option>
            {isTeacher && <option value="my">حصصي الشخصية فقط</option>}
            {uniqueTeachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          إجمالي الحصص اليوم: {daySchedules.length}
        </span>
      </div>

      {/* Schedule Items: Empty or List */}
      {daySchedules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700 mb-1">
            لا توجد حصص مسجلة ليوم {selectedDay}
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            {canManage
              ? 'يمكنك إضافة حصص جديدة لهذا اليوم بالنقر على زر الإضافة أعلاه.'
              : 'لم يقم المعلمون بإضافة حصص لهذا اليوم حتى الآن.'}
          </p>
          {canManage && (
            <button
              onClick={() => {
                setEditingItem(null);
                setAddModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة أول حصة ليوم {selectedDay}</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View - Highly responsive for phone & mobile */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daySchedules.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Period & Time */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center border border-blue-200">
                      {item.period}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      الحصة {item.period === 1 ? 'الأولى' : item.period === 2 ? 'الثانية' : item.period === 3 ? 'الثالثة' : item.period === 4 ? 'الرابعة' : item.period === 5 ? 'الخامسة' : `رقم ${item.period}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono" dir="ltr">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>

                {/* Subject & Teacher */}
                <div className="py-3 space-y-1.5">
                  <h4 className="text-base font-bold text-slate-900">{item.subject}</h4>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.teacherName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.classroom}
                    </span>
                    <span className="text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded text-[11px] font-medium">
                      {item.grade}
                    </span>
                  </div>

                  {item.notes && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-0.5">ملاحظات الحصة:</span>
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions for teacher or admin */}
              {(canManage && (currentUser?.id === item.teacherId || isAdmin)) && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setAddModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف حصة ${item.subject}؟`)) {
                        deleteScheduleItem(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Table View for Computers & Large Screens */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3.5">الحصة</th>
                <th className="p-3.5">التوقيت</th>
                <th className="p-3.5">المادة الدراسية</th>
                <th className="p-3.5">المعلم</th>
                <th className="p-3.5">الصف / الفصل</th>
                <th className="p-3.5">القاعة</th>
                <th className="p-3.5">الملاحظات</th>
                {canManage && <th className="p-3.5 text-center">إجراءات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daySchedules.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold font-mono">
                    <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 inline-flex items-center justify-center border border-blue-100">
                      {item.period}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 whitespace-nowrap" dir="ltr">
                    {item.startTime} - {item.endTime}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{item.subject}</td>
                  <td className="p-3.5 text-slate-700">{item.teacherName}</td>
                  <td className="p-3.5 text-blue-700">{item.grade}</td>
                  <td className="p-3.5 text-slate-600">{item.classroom}</td>
                  <td className="p-3.5 text-slate-500 max-w-xs truncate">{item.notes || '—'}</td>
                  {canManage && (
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {(currentUser?.id === item.teacherId || isAdmin) ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setAddModalOpen(true);
                            }}
                            className="p-1 hover:text-blue-600 rounded"
                            title="تعديل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`حذف حصة ${item.subject}؟`)) {
                                deleteScheduleItem(item.id);
                              }
                            }}
                            className="p-1 hover:text-rose-600 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Schedule Modal */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
      />
    </div>
  );
};
