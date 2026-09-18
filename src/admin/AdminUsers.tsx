import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, setStoredData } from '@/lib/data-store';
import { UserItem } from '@/lib/types';
import { Users, Plus, Pencil, Trash2, ArrowLeft, Check, X, Shield } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>(() => getStoredData<UserItem[]>('users') || []);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserItem | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAdd = () => {
    setEditingItem({
      id: 'usr_' + Date.now(),
      username: '',
      password: '',
      name: '',
      role: 'admin',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: UserItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (users.length <= 1) {
      alert('ไม่สามารถลบผู้ใช้งานคนสุดท้ายได้');
      return;
    }
    if (!window.confirm('คุณต้องการลบผู้ใช้งานนี้หรือไม่?')) return;
    const filtered = users.filter((u) => u.id !== id);
    setUsers(filtered);
    setStoredData('users', filtered);
    showNotification('ลบผู้ใช้งานเรียบร้อย');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated = [...users];
    const index = updated.findIndex((u) => u.id === editingItem.id);
    if (index >= 0) {
      updated[index] = editingItem;
    } else {
      updated.push(editingItem);
    }

    setUsers(updated);
    setStoredData('users', updated);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotification('บันทึกผู้ใช้งานเรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-600">Dashboard</Link>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-nantech-600">จัดการผู้ใช้งาน</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">จัดการบัญชีผู้ใช้งาน ({users.length} บัญชี)</h1>
            <p className="text-xs text-slate-500 mt-0.5">จัดการบัญชีและกำหนดสิทธิ์การเข้าใช้งานระบบ Admin</p>
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
            <span>เพิ่มผู้ใช้งาน</span>
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
                <th className="px-6 py-4 text-center">ชื่อผู้ใช้งาน (Username)</th>
                <th className="px-6 py-4 text-center">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 text-center">บทบาท (Role)</th>
                <th className="px-6 py-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                  <td className="px-6 py-5 font-mono font-bold text-slate-800 text-center">{item.username}</td>
                  <td className="px-6 py-5 font-semibold text-slate-700 text-center">{item.name}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-nantech-50 text-nantech-700 text-xs font-bold uppercase">
                      {item.role}
                    </span>
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
                {users.some((u) => u.id === editingItem.id) ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
                <input
                  type="text"
                  required
                  value={editingItem.username}
                  onChange={(e) => setEditingItem({ ...editingItem, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
                <input
                  type="password"
                  value={editingItem.password || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })}
                  placeholder="กรอกเพื่อตั้งรหัสผ่านใหม่"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-สกุล</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">บทบาท (Role)</label>
                <select
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  <option value="mentor">ครูพี่เลี้ยง</option>
                  <option value="executive">ผู้บริหาร</option>
                  <option value="student">นักศึกษา</option>
                </select>
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
