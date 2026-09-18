import React, { useEffect, useState } from 'react';
import { getStoredData } from '@/lib/data-store';
import { SchoolInfoData, TeacherMember } from '@/lib/types';
import { Building2, Award, Users, Quote } from 'lucide-react';

export default function SchoolInfoPage() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfoData>(() => getStoredData<SchoolInfoData>('school_info'));
  const [teachers, setTeachers] = useState<TeacherMember[]>(() => getStoredData<TeacherMember[]>('it_teachers') || []);

  useEffect(() => {
    const handleUpdate = () => {
      setSchoolInfo(getStoredData<SchoolInfoData>('school_info'));
      setTeachers(getStoredData<TeacherMember[]>('it_teachers') || []);
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    return () => window.removeEventListener('nantech_storage_update', handleUpdate);
  }, []);

  const displayTeachers = (teachers && teachers.length > 0) ? teachers : (schoolInfo.it_teachers || []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-nantech-800 to-nantech-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <Building2 className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          {/* <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-nantech-300 text-xs font-semibold">
            <span>เมนู 1.2</span>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            สถานศึกษาฝึกประสบการณ์สอน
          </h1>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
            ข้อมูลประวัติความเป็นมา วิสัยทัศน์ คณะผู้บริหาร และบุคลากรครูแผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคน่าน
          </p>
        </div>
      </div>

      {/* History & Philosophy Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-3 text-nantech-600">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">ประวัติวิทยาลัยเทคนิคน่าน</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line pt-2">
            {schoolInfo.history}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-950 to-nantech-900 text-white rounded-3xl p-6 shadow-md relative">
            <Quote className="w-10 h-10 text-nantech-400/20 absolute top-4 right-4" />
            <h3 className="text-xs font-bold text-nantech-400 uppercase tracking-wider mb-2">ปรัชญาของวิทยาลัย</h3>
            <p className="text-base font-semibold text-white leading-relaxed italic">
              "{schoolInfo.philosophy}"
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-2">
            <h3 className="text-xs font-bold text-nantech-600 uppercase tracking-wider mb-1">วิสัยทัศน์ (Vision)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {schoolInfo.vision}
            </p>
          </div>
        </div>

      </section>

      {/* Executive Board Gallery */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-nantech-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">คณะผู้บริหารวิทยาลัยเทคนิคน่าน</h2>
            <p className="text-xs text-slate-500">ผู้อำนวยการและรองผู้อำนวยการประจำวิทยาลัย</p>
          </div>
        </div>

        {/* Row 1 — Executive #1 centered */}
        <div className="flex justify-center">
          {schoolInfo.executives?.slice(0, 1).map((exec) => (
            <div key={exec.id} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="relative h-80 bg-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-slate-800 text-base">{exec.name}</h3>
                <p className="text-xs text-nantech-600 font-medium mt-1">{exec.position}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 — Executives #2–5 in one 4-column row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {schoolInfo.executives?.slice(1, 5).map((exec) => (
            <div key={exec.id} className="w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="relative h-64 bg-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-slate-800 text-sm">{exec.name}</h3>
                <p className="text-xs text-nantech-600 font-medium mt-1">{exec.position}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IT Department Teachers (10 Members) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-nantech-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">ครูแผนกวิชาเทคโนโลยีสารสนเทศ</h2>
              <p className="text-xs text-slate-500">รายนามครูและบุคลากรทางการศึกษาประจำแผนกวิชาเทคโนโลยีสารสนเทศ</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {displayTeachers?.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 bg-slate-100 flex items-center justify-center">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold">
                    ลำดับที่ {teacher.order_num}
                  </div> */}
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{teacher.name}</h3>
                <p className="text-[11px] font-semibold text-nantech-600 mt-1">{teacher.position}</p>
                {/* <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">{teacher.bio}</p> */}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
