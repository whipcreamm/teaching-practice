import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { ProfileData } from '@/lib/types';
import { compressImageFile } from '@/lib/utils';
import { UserCheck, Save, ArrowLeft, Check, Upload } from 'lucide-react';

export default function AdminProfile() {
  const [data, setData] = useState<ProfileData>(() => getStoredData<ProfileData>('profile'));
  const [successMsg, setSuccessMsg] = useState('');
  const [studentImageName, setStudentImageName] = useState('');
  const [mentorImageName, setMentorImageName] = useState('');

  const handleChange = (field: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (
    field: 'student_image' | 'mentor_image',
    setFileName: (n: string) => void,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const b64 = await compressImageFile(file);
      handleChange(field, b64);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleChange(field, ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData('profile', data);
    setSuccessMsg('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-nantech-50 text-nantech-600 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการข้อมูลโปรไฟล์</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการข้อมูลโปรไฟล์ฝึกสอน</h1>
            <p className="text-xs text-slate-500 mt-0.5">แก้ไขข้อมูลผู้ฝึกสอน ครูพี่เลี้ยง และสถาบัน</p>
          </div>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าสรุปผล</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-base font-bold text-slate-800 border-b pb-3">ข้อมูลนักศึกษาผู้ฝึกสอน</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อ-นามสกุล นักศึกษา</label>
            <input
              type="text"
              value={data.student_name || ''}
              onChange={(e) => handleChange('student_name', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">รหัสนักศึกษา</label>
            <input
              type="text"
              value={data.student_id || ''}
              onChange={(e) => handleChange('student_id', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">สาขาวิชา</label>
            <input
              type="text"
              value={data.student_major || ''}
              onChange={(e) => handleChange('student_major', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">มหาวิทยาลัยต้นสังกัด</label>
            <input
              type="text"
              value={data.student_university || ''}
              onChange={(e) => handleChange('student_university', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">รูปถ่ายนักศึกษา</label>
            <label className="flex items-center space-x-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-4 h-4 text-nantech-600 shrink-0" />
              <span className="text-sm text-slate-500 truncate">
                {studentImageName || 'คลิกเพื่อเลือกรูปภาพ...'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload('student_image', setStudentImageName, e)}
              />
            </label>
            {data.student_image && (
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">✓ มีรูปภาพแล้ว</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ปีการศึกษา</label>
            <input
              type="text"
              value={data.academic_year || ''}
              onChange={(e) => handleChange('academic_year', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-800 border-b pb-3 pt-4">ข้อมูลครูพี่เลี้ยง & สถานศึกษา</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อครูพี่เลี้ยง</label>
            <input
              type="text"
              value={data.mentor_name || ''}
              onChange={(e) => handleChange('mentor_name', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ตำแหน่งครูพี่เลี้ยง</label>
            <input
              type="text"
              value={data.mentor_position || ''}
              onChange={(e) => handleChange('mentor_position', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">รูปถ่ายครูพี่เลี้ยง</label>
            <label className="flex items-center space-x-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-4 h-4 text-nantech-600 shrink-0" />
              <span className="text-sm text-slate-500 truncate">
                {mentorImageName || 'คลิกเพื่อเลือกรูปภาพ...'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload('mentor_image', setMentorImageName, e)}
              />
            </label>
            {data.mentor_image && (
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">✓ มีรูปภาพแล้ว</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อสถานศึกษา</label>
            <input
              type="text"
              value={data.school_name || ''}
              onChange={(e) => handleChange('school_name', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ที่อยู่สถานศึกษา</label>
            <input
              type="text"
              value={data.school_address || ''}
              onChange={(e) => handleChange('school_address', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">คำอธิบายภาพรวม (Bio)</label>
            <textarea
              rows={3}
              value={data.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-sm font-semibold shadow-md shadow-nantech-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูลโปรไฟล์</span>
          </button>
        </div>
      </form>
    </div>
  );
}
