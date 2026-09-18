import React, { useEffect, useState } from 'react';
import TermSwitcher from './TermSwitcher';
import { getStoredData } from '@/lib/data-store';
import { ActivityItem, TermType } from '@/lib/types';
import { formatThaiDate } from '@/lib/utils';
import { Image as ImageIcon, Calendar, MapPin } from 'lucide-react';

export default function ActivitiesPage() {
  const [term, setTerm] = useState<TermType>('term1');
  const [items, setItems] = useState<ActivityItem[]>(() => getStoredData<ActivityItem[]>('activities'));

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredData<ActivityItem[]>('activities'));
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    return () => window.removeEventListener('nantech_storage_update', handleUpdate);
  }, []);

  const filteredItems = items.filter((item) => item.term === term);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-2">
          {/* <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-nantech-600 text-xs font-semibold">
            <ImageIcon className="w-4 h-4" />
            <span>เมนู 1.6</span>
          </div> */}
          <h1 className="text-3xl font-extrabold text-slate-800">ภาพกิจกรรมและการปฏิบัติงาน</h1>
          <p className="text-slate-500 text-sm">
            ประมวลภาพกิจกรรมการร่วมงานวิทยาลัย กิจกรรมแผนก และโครงการพิเศษ
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
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-base font-medium">ยังไม่มีข้อมูลกิจกรรมใน{term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Photo Gallery Grid */}
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  {Array.isArray(item.images) && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 font-semibold text-nantech-600">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatThaiDate(item.date)}</span>
                    </span>
                    {item.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Multiple Thumbnails if available */}
              {Array.isArray(item.images) && item.images.length > 1 && (
                <div className="px-6 pb-6 pt-0 flex space-x-2 overflow-x-auto">
                  {item.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`ภาพกิจกรรมที่ ${idx + 1}`}
                      className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
