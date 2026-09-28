import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { TeachingLogItem, TermType } from '@/lib/types';
import TermSwitcher from '@/components/TermSwitcher';
import { formatThaiDate } from '@/lib/utils';
import { FileText, Plus, Pencil, Trash2, ArrowLeft, Check, X } from 'lucide-react';

export default function AdminTeachingLog() {
  const [logs, setLogs] = useState<TeachingLogItem[]>(() => getStoredData<TeachingLogItem[]>('teaching_log') || []);
  const [currentTerm, setCurrentTerm] = useState<TermType>('term1');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeachingLogItem | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');

  // Mouse wheel scroll handler for admin week selector
  const adminWeekScrollRef = useRef<HTMLDivElement | null>(null);

  const handleAdminWheel = (e: WheelEvent) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      if (adminWeekScrollRef.current) {
        adminWeekScrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const setAdminWeekScrollRef = (node: HTMLDivElement | null) => {
    if (adminWeekScrollRef.current) {
      adminWeekScrollRef.current.removeEventListener('wheel', handleAdminWheel);
    }
    adminWeekScrollRef.current = node;
    if (node) {
      node.addEventListener('wheel', handleAdminWheel, { passive: false });
    }
  };

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
      term: currentTerm,
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
      term: item.term || currentTerm,
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
      term: editingItem.term || currentTerm,
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

  const termLogs = logs.filter((l) => (l.term || 'term1') === currentTerm);
  const filteredLogs = filterWeek === 'all'
    ? termLogs
    : termLogs.filter((l) => Number(l.week) === Number(filterWeek));

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
            <h1 className="text-xl font-bold text-slate-800">จัดการบันทึกการปฏิบัติงาน</h1>
            <p className="text-xs text-slate-500 mt-0.5">บันทึกผลการปฏิบัติงานและการสอนรายวัน/รายสัปดาห์</p>
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

      {/* Filter by Term & Week */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-700">สลับภาคเรียน:</span>
            <TermSwitcher
              currentTerm={currentTerm}
              onTermChange={(t) => {
                setCurrentTerm(t);
                setFilterWeek('all');
              }}
            />
          </div>
          <div className="flex items-center space-x-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">กรองสัปดาห์:</span>
              <select
                value={filterWeek}
                onChange={(e) => setFilterWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-nantech-500"
              >
                <option value="all">ทุกสัปดาห์ ({termLogs.length} รายการ)</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => {
                  const count = termLogs.filter((l) => Number(l.week) === w).length;
                  return (
                    <option key={w} value={w}>
                      สัปดาห์ที่ {w} {count > 0 ? `(${count} รายการ)` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="text-xs text-slate-500">
              แสดง {filteredLogs.length} จาก {termLogs.length} รายการ ({currentTerm === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'})
            </div>
          </div>
        </div>

        {/* Scrollable Week Pills with Mouse Wheel Support */}
        <div
          ref={setAdminWeekScrollRef}
          className="flex items-center overflow-x-auto no-scrollbar space-x-1.5 py-1"
        >
          <button
            onClick={() => setFilterWeek('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all border ${
              filterWeek === 'all'
                ? 'bg-nantech-600 text-white border-nantech-600 shadow-sm shadow-nantech-600/30'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>ทุกสัปดาห์</span>
            <span
              className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                filterWeek === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {termLogs.length}
            </span>
          </button>
          {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => {
            const count = termLogs.filter((l) => Number(l.week) === w).length;
            const isActive = filterWeek === w;
            return (
              <button
                key={w}
                onClick={() => setFilterWeek(w)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all flex items-center space-x-1 border ${
                  isActive
                    ? 'bg-nantech-600 text-white border-nantech-600 shadow-sm shadow-nantech-600/30'
                    : count > 0
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>สัปดาห์ {w}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-sm">
              <tr>
                <th className="px-6 py-4 w-16 text-center">ลำดับ</th>
                <th className="px-6 py-4 w-32 text-center">สัปดาห์ / ภาคเรียน</th>
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
                    ไม่พบบันทึกการปฏิบัติงานในสัปดาห์นี้ ({currentTerm === 'term1' ? 'ภาคเรียนที่ 1' : 'ภาคเรียนที่ 2'})
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                    <td className="py-5 font-semibold text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          สัปดาห์ที่ {item.week || 1}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (item.term || 'term1') === 'term2' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {(item.term || 'term1') === 'term2' ? 'ภาค 2' : 'ภาค 1'}
                        </span>
                      </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ภาคเรียน</label>
                  <select
                    value={editingItem.term || currentTerm}
                    onChange={(e) => setEditingItem({ ...editingItem, term: e.target.value as TermType })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="term1">ภาคเรียนที่ 1</option>
                    <option value="term2">ภาคเรียนที่ 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">สัปดาห์ที่ (1 - 24)</label>
                  <select
                    value={editingItem.week || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, week: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
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
