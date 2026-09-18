import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getStoredData } from '@/lib/data-store';
import { TeachingLogItem, WorkPhotoItem, WorkArtifactItem } from '@/lib/types';
import { formatThaiDate } from '@/lib/utils';
import { FileText, Camera, FolderGit2, ChevronLeft, ChevronRight, X, Calendar, Layers, CheckCircle2, Images } from 'lucide-react';

/**
 * Safely parse date strings (Thai, Slash DD/MM/YYYY, ISO) into timestamp for sorting
 */
function parseDateToTime(d?: string): number {
  if (!d) return 0;
  const clean = d.trim();
  // Slash format DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10);
    const month = parseInt(slashMatch[2], 10);
    let year = parseInt(slashMatch[3], 10);
    if (year < 100) year += 2500;
    if (year > 2400) year -= 543;
    return new Date(year, month - 1, day).getTime();
  }
  const t = Date.parse(clean);
  return isNaN(t) ? 0 : t;
}

export default function TeachingLogPage() {
  const [logs, setLogs] = useState<TeachingLogItem[]>(() => getStoredData<TeachingLogItem[]>('teaching_log') || []);
  const [photos, setPhotos] = useState<WorkPhotoItem[]>(() => getStoredData<WorkPhotoItem[]>('work_photos') || []);
  const [artifacts, setArtifacts] = useState<WorkArtifactItem[]>(() => getStoredData<WorkArtifactItem[]>('work_artifacts') || []);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // Work photos gallery controls
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Work artifacts gallery controls
  const [isArtifactsAlbumOpen, setIsArtifactsAlbumOpen] = useState(false);
  const [artifactsLightboxIndex, setArtifactsLightboxIndex] = useState<number | null>(null);
  const [isArtifactsHovering, setIsArtifactsHovering] = useState(false);
  const artifactsCarouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect for work photos carousel (stops when hovering or in modal)
  useEffect(() => {
    if (isHovering || isAlbumOpen || lightboxIndex !== null || photos.length <= 1) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // If reached end, smoothly reset to beginning
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering, isAlbumOpen, lightboxIndex, photos.length]);

  // Auto-scroll effect for work artifacts carousel
  useEffect(() => {
    if (isArtifactsHovering || isArtifactsAlbumOpen || artifactsLightboxIndex !== null || artifacts.length <= 1) return;

    const interval = setInterval(() => {
      if (artifactsCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = artifactsCarouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          artifactsCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          artifactsCarouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isArtifactsHovering, isArtifactsAlbumOpen, artifactsLightboxIndex, artifacts.length]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollArtifactsCarousel = (direction: 'left' | 'right') => {
    if (artifactsCarouselRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      artifactsCarouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const openLightbox = (_src: string, index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightboxImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const prevLightboxImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  const openArtifactsLightbox = (_src: string, index: number) => {
    setArtifactsLightboxIndex(index);
  };

  const closeArtifactsLightbox = () => {
    setArtifactsLightboxIndex(null);
  };

  const nextArtifactsLightboxImage = () => {
    if (artifactsLightboxIndex !== null) {
      setArtifactsLightboxIndex((artifactsLightboxIndex + 1) % artifacts.length);
    }
  };

  const prevArtifactsLightboxImage = () => {
    if (artifactsLightboxIndex !== null) {
      setArtifactsLightboxIndex((artifactsLightboxIndex - 1 + artifacts.length) % artifacts.length);
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      setLogs(getStoredData<TeachingLogItem[]>('teaching_log') || []);
      setPhotos(getStoredData<WorkPhotoItem[]>('work_photos') || []);
      setArtifacts(getStoredData<WorkArtifactItem[]>('work_artifacts') || []);
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nantech_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Map of item counts per week
  const weekCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    logs.forEach((item) => {
      const w = Number(item.week || 1);
      counts[w] = (counts[w] || 0) + 1;
    });
    return counts;
  }, [logs]);

  // Weeks that have at least 1 record
  const populatedWeeks = useMemo(() => {
    const set = new Set<number>();
    logs.forEach((item) => {
      set.add(Number(item.week || 1));
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [logs]);

  // Filter logs for active week (safe sorting)
  const weekLogs = useMemo(() => {
    return logs
      .filter((item) => Number(item.week || 1) === activeWeek)
      .sort((a, b) => {
        const timeA = parseDateToTime(a.date);
        const timeB = parseDateToTime(b.date);
        if (timeA !== 0 && timeB !== 0) return timeA - timeB;
        return (a.date || '').localeCompare(b.date || '');
      });
  }, [logs, activeWeek]);

  // Group all logs by week for "All Weeks" view
  const allWeeksGrouped = useMemo(() => {
    const groups: { week: number; items: TeachingLogItem[]; dateRange: string }[] = [];
    // Display all 22 weeks or populated weeks
    const weeksToDisplay = populatedWeeks.length > 0 ? populatedWeeks : [1];
    weeksToDisplay.forEach((w) => {
      const items = logs
        .filter((item) => Number(item.week || 1) === w)
        .sort((a, b) => {
          const timeA = parseDateToTime(a.date);
          const timeB = parseDateToTime(b.date);
          if (timeA !== 0 && timeB !== 0) return timeA - timeB;
          return (a.date || '').localeCompare(b.date || '');
        });
      let range = '';
      if (items.length === 1 && items[0].date) {
        range = `วันที่ ${formatThaiDate(items[0].date)}`;
      } else if (items.length > 1) {
        const first = formatThaiDate(items[0].date);
        const last = formatThaiDate(items[items.length - 1].date);
        range = first && last ? `วันที่ ${first} - ${last}` : '';
      }
      groups.push({ week: w, items, dateRange: range });
    });
    return groups;
  }, [logs, populatedWeeks]);

  // Compute date range for active week
  const dateRangeText = useMemo(() => {
    if (weekLogs.length === 0) return '';
    if (weekLogs.length === 1 && weekLogs[0].date) {
      return `วันที่ ${formatThaiDate(weekLogs[0].date)}`;
    }
    const firstDate = formatThaiDate(weekLogs[0].date);
    const lastDate = formatThaiDate(weekLogs[weekLogs.length - 1].date);
    return firstDate && lastDate ? `วันที่ ${firstDate} - ${lastDate}` : '';
  }, [weekLogs]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-nantech-800 to-nantech-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-emerald-100">
            <FileText className="w-4 h-4" />
            <span>บันทึกผลการปฏิบัติงาน 22 สัปดาห์</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">บันทึกการปฏิบัติงาน & การฝึกสอน</h1>
          <p className="text-emerald-100 text-sm max-w-2xl">
            บันทึกการจัดกิจกรรมการเรียนรู้ การปฏิบัติงานประจำวัน และประมวลภาพการปฏิบัติงานในสถานศึกษา
          </p>
        </div>
      </div>

      {/* Main Weekly Table Section */}
      <section className="space-y-6">

        {/* Display: Single Week Mode */}
        {viewMode === 'single' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Table Main Title Bar */}
            <div className="text-center py-4 border-b border-slate-200 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide">
                บันทึกการฝึกสอน
              </h2>
            </div>

            {/* Subheader: Week & Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 text-sm font-bold text-slate-800">
              <div className="px-6 py-3.5 border-b sm:border-b-0 sm:border-r border-slate-200 text-center sm:text-left flex items-center justify-center sm:justify-start">
                <span className="inline-flex items-center space-x-1.5">
                  <span>สัปดาห์ที่ {activeWeek}</span>
                  {weekLogs.length > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {weekLogs.length} รายการ
                    </span>
                  )}
                </span>
              </div>
              <div className="sm:col-span-2 px-6 py-3.5 text-center sm:text-right text-slate-600 font-medium flex items-center justify-center sm:justify-end">
                <span>{dateRangeText || `สัปดาห์ที่ ${activeWeek}`}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center overflow-x-auto no-scrollbar space-x-1.5 py-1">
                {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => {
                  const isActive = activeWeek === w && viewMode === 'single';
                  const count = weekCounts[w] || 0;
                  return (
                    <button
                      key={w}
                      onClick={() => {
                        setActiveWeek(w);
                        setViewMode('single');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all flex items-center space-x-1 border ${
                        isActive
                          ? 'bg-nantech-600 text-white border-nantech-600 shadow-sm shadow-nantech-600/30'
                          : count > 0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>สัปดาห์ {w}</span>
                      {count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#9ec5e8]/60 text-slate-800 font-bold border-b border-slate-300">
                    <th className="px-6 py-3.5 w-36 sm:w-44 text-center border-r border-slate-300">วันที่</th>
                    <th className="px-6 py-3.5 text-center border-r border-slate-300">การทำงาน</th>
                    <th className="px-6 py-3.5 w-44 sm:w-56 text-center">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {weekLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400">
                        <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-medium text-sm">ไม่มีข้อมูลการปฏิบัติงานในสัปดาห์ที่ {activeWeek}</p>
                        <p className="text-xs text-slate-400 mt-1">สามารถเพิ่มบันทึกสำหรับสัปดาห์นี้ได้ในระบบจัดการผู้ดูแล (Admin)</p>
                      </td>
                    </tr>
                  ) : (
                    weekLogs.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 text-center font-medium text-slate-700 border-r border-slate-200 whitespace-nowrap">
                          {formatThaiDate(item.date)}
                        </td>
                        <td className="px-6 py-4 text-slate-800 leading-relaxed border-r border-slate-200 whitespace-pre-line">
                          {item.work || item.topic}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-500 font-normal whitespace-pre-line">
                          {item.note || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Display: All Weeks Mode */}
        {viewMode === 'all' && (
          <div className="space-y-6">
            {allWeeksGrouped.map((group) => (
              <div key={group.week} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Week Header */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-nantech-600 text-white shadow-sm">
                      สัปดาห์ที่ {group.week}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {group.dateRange || `สัปดาห์ที่ ${group.week}`}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {group.items.length} รายการ
                  </span>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#9ec5e8]/50 text-slate-800 font-bold border-b border-slate-300">
                        <th className="px-6 py-3 w-36 sm:w-44 text-center border-r border-slate-300">วันที่</th>
                        <th className="px-6 py-3 text-center border-r border-slate-300">การทำงาน</th>
                        <th className="px-6 py-3 w-44 sm:w-56 text-center">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {group.items.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 text-center font-medium text-slate-700 border-r border-slate-200 whitespace-nowrap">
                            {formatThaiDate(item.date)}
                          </td>
                          <td className="px-6 py-4 text-slate-800 leading-relaxed border-r border-slate-200 whitespace-pre-line">
                            {item.work || item.topic}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-500 font-normal whitespace-pre-line">
                            {item.note || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* Work Photos Gallery Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">รวมภาพการปฏิบัติงาน</h2>
              <p className="text-xs text-slate-500">ประมวลภาพถ่ายการปฏิบัติการสอนและกิจกรรม ({photos.length} ภาพ)</p>
            </div>
          </div>

          {/* Action buttons & album trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
              title="เลื่อนไปทางซ้าย"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
              title="เลื่อนไปทางขวา"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAlbumOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Images className="w-4 h-4 text-cyan-400" />
              <span>ดูอัลบั้มภาพทั้งหมด</span>
            </button>
          </div>
        </div>

        {/* Photos Continuous Auto-Scroll Carousel */}
        {photos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 space-y-3 border border-slate-100 shadow-sm">
            <Camera className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-medium">ยังไม่มีภาพการปฏิบัติงาน</p>
          </div>
        ) : (
          <div className="relative group/carousel">
            <div
              ref={carouselRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="flex space-x-4 overflow-x-auto no-scrollbar py-2 scroll-smooth cursor-grab active:cursor-grabbing"
            >
              {photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => openLightbox(photo.image, idx)}
                  className="flex-shrink-0 w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-xl hover:border-cyan-400 transition-all duration-300 cursor-pointer group relative"
                >
                  <img
                    src={photo.image}
                    alt="ภาพการปฏิบัติงาน"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-sm shadow-md">
                      คลิกเพื่อดูภาพใหญ่
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Work Artifacts Section (ผลงานระหว่างปฏิบัติงาน) */}
      <section className="space-y-6 pt-6 border-t border-slate-200 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">ผลงานระหว่างปฏิบัติงาน</h2>
              <p className="text-xs text-slate-500">ประมวลภาพชิ้นงาน สื่อการสอน และผลงานนักเรียน/นักศึกษา ({artifacts.length} ภาพ)</p>
            </div>
          </div>

          {/* Action buttons & album trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollArtifactsCarousel('left')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
              title="เลื่อนไปทางซ้าย"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollArtifactsCarousel('right')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
              title="เลื่อนไปทางขวา"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsArtifactsAlbumOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Images className="w-4 h-4 text-indigo-400" />
              <span>ดูอัลบั้มภาพทั้งหมด</span>
            </button>
          </div>
        </div>

        {/* Artifacts Continuous Auto-Scroll Carousel */}
        {artifacts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 space-y-3 border border-slate-100 shadow-sm">
            <FolderGit2 className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-medium">ยังไม่มีภาพผลงานระหว่างปฏิบัติงาน</p>
          </div>
        ) : (
          <div className="relative group/carousel">
            <div
              ref={artifactsCarouselRef}
              onMouseEnter={() => setIsArtifactsHovering(true)}
              onMouseLeave={() => setIsArtifactsHovering(false)}
              className="flex space-x-4 overflow-x-auto no-scrollbar py-2 scroll-smooth cursor-grab active:cursor-grabbing"
            >
              {artifacts.map((artifact, idx) => (
                <div
                  key={artifact.id || idx}
                  onClick={() => openArtifactsLightbox(artifact.image, idx)}
                  className="flex-shrink-0 w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-400 transition-all duration-300 cursor-pointer group relative"
                >
                  <img
                    src={artifact.image}
                    alt="ผลงานระหว่างปฏิบัติงาน"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-sm shadow-md">
                      คลิกเพื่อดูภาพใหญ่
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Floating Action Button for Work Photos Album */}
      {photos.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsAlbumOpen(true)}
            className="flex items-center space-x-2.5 px-4 py-3 bg-slate-900/90 hover:bg-cyan-700 text-white rounded-2xl shadow-xl hover:shadow-2xl backdrop-blur-md border border-white/20 transition-all transform hover:-translate-y-0.5 active:scale-95 group"
            title="คลิกดูอัลบั้มภาพการปฏิบัติงานทั้งหมด"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-white group-hover:text-cyan-700 transition-colors">
              <Images className="w-4 h-4" />
            </div>
            <div className="text-left pr-1">
              <span className="block text-xs font-bold leading-tight">ดูอัลบั้มภาพปฏิบัติงาน</span>
              <span className="block text-[10px] text-cyan-300 group-hover:text-emerald-100">{photos.length} ภาพถ่าย</span>
            </div>
          </button>
        </div>
      )}

      {/* Album Modal Gallery: Work Photos */}
      {isAlbumOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsAlbumOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <Images className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  อัลบั้มภาพการปฏิบัติงาน ({photos.length} ภาพ)
                </h3>
              </div>
              <button
                onClick={() => setIsAlbumOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                title="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Pure Image Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => openLightbox(photo.image, idx)}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <img
                      src={photo.image}
                      alt="ภาพการปฏิบัติงาน"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-slate-900/80 text-white backdrop-blur-sm shadow-md">
                        <Camera className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Album Modal Gallery: Work Artifacts */}
      {isArtifactsAlbumOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsArtifactsAlbumOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <Images className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  อัลบั้มผลงานระหว่างปฏิบัติงาน ({artifacts.length} ภาพ)
                </h3>
              </div>
              <button
                onClick={() => setIsArtifactsAlbumOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                title="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Pure Image Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {artifacts.map((artifact, idx) => (
                  <div
                    key={artifact.id || idx}
                    onClick={() => openArtifactsLightbox(artifact.image, idx)}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <img
                      src={artifact.image}
                      alt="ผลงานระหว่างปฏิบัติงาน"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-slate-900/80 text-white backdrop-blur-sm shadow-md">
                        <FolderGit2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pure Image Modal Lightbox: Work Photos */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 sm:top-2 right-2 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-lg"
              title="ปิด"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Button */}
            {photos.length > 1 && (
              <button
                onClick={prevLightboxImage}
                className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-lg"
                title="ภาพก่อนหน้า"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image Container */}
            <div className="max-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={photos[lightboxIndex].image}
                alt="ภาพการปฏิบัติงาน"
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Right Button */}
            {photos.length > 1 && (
              <button
                onClick={nextLightboxImage}
                className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-lg"
                title="ภาพถัดไป"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image Counter Badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}

      {/* Pure Image Modal Lightbox: Work Artifacts */}
      {artifactsLightboxIndex !== null && artifacts[artifactsLightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={closeArtifactsLightbox}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeArtifactsLightbox}
              className="absolute -top-12 sm:top-2 right-2 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-lg"
              title="ปิด"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Button */}
            {artifacts.length > 1 && (
              <button
                onClick={prevArtifactsLightboxImage}
                className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-lg"
                title="ภาพก่อนหน้า"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image Container */}
            <div className="max-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={artifacts[artifactsLightboxIndex].image}
                alt="ผลงานระหว่างปฏิบัติงาน"
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Right Button */}
            {artifacts.length > 1 && (
              <button
                onClick={nextArtifactsLightboxImage}
                className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-lg"
                title="ภาพถัดไป"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image Counter Badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-sm">
              {artifactsLightboxIndex + 1} / {artifacts.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
