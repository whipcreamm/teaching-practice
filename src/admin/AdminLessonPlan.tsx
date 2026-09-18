import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { LessonPlanItem } from '@/lib/types';
import { BookOpen, Plus, Pencil, Trash2, ArrowLeft, Check, X, FileText, Upload, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLessonPlan() {
  const [plans, setPlans] = useState<LessonPlanItem[]>(() => getStoredData<LessonPlanItem[]>('lesson_plan') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LessonPlanItem | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileSizeWarning, setFileSizeWarning] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setPlans(getStoredData<LessonPlanItem[]>('lesson_plan') || []);
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

  const handleAdd = () => {
    setUploadMode('file');
    setFileSizeWarning('');
    setIsProcessingFile(false);
    setEditingItem({
      id: 'lp_' + Date.now(),
      term: 'term1',
      unit_no: plans.length + 1,
      unit_name: '',
      hours: 4,
      pdf_link: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: LessonPlanItem) => {
    setUploadMode(item.pdf_link && !item.pdf_link.startsWith('data:') ? 'url' : 'file');
    setFileSizeWarning('');
    setIsProcessingFile(false);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบแผนการสอนนี้หรือไม่?')) return;
    const filtered = plans.filter((p) => p.id !== id);
    setPlans(filtered);
    setStoredData('lesson_plan', filtered);
    showNotification('ลบแผนการสอนเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...plans];
    const index = updated.findIndex((p) => p.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }
    updated.sort((a, b) => Number(a.unit_no || 0) - Number(b.unit_no || 0));

    setPlans(updated);
    setStoredData('lesson_plan', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotification('บันทึกแผนการสอนเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการแผนการสอน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการแผนการจัดการเรียนรู้</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการหน่วยการสอน จำนวนชั่วโมง และอัปโหลดไฟล์เอกสาร PDF</p>
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
            <span>เพิ่มหน่วยการสอน</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-sm">
              <tr>
                <th className="px-6 py-4 w-20 text-center">ลำดับ</th>
                <th className="py-4 text-center">ภาคเรียน</th>
                <th className="px-6 py-4 text-center">วิชา</th>
                <th className="px-6 py-4 text-center">ชม./สป.</th>
                <th className="px-6 py-4 text-center">เอกสาร PDF</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                  <td className="py-5 font-semibold text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.term === 'term1' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                      {item.term === 'term1' ? 'ภาค 1' : 'ภาค 2'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-800 text-center">{item.unit_name}</td>
                  <td className="px-6 py-5 text-slate-500 text-center">{item.hours} ชม.</td>
                  <td className="px-6 py-5 text-center">
                    {item.pdf_link ? (
                      <a
                        href={item.pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 text-nantech-600 hover:bg-emerald-100 font-semibold transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>เปิด PDF</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">ยังไม่มีไฟล์</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg text-slate-500 hover:text-nantech-600 hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {plans.some((p) => p.id === editingItem.id) ? 'แก้ไขแผนการสอน' : 'เพิ่มหน่วยการสอนใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ภาคเรียน</label>
                  <select
                    value={editingItem.term}
                    onChange={(e) => setEditingItem({ ...editingItem, term: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="term1">ภาคเรียนที่ 1</option>
                    <option value="term2">ภาคเรียนที่ 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">จำนวนชั่วโมง/สัปดาห์</label>
                  <input
                    type="number"
                    required
                    value={editingItem.hours}
                    onChange={(e) => setEditingItem({ ...editingItem, hours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">วิชา</label>
                <input
                  type="text"
                  required
                  value={editingItem.unit_name}
                  onChange={(e) => setEditingItem({ ...editingItem, unit_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">เอกสารแผนการสอน (PDF)</label>
                  <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-2.5 py-1 rounded-md transition-all ${uploadMode === 'file' ? 'bg-white text-nantech-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      อัปโหลดไฟล์
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all ${uploadMode === 'url' ? 'bg-white text-nantech-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      ลิงก์ / Google Drive
                    </button>
                  </div>
                </div>

                {editingItem.pdf_link ? (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center space-x-2.5 overflow-hidden text-xs text-emerald-800 font-medium">
                      <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">
                        {editingItem.pdf_link.startsWith('data:') ? 'อัปโหลดไฟล์ PDF เรียบร้อยแล้ว' : editingItem.pdf_link}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem({ ...editingItem, pdf_link: '' });
                        setFileSizeWarning('');
                      }}
                      className="p-1 rounded-lg text-emerald-600 hover:text-red-600 hover:bg-emerald-100 transition-colors"
                      title="ลบไฟล์"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : uploadMode === 'url' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/... หรือ URL ไฟล์ PDF"
                        value={editingItem.pdf_link}
                        onChange={(e) => setEditingItem({ ...editingItem, pdf_link: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      💡 แนะนำสำหรับไฟล์ขนาดใหญ่เกิน 10MB: สามารถอัปโหลดขึ้น Google Drive แล้วนำลิงก์มาวาง ระบบจะแปลงเป็น Preview ให้อัตโนมัติ
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      isProcessingFile 
                        ? 'border-nantech-400 bg-emerald-50/30' 
                        : 'border-slate-200 hover:border-nantech-500 bg-slate-50 hover:bg-emerald-50/50'
                    }`}>
                      {isProcessingFile ? (
                        <>
                          <Loader2 className="w-7 h-7 text-nantech-600 animate-spin mb-2" />
                          <span className="text-xs font-bold text-nantech-700">กำลังประมวลผลและอ่านไฟล์ PDF...</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">กรุณารอสักครู่</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-7 h-7 text-slate-400 group-hover:text-nantech-600 mb-2" />
                          <span className="text-xs font-bold text-slate-700">คลิกเพื่อเลือกไฟล์ PDF หรือลากวางไฟล์ที่นี่</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">รองรับเฉพาะไฟล์เอกสาร .pdf</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={isProcessingFile}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
                              alert('กรุณาเลือกไฟล์รูปแบบ PDF เท่านั้น');
                              return;
                            }
                            
                            const sizeInMb = file.size / (1024 * 1024);
                            if (sizeInMb > 25) {
                              alert(`ไฟล์มีขนาด ${sizeInMb.toFixed(1)} MB ซึ่งใหญ่เกินกำหนด (ไม่เกิน 25 MB) แนะนำให้ใช้ตัวเลือกระบุ 'ลิงก์ / Google Drive' แทนครับ`);
                              return;
                            } else if (sizeInMb > 8) {
                              setFileSizeWarning(`ไฟล์นี้มีขนาด ${sizeInMb.toFixed(1)} MB (ค่อนข้างใหญ่) กำลังอ่านข้อมูลและบันทึกลง IndexedDB ภายในเครื่อง`);
                            } else {
                              setFileSizeWarning('');
                            }

                            setIsProcessingFile(true);
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              setIsProcessingFile(false);
                              if (evt.target?.result) {
                                setEditingItem({ ...editingItem, pdf_link: evt.target.result as string });
                              }
                            };
                            reader.onerror = () => {
                              setIsProcessingFile(false);
                              alert('เกิดข้อผิดพลาดในการอ่านไฟล์ PDF');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {fileSizeWarning && (
                      <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                        <span>{fileSizeWarning}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">คำอธิบายรายวิชา</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-xs font-semibold shadow-md shadow-nantech-600/30"
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
