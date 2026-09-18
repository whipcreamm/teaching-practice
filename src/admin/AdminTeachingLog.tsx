import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { TeachingLogItem } from '@/lib/types';
import { formatThaiDate } from '@/lib/utils';
import { FileText, Plus, Pencil, Trash2, ArrowLeft, Check, X } from 'lucide-react';

export default function AdminTeachingLog() {
  const [logs, setLogs] = useState<TeachingLogItem[]>(() => getStoredData<TeachingLogItem[]>('teaching_log') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeachingLogItem | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');

  useEffect(() => {
    const handleUpdate = () => {
      setLogs(getStoredData<TeachingLogItem[]>('teaching_log') || []);
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
    setEditingItem({
      id: 'log_' + Date.now(),
      week: filterWeek === 'all' ? 1 : filterWeek,
      date: '',
      work: '',
      note: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TeachingLogItem) => {
    setEditingItem({ 
      ...item,
      week: Number(item.week) || 1,
      work: item.work || item.topic || '',
      note: item.note || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบบันทึกการสอนนี้หรือไม่?')) return;
    const filtered = logs.filter((l) => l.id !== id);
    setLogs(filtered);
    setStoredData('teaching_log', filtered);
    showNotification('ลบบันทึกการสอนเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const itemToSave: TeachingLogItem = {
      ...editingItem,
      week: Number(editingItem.week) || 1,
      date: editingItem.date || '',
      work: editingItem.work || editingItem.topic || '',
      topic: editingItem.work || editingItem.topic || '',
      note: editingItem.note || '',
    };

    let updated = [...logs];
    const index = updated.findIndex((l) => l.id === itemToSave.id);
    if (index >= 0) {
      updated[index] = itemToSave;
    } else {
      updated.push(itemToSave);
    }
    updated.sort((a, b) => (Number(a.week) || 1) - (Number(b.week) || 1));

    setLogs(updated);
    setStoredData('teaching_log', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotification('บันทึกผลการปฏิบัติงานเรียบร้อยแล้ว!');
  };

  const filteredLogs = filterWeek === 'all'
    ? logs
    : logs.filter((l) => Number(l.week) === Number(filterWeek));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการบันทึกการปฏิบัติงาน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการบันทึกการปฏิบัติงาน ({logs.length} รายการ)</h1>
            <p className="text-xs text-slate-500 mt-0.5">บันทึกผลการปฏิบัติงานและการสอนรายวัน/รายสัปดาห์ (สัปดาห์ที่ 1 - 22)</p>
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
            <span>เพิ่มบันทึกการทำงาน</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Filter by Week */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">กรองตามสัปดาห์:</span>
          <select
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-nantech-500"
          >
            <option value="all">ทุกสัปดาห์ ({logs.length} รายการ)</option>
            {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => {
              const count = logs.filter((l) => Number(l.week) === w).length;
              return (
                <option key={w} value={w}>
                  สัปดาห์ที่ {w} {count > 0 ? `(${count} รายการ)` : ''}
                </option>
              );
            })}
          </select>
        </div>
        <div className="text-xs text-slate-500">
          แสดง {filteredLogs.length} จากทั้งหมด {logs.length} รายการ
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-sm">
              <tr>
                <th className="px-6 py-4 w-16 text-center">ลำดับ</th>
                <th className="px-6 py-4 w-28 text-center">สัปดาห์</th>
                <th className="px-6 py-4 w-32 text-center">วันที่</th>
                <th className="px-6 py-4 text-left">การทำงาน</th>
                <th className="px-6 py-4 w-36 text-center">หมายเหตุ</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    ไม่พบบันทึกการปฏิบัติงานในสัปดาห์นี้
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                    <td className="py-5 font-semibold text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        สัปดาห์ที่ {item.week || 1}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-700 text-center">{formatThaiDate(item.date)}</td>
                    <td className="px-6 py-5 font-medium text-slate-800 text-left leading-relaxed whitespace-pre-line">
                      {item.work || item.topic}
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-center whitespace-pre-line">{item.note || '-'}</td>
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
                {logs.some((l) => l.id === editingItem.id) ? 'แก้ไขบันทึกการปฏิบัติงาน' : 'เพิ่มบันทึกการปฏิบัติงานใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">สัปดาห์ที่ (1 - 22)</label>
                  <select
                    value={editingItem.week || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, week: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>สัปดาห์ที่ {w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">วันที่</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 6/5/2568 หรือ 6 พ.ค. 2568"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">การทำงาน (รายละเอียดการปฏิบัติงาน)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="เช่น ประชุมแผนกวิชาเตรียมความพร้อมก่อนเปิดภาคเรียน, เลือกวิชาสอน"
                  value={editingItem.work || editingItem.topic || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, work: e.target.value, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หมายเหตุ</label>
                <input
                  type="text"
                  placeholder="เช่น ห้อง 522 หรือ เวรประจำวัน (เว้นว่างได้)"
                  value={editingItem.note || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
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
