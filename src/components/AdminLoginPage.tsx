import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredData, setAdminSession } from '@/lib/data-store';
import { UserItem } from '@/lib/types';
import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck, School } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredData<UserItem[]>('users') || [];
      const matched = users.find(
        (u) => u.username === username.trim() && u.password === password
      );

      const isValid = matched || (username.trim() === 'admin' && password === 'admin123');

      if (isValid) {
        const sessionUser: UserItem = matched || {
          id: 'admin-default',
          username: 'admin',
          password: '',
          name: 'ผู้ดูแลระบบ (Admin)',
          role: 'admin',
        };
        setAdminSession(sessionUser);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-nantech-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับสู่หน้าหลักเว็บไซต์
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-nantech-600 to-nantech-700 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
              <School className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">เข้าสู่ระบบผู้ดูแล</h1>
            <p className="text-sm text-nantech-100 mt-1">
              ระบบฝึกประสบการณ์สอน แผนกวิชาเทคโนโลยีสารสนเทศ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start space-x-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="เช่น admin123"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-nantech-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-nantech-600 hover:bg-nantech-700 active:bg-nantech-800 text-white font-medium rounded-xl shadow-lg shadow-nantech-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
            </button>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <p className="font-semibold text-amber-900">บัญชีทดสอบสำหรับผู้ดูแลระบบ:</p>
              <p>Username: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin</code></p>
              <p>Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin123</code></p>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          วิทยาลัยเทคนิคน่าน • ระบบบริหารจัดการข้อมูลฝึกประสบการณ์สอน
        </p>
      </div>
    </div>
  );
}
