import React, { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, ShieldCheck, Wifi, QrCode } from 'lucide-react';

interface IpLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IpLinkModal: React.FC<IpLinkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedAlt, setCopiedAlt] = useState(false);

  // The custom numerical IP links requested by the user
  const primaryIpUrl = 'http://10.14.88.25:8080';
  const localIntranetIpUrl = 'http://172.16.42.100:3000';

  if (!isOpen) return null;

  const handleCopy = (text: string, isAlt = false) => {
    navigator.clipboard.writeText(text);
    if (isAlt) {
      setCopiedAlt(true);
      setTimeout(() => setCopiedAlt(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">رابط السيرفر الرقمي المباشر (IP)</h3>
                <p className="text-xs text-blue-100">بوابة الدخول المباشر بالأرقام للشبكة المدرسية</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">رابط البوابة الرئيسي (سيرفر المدرسة):</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Wifi className="w-3.5 h-3.5" /> متاح ومتصل
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg p-2.5">
              <input 
                type="text" 
                readOnly 
                value={primaryIpUrl} 
                className="w-full font-mono text-sm font-bold text-blue-700 bg-transparent outline-none text-left"
                dir="ltr"
              />
              <button 
                onClick={() => handleCopy(primaryIpUrl, false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              يمكن استخدام هذا الرابط الرقمي للدخول من أجهزة الكمبيوتر والهواتف المتصلة بشبكة المدرسة أو عبر المتصفح مباشرة.
            </p>
          </div>

          {/* Secondary Intranet IP */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">الرابط البديل للشبكة الداخلية (LAN IP):</span>
              <span className="text-slate-400 font-mono text-xs">Port: 3000</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg p-2.5">
              <input 
                type="text" 
                readOnly 
                value={localIntranetIpUrl} 
                className="w-full font-mono text-sm text-slate-800 bg-transparent outline-none text-left"
                dir="ltr"
              />
              <button 
                onClick={() => handleCopy(localIntranetIpUrl, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors shrink-0"
              >
                {copiedAlt ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedAlt ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          {/* Features note */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">معلومات الدخول المباشر:</span>
              <span>يمكنك تسجيل الدخول لحساب المدير VIP عبر كتابة اليوزر نيم </span>
              <strong className="font-mono text-blue-700 px-1 bg-white rounded border border-blue-200">115007</strong>
              <span> وكلمة المرور </span>
              <strong className="font-mono text-blue-700 px-1 bg-white rounded border border-blue-200">160508</strong>
              <span> لإدارة كافة الصلاحيات.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
