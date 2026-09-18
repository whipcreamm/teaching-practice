import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { TeacherMember } from '@/lib/types';
import { compressImageFile } from '@/lib/utils';
import { Users, Plus, Pencil, Trash2, ArrowLeft, Check, X, Upload } from 'lucide-react';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherMember[]>(() => getStoredData<TeacherMember[]>('it_teachers') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherMember | null>(null);
  const [imageFileName, setImageFileName] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTeacher) return;
    setImageFileName(file.name);
    try {
      const b64 = await compressImageFile(file);
      setEditingTeacher((prev) => prev ? { ...prev, image: b64 } : prev);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        setEditingTeacher((prev) => prev ? { ...prev, image: b64 } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setImageFileName('');
    setEditingTeacher({
      id: 'teacher_' + Date.now(),
      name: '',
      position: 'ครู แผนกวิชาเทคโนโลยีสารสนเทศ',
      image: '',
      bio: '',
      order_num: teachers.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: TeacherMember) => {
    setImageFileName(teacher.image ? 'รูปปัจจุบัน' : '');
    setEditingTeacher({ ...teacher });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบครูท่านนี้หรือไม่?')) return;
    const filtered = teachers.filter((t) => t.id !== id);
    setTeachers(filtered);
    setStoredData('it_teachers', filtered);
    showNotification('ลบข้อมูลครูเรียบร้อยแล้ว');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    let updated = [...teachers];
    const index = updated.findIndex((t) => t.id === editingTeacher.id);
    if (index >= 0) {
      updated[index] = editingTeacher;
    } else {
      updated.push(editingTeacher);
    }
    updated.sort((a, b) => Number(a.order_num || 0) - Number(b.order_num || 0));

    setTeachers(updated);
    setStoredData('it_teachers', updated);
    setIsModalOpen(false);
    setEditingTeacher(null);
    setImageFileName('');
    showNotification('บันทึกข้อมูลครูเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการข้อมูลครู</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการข้อมูลครูในแผนกวิชาเทคโนโลยีสารสนเทศ</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการรายนาม คณะครูและบุคลากรในแผนกวิชาเทคโนโลยีสารสนเทศ</p>
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
            <span>เพิ่มครูในแผนก</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr className="text-center">
                <th className="px-5 py-3.5 w-16">ลำดับ</th>
                <th className="px-5 py-3.5">รูปภาพ</th>
                <th className="px-5 py-3.5">ชื่อ-สกุล</th>
                <th className="px-5 py-3.5">ตำแหน่ง</th>
                <th className="px-5 py-3.5 w-24">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t, idx) => (
                <tr key={t.id || idx} className="hover:bg-slate-50/80 transition-colors text-center">
                  <td className="px-5 py-4 font-semibold text-slate-400">{t.order_num || idx + 1}</td>
                  <td className="px-5 py-4 flex justify-center items-center">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-10 h-10 rounded-xl object-contain bg-slate-50 border" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Upload className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800">{t.name}</td>
                  <td className="px-5 py-4 text-nantech-600 font-medium">{t.position}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-nantech-600 hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
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
      {isModalOpen && editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {teachers.some((t) => t.id === editingTeacher.id) ? 'แก้ไขข้อมูลครู' : 'เพิ่มครูในแผนกใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-สกุล ครู</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ตำแหน่ง</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.position}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label>
                  <input
                    type="number"
                    value={editingTeacher.order_num}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, order_num: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รูปถ่ายครู</label>
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
                {editingTeacher.image && (
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
