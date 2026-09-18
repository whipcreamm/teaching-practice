import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { WorkArtifactItem } from '@/lib/types';
import { compressImageFile } from '@/lib/utils';
import { FolderGit2, Plus, Pencil, Trash2, ArrowLeft, Check, X, Upload, Images, Loader2 } from 'lucide-react';

export default function AdminWorkArtifacts() {
  const [artifacts, setArtifacts] = useState<WorkArtifactItem[]>(() => getStoredData<WorkArtifactItem[]>('work_artifacts') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkArtifactItem | null>(null);
  const [imageFileName, setImageFileName] = useState('');
  
  // Batch upload state
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; filename: string }>({
    current: 0,
    total: 0,
    filename: '',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setArtifacts(getStoredData<WorkArtifactItem[]>('work_artifacts') || []);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setImageFileName(file.name);
    try {
      const b64 = await compressImageFile(file, 900, 900, 0.82);
      setEditingItem((prev) => prev ? { ...prev, image: b64 } : prev);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        setEditingItem((prev) => prev ? { ...prev, image: b64 } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  // Batch upload handler for multiple images (supports HEIC/HEIF)
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsBatchProcessing(true);
    setBatchProgress({ current: 0, total: fileList.length, filename: '' });

    const newArtifacts: WorkArtifactItem[] = [];
    const baseTimestamp = Date.now();

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setBatchProgress({ current: i + 1, total: fileList.length, filename: file.name });

      try {
        const b64 = await compressImageFile(file, 900, 900, 0.82);
        newArtifacts.push({
          id: `wa_${baseTimestamp}_${i}`,
          title: '', // ไม่ระบุชื่อภาพ
          date: '',
          image: b64,
        });
      } catch (err) {
        console.error(`Failed to process image ${file.name}:`, err);
      }
    }

    if (newArtifacts.length > 0) {
      const updated = [...artifacts, ...newArtifacts];
      setArtifacts(updated);
      setStoredData('work_artifacts', updated);
      showNotification(`อัปโหลดภาพผลงานสำเร็จจำนวน ${newArtifacts.length} ภาพ`);
    }

    setIsBatchProcessing(false);
    e.target.value = '';
  };

  const handleAdd = () => {
    setImageFileName('');
    setEditingItem({
      id: 'wa_' + Date.now(),
      title: '',
      date: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: WorkArtifactItem) => {
    setImageFileName(item.image ? 'รูปปัจจุบัน' : '');
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบภาพผลงานนี้หรือไม่?')) return;
    const filtered = artifacts.filter((p) => p.id !== id);
    setArtifacts(filtered);
    setStoredData('work_artifacts', filtered);
    showNotification('ลบภาพผลงานเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...artifacts];
    const index = updated.findIndex((p) => p.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setArtifacts(updated);
    setStoredData('work_artifacts', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    setImageFileName('');
    showNotification('บันทึกภาพผลงานเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการภาพผลงานระหว่างปฏิบัติงาน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการภาพผลงานระหว่างปฏิบัติงาน ({artifacts.length} ภาพ)</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการประมวลภาพชิ้นงาน สื่อการสอน และผลงานนักเรียน/นักศึกษา</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสรุปผล</span>
          </Link>
          
          {/* Batch Upload Button */}
          <label className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors cursor-pointer">
            <Images className="w-4 h-4" />
            <span>อัปโหลดหลายภาพ (Batch)</span>
            <input
              type="file"
              multiple
              accept="image/*,.heic,.heif"
              className="hidden"
              disabled={isBatchProcessing}
              onChange={handleBatchUpload}
            />
          </label>

          <button
            onClick={handleAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-xs font-semibold shadow-md shadow-nantech-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มภาพเดี่ยว</span>
          </button>
        </div>
      </div>

      {/* Batch Processing Indicator Modal */}
      {isBatchProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">กำลังประมวลผลรูปภาพ...</h3>
              <p className="text-xs text-slate-500">
                ประมวลผลและแปลงไฟล์ HEIC ({batchProgress.current} จาก {batchProgress.total} ภาพ)
              </p>
              {batchProgress.filename && (
                <p className="text-[11px] text-indigo-600 truncate max-w-xs mx-auto font-mono mt-1">
                  {batchProgress.filename}
                </p>
              )}
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(batchProgress.current / Math.max(batchProgress.total, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Info Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span className="font-bold text-slate-700">รายการภาพผลงานระหว่างปฏิบัติงานทั้งหมด</span>
        <span>แสดงทั้งหมด {artifacts.length} ภาพ</span>
      </div>

      {/* Photos Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-sm">
              <tr>
                <th className="px-6 py-4 w-16 text-center">ลำดับ</th>
                <th className="px-6 py-4 w-28 text-center">รูปภาพ</th>
                <th className="px-6 py-4 w-36 text-center">วันที่</th>
                <th className="px-6 py-4 text-left">คำอธิบายภาพ</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {artifacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-slate-400 text-center font-medium">
                    ยังไม่มีข้อมูลภาพผลงานระหว่างปฏิบัติงาน คลิก "อัปโหลดหลายภาพ (Batch)" หรือ "เพิ่มภาพเดี่ยว" เพื่อเริ่มต้น
                  </td>
                </tr>
              ) : (
                artifacts.map((photo, index) => (
                  <tr key={photo.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{index + 1}</td>
                    <td className="px-6 py-4">
                      {photo.image ? (
                        <img
                          src={photo.image}
                          alt={photo.title || 'ผลงาน'}
                          className="w-16 h-12 object-cover rounded-lg border border-slate-200 mx-auto shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center mx-auto text-slate-400 text-xs">
                          ไม่มีรูป
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {photo.date || '-'}
                    </td>
                    <td className="px-6 py-4 text-left font-medium text-slate-800 max-w-md truncate">
                      {photo.title || <span className="text-slate-400 italic">(ไม่มีคำอธิบาย)</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(photo)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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

      {/* Edit/Add Single Image Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {artifacts.some((p) => p.id === editingItem.id) ? 'แก้ไขภาพผลงาน' : 'เพิ่มภาพผลงานใหม่'}
                  </h2>
                  <p className="text-xs text-slate-500">กรอกข้อมูลและอัปโหลดภาพผลงานระหว่างปฏิบัติงาน</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  คำอธิบายภาพ / ชื่องาน <span className="text-slate-400 font-normal">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="เช่น ชิ้นงานนักศึกษาเรื่องการต่อวงจรไมโครคอนโทรลเลอร์"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500/20 focus:border-nantech-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  วันที่บันทึกภาพ <span className="text-slate-400 font-normal">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={editingItem.date || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  placeholder="เช่น 15 พ.ค. 2568"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500/20 focus:border-nantech-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ไฟล์รูปภาพ <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-nantech-500 rounded-2xl p-6 cursor-pointer bg-slate-50 hover:bg-slate-50/50 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">คลิกเพื่ออัปโหลดรูปภาพ</span>
                    <span className="text-[11px] text-slate-400 mt-1">รองรับ JPG, PNG, WEBP, HEIC (iPhone)</span>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {imageFileName && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>เลือกไฟล์แล้ว: {imageFileName}</span>
                    </p>
                  )}
                  {editingItem.image && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100">
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!editingItem.image}
                  className="px-6 py-2.5 rounded-xl bg-nantech-600 hover:bg-nantech-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-nantech-600/30 transition-colors"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}