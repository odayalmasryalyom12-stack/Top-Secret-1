import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Monitor, Smartphone, CheckCircle, X, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">تثبيت التطبيق على الكمبيوتر والموبايل</h3>
              <p className="text-xs text-blue-100">يعمل كبرنامج مستقل على سطح المكتب دون الحاجة لمتصفح</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status info */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-1">بدون دفع أي أموال ومجاناً 100%:</span>
            يمكنك تشغيل هذا التطبيق كبرنامج أصلي على جهاز الكمبيوتر الخاص بك (مثل ملفات الـ .exe) وستظهر لك أيقونة على سطح المكتب، بدون الحاجة لدفع 300 دولار أو أي اشتراكات.
          </div>

          {/* Quick Install Button if supported */}
          {isInstallable && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <div className="text-xs font-bold text-emerald-900">
                متصفحك يدعم التثبيت المباشر بنقرة واحدة!
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق على الكمبيوتر الآن (1-Click)</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>التطبيق مثبت بالفعل ويعمل كبرنامج سطح مكتب مستقل!</span>
            </div>
          )}

          {/* Manual steps for Windows PC / Edge / Chrome */}
          <div className="space-y-2 border-t pt-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span>طريقة التثبيت على الكمبيوتر (ويندوز / ماك):</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              <div>1. من شريط عنوان المتصفح بالأعلى (Chrome أو Edge)، ستجد أيقونة صغيرة على شكل <strong>(شاشة مع سهم 💻 أو علامة ⊕)</strong>.</div>
              <div>2. اضغط عليها واختر <strong>"تثبيت / Install"</strong>.</div>
              <div>3. سيفتح التطبيق في نافذة مستقلة تماماً وستجد له اختصاراً على سطح المكتب (Desktop Icon) ويعمل مثل أي برنامج .exe دون شريط متصفح!</div>
            </div>
          </div>

          {/* Mobile steps */}
          <div className="space-y-2 border-t pt-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>طريقة التثبيت على الهاتف (أندرويد / آيفون):</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              <div>• <strong>أندرويد:</strong> اضغط على القائمة (الثلاث نقاط) واختار "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".</div>
              <div>• <strong>آيفون (سفاري):</strong> اضغط زر المشاركة (Share) ثم اختر "إضافة إلى الصفحة الرئيسية (Add to Home Screen)".</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
