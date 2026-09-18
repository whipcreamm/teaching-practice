import React, { useEffect, useState } from 'react';
import { getStoredData } from '@/lib/data-store';
import { EvaluationItem, EvaluatorType } from '@/lib/types';
import { formatThaiDate } from '@/lib/utils';
import { Award, UserCheck, Shield, Users, FileText, ExternalLink } from 'lucide-react';

export default function EvaluationPage() {
  const [activeType, setActiveType] = useState<EvaluatorType | 'all'>('all');
  const [items, setItems] = useState<EvaluationItem[]>(() => getStoredData<EvaluationItem[]>('evaluation'));

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredData<EvaluationItem[]>('evaluation'));
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nantech_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredItems = activeType === 'all' 
    ? items 
    : items.filter((item) => item.evaluator_type === activeType);

  const getEvaluatorBadge = (type: EvaluatorType) => {
    switch (type) {
      case 'mentor':
        return { label: 'ครูพี่เลี้ยง', icon: UserCheck, color: 'bg-emerald-100 text-nantech-700' };
      case 'executive':
        return { label: 'ผู้บริหารสถานศึกษา', icon: Shield, color: 'bg-indigo-100 text-indigo-700' };
      case 'committee':
        return { label: 'กรรมการสถานศึกษา', icon: Users, color: 'bg-amber-100 text-amber-800' };
      default:
        return { label: 'ผู้ประเมิน', icon: Award, color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-nantech-600 text-xs font-semibold">
            <Award className="w-4 h-4" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">ผลการประเมินการฝึกประสบการณ์สอน</h1>
          <p className="text-slate-500 text-sm">
            ผลการประเมิน ข้อเสนอแนะ และผลการพิจารณาจากครูพี่เลี้ยง ผู้บริหาร และคณะกรรมการสถานศึกษา
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-x-auto">
          <button
            onClick={() => setActiveType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeType === 'all' ? 'bg-nantech-600 text-white shadow-md' : 'text-slate-600 hover:text-nantech-600'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setActiveType('mentor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeType === 'mentor' ? 'bg-nantech-600 text-white shadow-md' : 'text-slate-600 hover:text-nantech-600'
            }`}
          >
            ครูพี่เลี้ยง
          </button>
          <button
            onClick={() => setActiveType('executive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeType === 'executive' ? 'bg-nantech-600 text-white shadow-md' : 'text-slate-600 hover:text-nantech-600'
            }`}
          >
            ผู้บริหาร
          </button>
          <button
            onClick={() => setActiveType('committee')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeType === 'committee' ? 'bg-nantech-600 text-white shadow-md' : 'text-slate-600 hover:text-nantech-600'
            }`}
          >
            กรรมการสถานศึกษา
          </button>
        </div>
      </div>

      {/* Content Area */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 space-y-3 border border-slate-100">
          <Award className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-base font-medium">ยังไม่มีข้อมูลแบบประเมินสำหรับกลุ่มนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const badge = getEvaluatorBadge(item.evaluator_type);
            const BadgeIcon = badge.icon;
            const percentage = Math.round((item.score / (item.max_score || 100)) * 100);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold ${badge.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">{formatThaiDate(item.date)}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 leading-snug">{item.title}</h3>

                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">คะแนนการประเมิน</span>
                      <span className="text-2xl font-extrabold text-nantech-700">
                        {item.score} <span className="text-xs font-medium text-slate-400">/ {item.max_score || 100}</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-nantech-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                      {percentage}%
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700">ข้อเสนอแนะ / ความเห็น:</span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      "{item.comment}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700">
                    <span>ผู้ประเมิน: </span>
                    <span className="text-nantech-600 font-bold">{item.evaluator_name}</span>
                  </div>

                  {/* PDF Attachment Link */}
                  {item.pdf_link && (
                    <a
                      href={item.pdf_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-nantech-600 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all group"
                    >
                      <FileText className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
                      <span>ดูเอกสารแบบประเมิน (PDF)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
