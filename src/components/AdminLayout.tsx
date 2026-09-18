import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAdminSession, clearAdminSession } from '@/lib/data-store';
import { 
  Building2, 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  Camera,
  FolderGit2,
  GraduationCap, 
  Award, 
  Users, 
  LogOut, 
  UserCheck, 
  Menu as MenuIcon, 
  X,
  ExternalLink
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'แดชบอร์ดสรุปผล', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'จัดการข้อมูลโปรไฟล์', href: '/admin/profile', icon: UserCheck },
  { label: 'จัดการข้อมูลสถานศึกษา', href: '/admin/school-info', icon: Building2 },
  { label: 'จัดการข้อมูลครูในแผนก IT', href: '/admin/it-teachers', icon: Users },
  { label: 'จัดการตารางสอน', href: '/admin/schedule', icon: Calendar },
  { label: 'จัดการแผนการสอน', href: '/admin/lesson-plan', icon: BookOpen },
  { label: 'จัดการบันทึกการสอน', href: '/admin/teaching-log', icon: FileText },
  { label: 'จัดการภาพการปฏิบัติงาน', href: '/admin/work-photos', icon: Camera },
  { label: 'จัดการภาพผลงาน', href: '/admin/work-artifacts', icon: FolderGit2 },
  { label: 'จัดการภาพกิจกรรม', href: '/admin/activities', icon: ImageIcon },
  { label: 'จัดการวิจัยในชั้นเรียน', href: '/admin/classroom-research', icon: GraduationCap },
  { label: 'จัดการแบบประเมิน', href: '/admin/evaluation', icon: Award },
  { label: 'จัดการผู้ใช้งาน (Users)', href: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getAdminSession());

  useEffect(() => {
    const session = getAdminSession();
    if (!session && pathname !== '/admin/login') {
      navigate('/admin/login', { replace: true });
    } else {
      setCurrentUser(session);
    }
  }, [pathname, navigate]);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Admin Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-nantech-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar (Locked & Fixed without scrollbar) */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:flex w-full md:w-72 bg-slate-900 text-slate-300 flex-shrink-0 flex-col justify-between h-full md:h-screen md:sticky md:top-0 z-40 border-r border-slate-800`}
      >
        <div className="p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar">
          
          <div className="flex items-center space-x-3.5 pb-5 border-b border-slate-800">
            <div className="w-11 h-11 rounded-2xl bg-nantech-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">ระบบหลังบ้าน Admin</h2>
              <p className="text-xs text-nantech-400 font-medium mt-0.5">วิทยาลัยเทคนิคน่าน</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-nantech-600 text-white shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="leading-snug">{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        <div className="p-4 border-t border-slate-800 space-y-3 flex-shrink-0 bg-slate-900">
          {currentUser && (
            <div className="px-3 py-2 bg-slate-800/60 rounded-xl flex items-center justify-between">
              <div className="text-xs">
                <p className="text-white font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-nantech-400 uppercase font-semibold">{currentUser.role}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <span>ไปที่เว็บจริง</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content (Independent Scrollable Area) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-full">
        <Outlet />
      </main>

    </div>
  );
}
