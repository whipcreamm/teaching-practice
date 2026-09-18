import React, { useEffect, useState } from 'react';
import TermSwitcher from './TermSwitcher';
import { getStoredData } from '@/lib/data-store';
import { LessonPlanItem, TermType } from '@/lib/types';
import { formatPdfEmbedUrl } from '@/lib/utils';
import { BookOpen, Download, Eye, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function LessonPlanPage() {
  const [term, setTerm] = useState<TermType>('term1');
  const [items, setItems] = useState<LessonPlanItem[]>(() => getStoredData<LessonPlanItem[]>('lesson_plan'));
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredData<LessonPlanItem[]>('lesson_plan') || []);
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nantech_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredItems = items.filter((item) => item.term === term);

  const togglePreview = (id: string) => {
    setExpandedPreviewId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800">แผนการจัดการเรียนรู้</h1>
          <p className="text-slate-500 text-sm">
            แผนการสอน พร้อมไฟล์เอกสาร PDF สำหรับดาวน์โหลดและเปิดอ่าน
          </p>
        </div>

        {/* Term Switcher */}
        <div>
          <TermSwitcher currentTerm={term} onTermChange={setTerm} />
        </div>
      </div>

      {/* Content Area */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 space-y-3 border border-slate-100">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-base font-medium">ยังไม่มีข้อมูลแผนการสอนใน{term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredItems.map((item) => {
            const embedUrl = formatPdfEmbedUrl(item.pdf_link);
            const isBase64 = item.pdf_link && item.pdf_link.startsWith('data:');
            const isExpanded = expandedPreviewId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 hover:shadow-md transition-all"
              >
                {/* Card Top Bar (Same style as ClassroomResearchPage) */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-nantech-700 text-xs font-bold">
                      {item.term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-nantech-600" />
                      <span>{item.hours} ชั่วโมง/สัปดาห์</span>
                    </span>
                  </div>

                  {item.pdf_link && (
                    <div className="flex items-center space-x-2">
                      <a
                        href={item.pdf_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-nantech-600 text-white font-semibold text-xs hover:bg-nantech-700 transition-colors shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>เปิดดูแผนการสอน (PDF)</span>
                      </a>
                      <a
                        href={item.pdf_link}
                        download={isBase64 ? `${item.unit_name || 'lesson-plan'}.pdf` : undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                        title="ดาวน์โหลดเอกสาร"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => togglePreview(item.id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isExpanded 
                            ? 'bg-slate-200 text-slate-800' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isExpanded ? 'ย่อหน้าต่างพรีวิว' : 'พรีวิวตัวอย่างในหน้าเว็บ'}
                      >
                        <FileText className="w-3.5 h-3.5 text-nantech-600" />
                        <span>{isExpanded ? 'ปิดพรีวิว' : 'พรีวิว'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Unit Name Title (Same heading style as ClassroomResearchPage) */}
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-snug">{item.unit_name}</h2>
                </div>

                {/* Description Box (Same style as abstract in ClassroomResearchPage) */}
                {item.description && (
                  <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100 space-y-1.5">
                    <h3 className="text-xs font-bold text-nantech-600 uppercase tracking-wider">คำอธิบายรายวิชา / สาระการเรียนรู้</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Optional Expandable In-page Iframe Preview */}
                {item.pdf_link && isExpanded && (
                  <div className="w-full pt-2 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
                      <span>ตัวอย่างเอกสาร ({item.unit_name})</span>
                      <a
                        href={item.pdf_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-nantech-600 hover:underline font-semibold"
                      >
                        เปิดหน้าต่างใหม่ ↗
                      </a>
                    </div>
                    <iframe
                      src={embedUrl}
                      title={`PDF - ${item.unit_name}`}
                      className="w-full h-[650px] sm:h-[800px] rounded-2xl border border-slate-200 shadow-inner bg-slate-50"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
