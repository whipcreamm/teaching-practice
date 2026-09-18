import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { ClassroomResearchItem } from '@/lib/types';
import { GraduationCap, Plus, Pencil, Trash2, ArrowLeft, Check, X, FileText } from 'lucide-react';

export default function AdminClassroomResearch() {
  const [researches, setResearches] = useState<ClassroomResearchItem[]>(() => getStoredData<ClassroomResearchItem[]>('classroom_research') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassroomResearchItem | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAdd = () => {
    setEditingItem({
      id: 'res_' + Date.now(),
      year: '2569',
      title: '',
      target_group: 'นักเรียนระดับชั้น ปวช.2 สาขาวิชาเทคโนโลยีสารสนเทศ',
      abstract: '',
      result: '',
      file_link: 'https://example.com/research-sample.pdf',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ClassroomResearchItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบงานวิจัยนี้หรือไม่?')) return;
    const filtered = researches.filter((r) => r.id !== id);
    setResearches(filtered);
    setStoredData('classroom_research', filtered);
    showNotification('ลบงานวิจัยเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...researches];
    const index = updated.findIndex((r) => r.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setResearches(updated);
    setStoredData('classroom_research', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotification('บันทึกงานวิจัยเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการวิจัยในชั้นเรียน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการวิจัยในชั้นเรียน ({researches.length} เรื่อง)</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการรายงานวิจัยเพื่อพัฒนาการจัดการเรียนรู้</p>
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
            <span>เพิ่มงานวิจัย</span>
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
                <th className="px-6 py-4 text-center">ปีการศึกษา</th>
                <th className="px-6 py-4 text-center">ชื่องานวิจัย</th>
                <th className="px-6 py-4 text-center">กลุ่มเป้าหมาย</th>
                <th className="px-6 py-4 text-center">เอกสาร</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {researches.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                  <td className="px-6 py-5 font-bold text-nantech-600 text-center">{item.year}</td>
                  <td className="px-6 py-5 font-bold text-slate-800 text-center">{item.title}</td>
                  <td className="px-6 py-5 text-slate-500 text-center">{item.target_group}</td>
                  <td className="px-6 py-5 text-center">
                    <a
                      href={item.file_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 text-nantech-600 hover:bg-emerald-100 font-semibold transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>ดาวน์โหลด</span>
                    </a>
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
                {researches.some((r) => r.id === editingItem.id) ? 'แก้ไขงานวิจัย' : 'เพิ่มงานวิจัยใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ปีการศึกษา</label>
                  <input
                    type="text"
                    required
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">กลุ่มเป้าหมาย</label>
                  <input
                    type="text"
                    required
                    value={editingItem.target_group}
                    onChange={(e) => setEditingItem({ ...editingItem, target_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่องานวิจัย</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">บทคัดย่อ</label>
                <textarea
                  rows={3}
                  value={editingItem.abstract}
                  onChange={(e) => setEditingItem({ ...editingItem, abstract: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ผลการวิจัย</label>
                <textarea
                  rows={2}
                  value={editingItem.result}
                  onChange={(e) => setEditingItem({ ...editingItem, result: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ลิงก์เอกสารงานวิจัย (URL)</label>
                <input
                  type="text"
                  required
                  value={editingItem.file_link}
                  onChange={(e) => setEditingItem({ ...editingItem, file_link: e.target.value })}
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
