import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { ActivityItem } from '@/lib/types';
import { formatThaiDate, compressImageFile } from '@/lib/utils';
import { Image as ImageIcon, Plus, Pencil, Trash2, ArrowLeft, Check, X, Upload } from 'lucide-react';

export default function AdminActivities() {
  const [activities, setActivities] = useState<ActivityItem[]>(() => getStoredData<ActivityItem[]>('activities') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [imageFileName, setImageFileName] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setImageFileName(file.name);
    try {
      const b64 = await compressImageFile(file);
      setEditingItem((prev) => prev ? { ...prev, images: [b64] } : prev);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        setEditingItem((prev) => prev ? { ...prev, images: [b64] } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setImageFileName('');
    setEditingItem({
      id: 'act_' + Date.now(),
      term: 'term1',
      title: '',
      date: '',
      location: 'วิทยาลัยเทคนิคน่าน',
      description: '',
      images: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ActivityItem) => {
    setImageFileName(item.images?.[0] ? 'รูปปัจจุบัน' : '');
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบกิจกรรมนี้หรือไม่?')) return;
    const filtered = activities.filter((a) => a.id !== id);
    setActivities(filtered);
    setStoredData('activities', filtered);
    showNotification('ลบกิจกรรมเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...activities];
    const index = updated.findIndex((a) => a.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setActivities(updated);
    setStoredData('activities', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    setImageFileName('');
    showNotification('บันทึกกิจกรรมเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการภาพกิจกรรม</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการภาพและข่าวกิจกรรม ({activities.length} กิจกรรม)</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการภาพถ่ายและรายละเอียดกิจกรรมภายในสถานศึกษา</p>
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
            <span>เพิ่มภาพกิจกรรม</span>
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
                <th className="px-6 py-4 text-center">ภาคเรียน</th>
                <th className="px-6 py-4 text-center">ชื่อกิจกรรม</th>
                <th className="px-6 py-4 text-center">วันที่</th>
                <th className="px-6 py-4 text-center">สถานที่</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                  <td className="py-5 font-semibold text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.term === 'term1' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                      {item.term === 'term1' ? 'ภาค 1' : 'ภาค 2'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-800 text-center">{item.title}</td>
                  <td className="px-6 py-5 text-slate-500 text-center">{formatThaiDate(item.date)}</td>
                  <td className="px-6 py-5 text-slate-500 text-center">{item.location}</td>
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
                {activities.some((a) => a.id === editingItem.id) ? 'แก้ไขกิจกรรม' : 'เพิ่มภาพกิจกรรมใหม่'}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">วันที่</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 15 ก.ย. 2569"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อกิจกรรม</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานที่</label>
                <input
                  type="text"
                  required
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รายละเอียดกิจกรรม</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รูปภาพกิจกรรม</label>
                <label className="flex items-center space-x-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-4 h-4 text-nantech-600 shrink-0" />
                  <span className="text-sm text-slate-500 truncate">
                    {imageFileName || 'คลิกเพื่อเลือกรูปภาพ...'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {editingItem.images?.[0] && (
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
