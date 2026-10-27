/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NewsSection } from './components/NewsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { MessagesSection } from './components/MessagesSection';
import { SchoolDriveSection } from './components/SchoolDriveSection';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { AuthGateway } from './components/AuthGateway';
import { IpLinkModal } from './components/IpLinkModal';
import { 
  GraduationCap, 
  Globe, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Sparkles
} from 'lucide-react';

function MainAppContent() {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const [isIpModalOpen, setIpModalOpen] = useState(false);

  // If user is not logged in, display the Auth Gateway screen first!
  // No one can see or do anything before creating an account or logging in.
  if (!currentUser) {
    return <AuthGateway />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-['Tajawal',sans-serif]">
      {/* Top Navigation */}
      <Navbar />

      {/* Numerical Server IP Status Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-200">بوابة الخادم المباشرة:</span>
            <button
              onClick={() => setIpModalOpen(true)}
              className="text-amber-400 font-mono font-bold hover:underline hover:text-amber-300 transition-colors"
              dir="ltr"
            >
              http://10.14.88.25:8080
            </button>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">الشبكة المدرسية الداخلية (LAN)</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">
              الحساب الحالي: <strong className="text-white">{currentUser?.name || 'زائر'}</strong>
              {currentUser?.isVipAdmin && ' (VIP)'}
            </span>
            <button
              onClick={() => setIpModalOpen(true)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] border border-slate-700 transition-colors"
            >
              عرض رابط الـ IP
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'news' && <NewsSection />}
        {activeTab === 'schedules' && <ScheduleSection />}
        {activeTab === 'messages' && <MessagesSection />}
        {activeTab === 'files' && <SchoolDriveSection />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <IpLinkModal isOpen={isIpModalOpen} onClose={() => setIpModalOpen(false)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right mb-6" dir="rtl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
                <GraduationCap className="w-5 h-5" />
                <span>مدرسة المستقبل الذكية</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                منصة رقمية متكاملة لربط إدارة المدرسة، السادة المعلمين، وأولياء الأمور والطلاب في بيئة تعليمية تفاعلية حديثة.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-1">العنوان والموقع الجغرافي:</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex items-start gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>جمهورية مصر العربية، دمياط، دمياط الجديدة، المجاورة الثالثة</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-1">روابط السيرفر وبوابة الدخول:</span>
              <ul className="space-y-1 font-mono text-slate-500" dir="ltr">
                <li>• Primary IP: http://10.14.88.25:8080</li>
                <li>• LAN IP: http://172.16.42.100:3000</li>
                <li className="font-sans text-slate-400">• متوافق مع الموبايل والكمبيوتر</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} مدرسة المستقبل — جمهورية مصر العربية، دمياط، دمياط الجديدة، المجاورة الثالثة
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span>تطوير مخصص للأستاذ عدي جمال</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
