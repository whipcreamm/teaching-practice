import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { ScheduleItem, ScheduleImagesData, TermType } from '@/lib/types';
import { compressImageFile } from '@/lib/utils';
import { Calendar, Plus, Pencil, Trash2, ArrowLeft, Check, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => getStoredData<ScheduleItem[]>('schedule') || []);
  const [scheduleImages, setScheduleImages] = useState<ScheduleImagesData>(() => getStoredData<ScheduleImagesData>('schedule_images') || { term1_image: '', term2_image: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [uploadingTerm, setUploadingTerm] = useState<TermType | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSchedules(getStoredData<ScheduleItem[]>('schedule') || []);
      setScheduleImages(getStoredData<ScheduleImagesData>('schedule_images') || { term1_image: '', term2_image: '' });
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nantech_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImageUpload = async (term: TermType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTerm(term);
    try {
      const b64 = await compressImageFile(file, 1600, 1600, 0.85);
      const updatedImages = {
        ...scheduleImages,
        [term === 'term1' ? 'term1_image' : 'term2_image']: b64,
      };
      setScheduleImages(updatedImages);
      setStoredData('schedule_images', updatedImages);
      showNotification(`อัปโหลดภาพตารางสอนสำหรับ ${term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'} เรียบร้อย`);
    } catch (err) {
      console.error('Failed to compress schedule image:', err);
      // Fallback FileReader
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        const updatedImages = {
          ...scheduleImages,
          [term === 'term1' ? 'term1_image' : 'term2_image']: b64,
        };
        setScheduleImages(updatedImages);
        setStoredData('schedule_images', updatedImages);
        showNotification(`อัปโหลดภาพตารางสอนสำหรับ ${term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'} เรียบร้อย`);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingTerm(null);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (term: TermType) => {
    const termName = term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2';
    if (!window.confirm(`คุณต้องการลบภาพตารางสอนของ ${termName} หรือไม่?`)) return;
    const updatedImages = {
      ...scheduleImages,
      [term === 'term1' ? 'term1_image' : 'term2_image']: '',
    };
    setScheduleImages(updatedImages);
    setStoredData('schedule_images', updatedImages);
    showNotification(`ลบภาพตารางสอนของ ${termName} เรียบร้อย`);
  };

  const handleAdd = () => {
    setEditingItem({
      id: 'sch_' + Date.now(),
      term: 'term1',
      subject_code: '',
      subject_name: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบรายวิชานี้หรือไม่?')) return;
    const filtered = schedules.filter((s) => s.id !== id);
    setSchedules(filtered);
    setStoredData('schedule', filtered);
    showNotification('ลบรายวิชาเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...schedules];
    const index = updated.findIndex((s) => s.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setSchedules(updated);
    setStoredData('schedule', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotification('บันทึกรายวิชาเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการตารางสอน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการตารางสอนและรายวิชา</h1>
            <p className="text-xs text-slate-500 mt-0.5">อัปโหลดภาพตารางสอนและจัดการรหัสวิชา/ชื่อวิชาทั้ง 2 ภาคเรียน</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสรุปผล</span>
          </Link>
          <button
            onClick={handleAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-xs font-semibold shadow-md shadow-nantech-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มวิชาใหม่</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* 1. Schedule Images Upload Section (แยกภาคเรียนที่ 1 และ ภาคเรียนที่ 2) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">อัปโหลดภาพตารางสอน (แยกตามภาคเรียน)</h2>
            <p className="text-xs text-slate-400">ภาพจะแสดงแบบเต็มความกว้าง (w-full) บนหน้าเว็บไซต์หลัก</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Term 1 Image Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                ภาพตารางสอน: ภาคเรียนที่ 1
              </span>
              {scheduleImages?.term1_image && (
                <button
                  onClick={() => handleRemoveImage('term1')}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบภาพ</span>
                </button>
              )}
            </div>

            {scheduleImages?.term1_image ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white aspect-[16/9] relative group">
                <img
                  src={scheduleImages.term1_image}
                  alt="ตารางสอน ภาคเรียนที่ 1"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-300 aspect-[16/9] flex flex-col items-center justify-center text-center p-4 bg-white text-slate-400">
                <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                <span className="text-xs font-medium">ยังไม่ได้อัปโหลดภาพตารางสอนเทอม 1</span>
              </div>
            )}

            <label className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-nantech-500 text-slate-700 text-xs font-semibold cursor-pointer shadow-sm transition-colors">
              {uploadingTerm === 'term1' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-nantech-600" />
                  <span>กำลังอัปโหลด...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-nantech-600" />
                  <span>{scheduleImages?.term1_image ? 'เปลี่ยนภาพตารางสอนเทอม 1' : 'อัปโหลดภาพตารางสอนเทอม 1'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,.heic,.heif"
                disabled={uploadingTerm !== null}
                className="hidden"
                onChange={(e) => handleImageUpload('term1', e)}
              />
            </label>
          </div>

          {/* Term 2 Image Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                ภาพตารางสอน: ภาคเรียนที่ 2
              </span>
              {scheduleImages?.term2_image && (
                <button
                  onClick={() => handleRemoveImage('term2')}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบภาพ</span>
                </button>
              )}
            </div>

            {scheduleImages?.term2_image ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white aspect-[16/9] relative group">
                <img
                  src={scheduleImages.term2_image}
                  alt="ตารางสอน ภาคเรียนที่ 2"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-300 aspect-[16/9] flex flex-col items-center justify-center text-center p-4 bg-white text-slate-400">
                <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                <span className="text-xs font-medium">ยังไม่ได้อัปโหลดภาพตารางสอนเทอม 2</span>
              </div>
            )}

            <label className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-nantech-500 text-slate-700 text-xs font-semibold cursor-pointer shadow-sm transition-colors">
              {uploadingTerm === 'term2' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-nantech-600" />
                  <span>กำลังอัปโหลด...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-nantech-600" />
                  <span>{scheduleImages?.term2_image ? 'เปลี่ยนภาพตารางสอนเทอม 2' : 'อัปโหลดภาพตารางสอนเทอม 2'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,.heic,.heif"
                disabled={uploadingTerm !== null}
                className="hidden"
                onChange={(e) => handleImageUpload('term2', e)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 2. Subjects Management Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">รายการรายวิชาที่รับผิดชอบการสอน</h2>
            <p className="text-xs text-slate-400">แสดงในตารางใต้ภาพตารางสอน (รหัสวิชา และ ชื่อวิชา)</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{schedules.length} รายการ</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">ลำดับ</th>
                  <th className="px-6 py-4 w-32 text-center">ภาคเรียน</th>
                  <th className="px-6 py-4 w-44 text-center">รหัสวิชา</th>
                  <th className="px-6 py-4 text-left">ชื่อวิชา</th>
                  <th className="px-6 py-4 text-center w-28">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-slate-400 text-center text-sm">
                      ยังไม่มีข้อมูลรายวิชา คลิก "เพิ่มวิชาใหม่" เพื่อเริ่มต้น
                    </td>
                  </tr>
                ) : (
                  schedules.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-400 text-center">{idx + 1}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.term === 'term1' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.term === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-nantech-700">
                        {item.subject_code}
                      </td>
                      <td className="px-6 py-4 text-left font-semibold text-slate-800">
                        {item.subject_name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-nantech-600 hover:bg-slate-100 transition-colors"
                            title="แก้ไข"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Simplified Modal (ภาคเรียน, รหัสวิชา, ชื่อวิชา) */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {schedules.some((s) => s.id === editingItem.id) ? 'แก้ไขรายวิชา' : 'เพิ่มรายวิชาใหม่'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ภาคเรียน</label>
                <select
                  value={editingItem.term}
                  onChange={(e) => setEditingItem({ ...editingItem, term: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500/20 focus:border-nantech-500"
                >
                  <option value="term1">ภาคเรียนที่ 1</option>
                  <option value="term2">ภาคเรียนที่ 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รหัสวิชา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น 30901-1002 หรือ 20901-2005"
                  value={editingItem.subject_code}
                  onChange={(e) => setEditingItem({ ...editingItem, subject_code: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500/20 focus:border-nantech-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อวิชา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การพัฒนาเว็บแอปพลิเคชัน"
                  value={editingItem.subject_name}
                  onChange={(e) => setEditingItem({ ...editingItem, subject_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500/20 focus:border-nantech-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-xs font-semibold shadow-md shadow-nantech-600/30"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
