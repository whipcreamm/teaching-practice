import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { EvaluationItem } from '@/lib/types';
import { formatThaiDate } from '@/lib/utils';
import { 
  Award, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  Check, 
  X, 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';

export default function AdminEvaluation() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(() => getStoredData<EvaluationItem[]>('evaluation') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EvaluationItem | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setEvaluations(getStoredData<EvaluationItem[]>('evaluation') || []);
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
    setIsProcessingFile(false);
    setEditingItem({
      id: 'eval_' + Date.now(),
      evaluator_type: 'mentor',
      evaluator_name: 'อาจารย์สมศักดิ์ ปัญญาวิเศษ',
      title: 'การประเมินผลการจัดการเรียนรู้และการมีส่วนร่วม',
      score: 95,
      max_score: 100,
      comment: '',
      date: '25 ก.ย. 2569',
      pdf_link: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: EvaluationItem) => {
    setUploadMode(item.pdf_link && !item.pdf_link.startsWith('data:') ? 'url' : 'file');
    setIsProcessingFile(false);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณต้องการลบผลการประเมินนี้หรือไม่?')) return;
    const filtered = evaluations.filter((e) => e.id !== id);
    setEvaluations(filtered);
    setStoredData('evaluation', filtered);
    showNotification('ลบผลการประเมินเรียบร้อย');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('กรุณาเลือกไฟล์เอกสารนามสกุล .pdf เท่านั้น');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setEditingItem((prev) => (prev ? { ...prev, pdf_link: b64 } : prev));
      setIsProcessingFile(false);
      showNotification(`อัปโหลดไฟล์ "${file.name}" เรียบร้อยแล้ว`);
    };
    reader.onerror = () => {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ PDF');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...evaluations];
    const index = updated.findIndex((e) => e.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setEvaluations(updated);
    setStoredData('evaluation', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotification('บันทึกผลการประเมินเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการแบบประเมิน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการแบบประเมินการฝึกสอน ({evaluations.length} รายการ)</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการบันทึก ผลคะแนนการประเมิน และไฟล์เอกสาร PDF จากผู้เกี่ยวข้อง</p>
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
            <span>เพิ่มผลการประเมิน</span>
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
                <th className="px-6 py-4 w-16 text-center">ลำดับ</th>
                <th className="px-6 py-4 text-center">ผู้ประเมิน</th>
                <th className="px-6 py-4 text-center">ประเภท</th>
                <th className="px-6 py-4 text-center">หัวข้อประเมิน</th>
                <th className="px-6 py-4 text-center">คะแนนที่ได้</th>
                <th className="px-6 py-4 text-center">เอกสาร PDF</th>
                <th className="px-6 py-4 text-center">วันที่</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                  <td className="px-6 py-5 font-bold text-slate-800 text-center">{item.evaluator_name}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {item.evaluator_type === 'mentor' ? 'ครูพี่เลี้ยง' : item.evaluator_type === 'executive' ? 'ผู้บริหาร' : 'กรรมการ'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-700 text-center">{item.title}</td>
                  <td className="px-6 py-5 font-bold text-emerald-600 text-center text-base">{item.score} / {item.max_score}</td>
                  <td className="px-6 py-5 text-center">
                    {item.pdf_link ? (
                      <a
                        href={item.pdf_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                        title="คลิกเปิดดูไฟล์ PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>มีไฟล์ PDF</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-center">{formatThaiDate(item.date)}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg text-slate-500 hover:text-nantech-600 hover:bg-slate-100 transition-colors"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                        title="ลบ"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {evaluations.some((e) => e.id === editingItem.id) ? 'แก้ไขผลการประเมิน' : 'เพิ่มผลการประเมินใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">กลุ่มผู้ประเมิน</label>
                  <select
                    value={editingItem.evaluator_type}
                    onChange={(e) => setEditingItem({ ...editingItem, evaluator_type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="mentor">ครูพี่เลี้ยง</option>
                    <option value="executive">ผู้บริหาร</option>
                    <option value="committee">คณะกรรมการ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ประเมิน</label>
                  <input
                    type="text"
                    required
                    value={editingItem.evaluator_name}
                    onChange={(e) => setEditingItem({ ...editingItem, evaluator_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อการประเมิน</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">คะแนนที่ได้</label>
                  <input
                    type="number"
                    required
                    value={editingItem.score}
                    onChange={(e) => setEditingItem({ ...editingItem, score: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">คะแนนเต็ม</label>
                  <input
                    type="number"
                    required
                    value={editingItem.max_score}
                    onChange={(e) => setEditingItem({ ...editingItem, max_score: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">วันที่</label>
                  <input
                    type="text"
                    required
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ข้อเสนอแนะ / ความคิดเห็น</label>
                <textarea
                  rows={3}
                  value={editingItem.comment}
                  onChange={(e) => setEditingItem({ ...editingItem, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              {/* PDF Attachment Section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">แนบไฟล์แบบประเมิน (PDF)</label>
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
                        {editingItem.pdf_link.startsWith('data:') ? 'แนบไฟล์ PDF เรียบร้อยแล้ว' : editingItem.pdf_link}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <a
                        href={editingItem.pdf_link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100"
                        title="เปิดดู"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, pdf_link: '' })}
                        className="p-1 rounded-lg text-emerald-600 hover:text-red-600 hover:bg-emerald-100 transition-colors"
                        title="ลบไฟล์"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : uploadMode === 'url' ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/... หรือ URL ไฟล์ PDF"
                      value={editingItem.pdf_link || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, pdf_link: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    isProcessingFile 
                      ? 'border-nantech-400 bg-emerald-50/30' 
                      : 'border-slate-200 hover:border-nantech-500 bg-slate-50 hover:bg-emerald-50/50'
                  }`}>
                    {isProcessingFile ? (
                      <>
                        <Loader2 className="w-7 h-7 text-nantech-600 animate-spin mb-2" />
                        <span className="text-xs font-bold text-nantech-700">กำลังประมวลผลไฟล์ PDF...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-slate-400 group-hover:text-nantech-600 mb-2" />
                        <span className="text-xs font-bold text-slate-700">คลิกเพื่อเลือกไฟล์ PDF แนบ</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">รองรับเฉพาะไฟล์เอกสาร .pdf</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      disabled={isProcessingFile}
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
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
