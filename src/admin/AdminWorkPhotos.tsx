import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { WorkPhotoItem } from '@/lib/types';
import { compressImageFile } from '@/lib/utils';
import { Camera, Plus, Pencil, Trash2, ArrowLeft, Check, X, Upload, Images, Loader2 } from 'lucide-react';

export default function AdminWorkPhotos() {
  const [photos, setPhotos] = useState<WorkPhotoItem[]>(() => getStoredData<WorkPhotoItem[]>('work_photos') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkPhotoItem | null>(null);
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
      setPhotos(getStoredData<WorkPhotoItem[]>('work_photos') || []);
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

    const newPhotos: WorkPhotoItem[] = [];
    const baseTimestamp = Date.now();

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setBatchProgress({ current: i + 1, total: fileList.length, filename: file.name });

      try {
        const b64 = await compressImageFile(file, 900, 900, 0.82);
        newPhotos.push({
          id: `wp_${baseTimestamp}_${i}`,
          title: '', // ไม่ระบุชื่อภาพ
          date: '',
          image: b64,
        });
      } catch (err) {
        console.error(`Failed to process image ${file.name}:`, err);
      }
    }

    if (newPhotos.length > 0) {
      const updated = [...photos, ...newPhotos];
      setPhotos(updated);
      setStoredData('work_photos', updated);
      showNotification(`อัปโหลดภาพสำเร็จจำนวน ${newPhotos.length} ภาพ`);
    }

    setIsBatchProcessing(false);
    // Reset file input value
    e.target.value = '';
  };

  const handleAdd = () => {
    setImageFileName('');
    setEditingItem({
      id: 'wp_' + Date.now(),
      title: '',
      date: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: WorkPhotoItem) => {
    setImageFileName(item.image ? 'รูปปัจจุบัน' : '');
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบภาพการปฏิบัติงานนี้หรือไม่?')) return;
    const filtered = photos.filter((p) => p.id !== id);
    setPhotos(filtered);
    setStoredData('work_photos', filtered);
    showNotification('ลบภาพการปฏิบัติงานเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...photos];
    const index = updated.findIndex((p) => p.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setPhotos(updated);
    setStoredData('work_photos', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    setImageFileName('');
    showNotification('บันทึกภาพการปฏิบัติงานเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการภาพการปฏิบัติงาน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการภาพการปฏิบัติงาน ({photos.length} ภาพ)</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการประมวลภาพถ่ายการปฏิบัติงานและฝึกสอนในสถานศึกษา</p>
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
          <label className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-colors cursor-pointer">
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
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">กำลังประมวลผลรูปภาพ...</h3>
              <p className="text-xs text-slate-500">
                ประมวลผลและแปลงไฟล์ HEIC ({batchProgress.current} จาก {batchProgress.total} ภาพ)
              </p>
              {batchProgress.filename && (
                <p className="text-[11px] text-cyan-600 truncate max-w-xs mx-auto font-mono mt-1">
                  {batchProgress.filename}
                </p>
              )}
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-600 h-full transition-all duration-300 rounded-full"
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
        <span className="font-bold text-slate-700">รายการภาพถ่ายการปฏิบัติงานทั้งหมด</span>
        <span>แสดงทั้งหมด {photos.length} ภาพ</span>
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
              {photos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    ยังไม่มีข้อมูลภาพการปฏิบัติงาน
                  </td>
                </tr>
              ) : (
                photos.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                    <td className="px-6 py-5">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-12 rounded-xl object-contain bg-slate-50 border mx-auto shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 text-xs">
                          ไม่มีรูป
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-slate-600 text-center whitespace-nowrap">{item.date || '-'}</td>
                    <td className="px-6 py-5 font-medium text-slate-800 text-left max-w-md">{item.title}</td>
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
                ))
              )}
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
                {photos.some((p) => p.id === editingItem.id) ? 'แก้ไขภาพการปฏิบัติงาน' : 'เพิ่มภาพการปฏิบัติงานใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">วันที่ (เช่น 6 พ.ค. 2568)</label>
                <input
                  type="text"
                  placeholder="เช่น 6 พ.ค. 2568 หรือ 6/5/2568"
                  value={editingItem.date || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">คำอธิบายภาพการปฏิบัติงาน (ไม่บังคับ)</label>
                <textarea
                  rows={2}
                  placeholder="เช่น การประชุมแผนกวิชา หรือเว้นว่างไว้ได้"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รูปภาพการปฏิบัติงาน</label>
                <label className="flex items-center space-x-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-4 h-4 text-nantech-600 shrink-0" />
                  <span className="text-sm text-slate-500 truncate">
                    {imageFileName || 'คลิกเพื่อเลือกรูปภาพ... (รองรับ JPG, PNG, HEIC)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {editingItem.image && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">✓ มีรูปภาพแล้ว</p>
                )}
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
