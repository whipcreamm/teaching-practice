import React, { useEffect, useState } from 'react';
import TermSwitcher from './TermSwitcher';
import { getStoredData } from '@/lib/data-store';
import { ScheduleItem, ScheduleImagesData, TermType } from '@/lib/types';
import { Calendar, BookOpen, Layers } from 'lucide-react';

export default function SchedulePage() {
  const [term, setTerm] = useState<TermType>('term1');
  const [items, setItems] = useState<ScheduleItem[]>(() => getStoredData<ScheduleItem[]>('schedule') || []);
  const [scheduleImages, setScheduleImages] = useState<ScheduleImagesData>(() => getStoredData<ScheduleImagesData>('schedule_images') || { term1_image: '', term2_image: '' });

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredData<ScheduleItem[]>('schedule') || []);
      setScheduleImages(getStoredData<ScheduleImagesData>('schedule_images') || { term1_image: '', term2_image: '' });
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nantech_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredItems = items.filter((item) => item.term === term);
  const currentImage = term === 'term1' ? scheduleImages?.term1_image : scheduleImages?.term2_image;
  const termLabel = term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-nantech-600 text-xs font-semibold">
            <Calendar className="w-4 h-4" />
            <span>ตารางสอนประจำปีการศึกษา</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">ตารางสอนและรายวิชาที่รับผิดชอบ</h1>
          <p className="text-slate-500 text-sm">
            แสดงภาพตารางสอนและรายละเอียดรหัสวิชา รายวิชาที่รับผิดชอบการสอน ({termLabel})
          </p>
        </div>

        {/* Term Switcher */}
        <div>
          <TermSwitcher currentTerm={term} onTermChange={setTerm} />
        </div>
      </div>

      {/* 1. Schedule Image Section (w-100 / w-full) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-nantech-50 text-nantech-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">ตารางสอนประจำ {termLabel}</h2>
            <p className="text-xs text-slate-400">ภาพตารางสอนปฏิบัติการสอน</p>
          </div>
        </div>

        {currentImage ? (
          <div className="w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
            <img
              src={currentImage}
              alt={`ตารางสอน ${termLabel}`}
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <div className="w-full py-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <Calendar className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">ยังไม่มีภาพตารางสอนสำหรับ {termLabel}</p>
            <p className="text-xs text-slate-400">สามารถอัปโหลดภาพตารางสอนได้ในระบบผู้ดูแลระบบ (Admin)</p>
          </div>
        )}
      </div>

      {/* 2. Subjects Table (ใต้ภาพตารางสอน: ลำดับ, รหัสวิชา, ชื่อวิชา) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">รายวิชาที่รับผิดชอบการสอน ({termLabel})</h2>
              <p className="text-xs text-slate-400">รวมทั้งหมด {filteredItems.length} รายวิชา</p>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Layers className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">ยังไม่มีรายวิชาที่บันทึกไว้ใน {termLabel}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-24 text-center">ลำดับ</th>
                    <th className="px-6 py-4 w-48 text-center sm:text-left">รหัสวิชา</th>
                    <th className="px-6 py-4 text-left">ชื่อวิชา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredItems.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-center sm:text-left">
                        <span className="inline-block px-3 py-1 rounded-xl bg-nantech-50 border border-nantech-200/60 font-mono font-bold text-nantech-700 text-xs">
                          {item.subject_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.subject_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
