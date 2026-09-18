import React, { useEffect, useState } from 'react';
import { getStoredData } from '@/lib/data-store';
import { ClassroomResearchItem } from '@/lib/types';
import { GraduationCap, Download, Eye, Users, CheckCircle2 } from 'lucide-react';

export default function ClassroomResearchPage() {
  const [items, setItems] = useState<ClassroomResearchItem[]>(() => getStoredData<ClassroomResearchItem[]>('classroom_research'));

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredData<ClassroomResearchItem[]>('classroom_research'));
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    return () => window.removeEventListener('nantech_storage_update', handleUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-nantech-900 via-nantech-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          {/* <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-nantech-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>เมนู 1.7</span>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            งานวิจัยในชั้นเรียน (Classroom Action Research)
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            รวบรวมรายงานผลการวิจัยเพื่อแก้ปัญหาและพัฒนาการจัดการเรียนรู้ของนักศึกษา แผนกวิชาเทคโนโลยีสารสนเทศ
          </p>
        </div>
      </div>

      {/* Content List */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 space-y-3 border border-slate-100">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-base font-medium">ยังไม่มีรายการงานวิจัยในชั้นเรียน</p>
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-nantech-700 text-xs font-bold">
                  วิจัยประจำปีการศึกษา {res.year || '2569'}
                </span>
                {res.file_link && (
                  <div className="flex items-center space-x-2">
                    <a
                      href={res.file_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-nantech-600 text-white font-semibold text-xs hover:bg-nantech-700 transition-colors shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>โครงร่างงานวิจัย (PDF)</span>
                    </a>
                    <a
                      href={res.file_link}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 leading-snug">{res.title}</h2>
              </div>

              {/* <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
                  <h3 className="text-xs font-bold text-nantech-600 uppercase tracking-wider">บทคัดย่อ (Abstract)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {res.abstract}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60 space-y-1">
                    <div className="flex items-center space-x-2 text-nantech-700 font-bold text-xs">
                      <Users className="w-4 h-4" />
                      <span>กลุ่มเป้าหมายการวิจัย</span>
                    </div>
                    <p className="text-xs text-slate-700">{res.target_group}</p>
                  </div>

                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60 space-y-1">
                    <div className="flex items-center space-x-2 text-nantech-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>สรุปผลการวิจัย</span>
                    </div>
                    <p className="text-xs text-slate-700">{res.result}</p>
                  </div>
                </div>
              </div> */}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
