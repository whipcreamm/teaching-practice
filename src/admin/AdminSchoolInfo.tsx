import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { SchoolInfoData, ExecutiveMember } from '@/lib/types';
import { compressImageFile } from '@/lib/utils';
import { Building2, Save, ArrowLeft, Check, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

export default function AdminSchoolInfo() {
  const [data, setData] = useState<SchoolInfoData>(() => getStoredData<SchoolInfoData>('school_info'));
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExec, setEditingExec] = useState<ExecutiveMember | null>(null);
  const [imageFileName, setImageFileName] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleChange = (field: 'history' | 'philosophy' | 'vision', value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData('school_info', data);
    showNotification('บันทึกข้อมูลสถานศึกษาเรียบร้อยแล้ว!');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingExec) return;
    setImageFileName(file.name);
    try {
      const b64 = await compressImageFile(file);
      setEditingExec((prev) => prev ? { ...prev, image: b64 } : prev);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        setEditingExec((prev) => prev ? { ...prev, image: b64 } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExec = () => {
    setImageFileName('');
    setEditingExec({
      id: 'exec_' + Date.now(),
      name: '',
      position: '',
      image: '',
      order_num: (data.executives?.length || 0) + 1
    });
    setIsModalOpen(true);
  };

  const handleEditExec = (exec: ExecutiveMember) => {
    setImageFileName(exec.image ? 'รูปปัจจุบัน' : '');
    setEditingExec({ ...exec });
    setIsModalOpen(true);
  };

  const handleDeleteExec = (id: string) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบผู้บริหารท่านนี้?')) return;
    const updated = (data.executives || []).filter((e) => e.id !== id);
    const newData = { ...data, executives: updated };
    setData(newData);
    setStoredData('school_info', newData);
    showNotification('ลบผู้บริหารเรียบร้อย');
  };

  const handleSaveExecModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExec) return;

    let updated = [...(data.executives || [])];
    const index = updated.findIndex((e) => e.id === editingExec.id);
    if (index >= 0) {
      updated[index] = editingExec;
    } else {
      updated.push(editingExec);
    }
    updated.sort((a, b) => Number(a.order_num || 0) - Number(b.order_num || 0));

    const newData = { ...data, executives: updated };
    setData(newData);
    setStoredData('school_info', newData);
    setIsModalOpen(false);
    setEditingExec(null);
    setImageFileName('');
    showNotification('บันทึกข้อมูลผู้บริหารเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-nantech-50 text-nantech-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการข้อมูลสถานศึกษา</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการข้อมูลสถานศึกษา</h1>
            <p className="text-xs text-slate-500 mt-0.5">แก้ไขประวัติวิทยาลัย, ปรัชญา, วิสัยทัศน์ และคณะผู้บริหาร</p>
          </div>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าสรุปผล</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main Info Form */}
      <form onSubmit={handleSaveInfo} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-base font-bold text-slate-800 border-b pb-3">ข้อมูลประวัติและอัตลักษณ์วิทยาลัย</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ประวัติความเป็นมา</label>
            <textarea
              rows={5}
              value={data.history || ''}
              onChange={(e) => handleChange('history', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500 leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ปรัชญาวิทยาลัย</label>
              <input
                type="text"
                value={data.philosophy || ''}
                onChange={(e) => handleChange('philosophy', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">วิสัยทัศน์วิทยาลัย</label>
              <input
                type="text"
                value={data.vision || ''}
                onChange={(e) => handleChange('vision', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-sm font-semibold shadow-md shadow-nantech-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูลสถานศึกษา</span>
          </button>
        </div>
      </form>

      {/* Executives Manager */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">คณะผู้บริหารวิทยาลัย</h2>
            <p className="text-xs text-slate-500">รายนามผู้อำนวยการและรองผู้อำนวยการ</p>
          </div>
          <button
            onClick={handleAddExec}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-nantech-600 hover:bg-nantech-700 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มผู้บริหาร</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {data.executives?.map((exec) => (
            <div key={exec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-3">
                {exec.image ? (
                  <img src={exec.image} alt={exec.name} className="w-12 h-12 rounded-xl object-contain bg-white border" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">{exec.name}</h3>
                  <p className="text-[11px] text-nantech-600 font-medium">{exec.position}</p>
                  <span className="text-[10px] text-slate-400">ลำดับที่ {exec.order_num}</span>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => handleEditExec(exec)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-nantech-600 hover:bg-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteExec(exec.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Executive */}
      {isModalOpen && editingExec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {data.executives?.some((e) => e.id === editingExec.id) ? 'แก้ไขข้อมูลผู้บริหาร' : 'เพิ่มผู้บริหารใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExecModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-สกุล</label>
                <input
                  type="text"
                  required
                  value={editingExec.name}
                  onChange={(e) => setEditingExec({ ...editingExec, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ตำแหน่ง</label>
                <input
                  type="text"
                  required
                  value={editingExec.position}
                  onChange={(e) => setEditingExec({ ...editingExec, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label>
                <input
                  type="number"
                  value={editingExec.order_num}
                  onChange={(e) => setEditingExec({ ...editingExec, order_num: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รูปถ่าย</label>
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
                {editingExec.image && (
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
