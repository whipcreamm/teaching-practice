import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Calendar, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  Menu as MenuIcon, 
  X
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'หน้าแรก', to: '/', icon: Home },
  { label: 'สถานศึกษาฝึกประสบการณ์สอน', to: '/school-info', icon: Building2 },
  { label: 'ตารางสอน', to: '/schedule', icon: Calendar },
  { label: 'แผนการสอน', to: '/lesson-plan', icon: BookOpen },
  { label: 'บันทึกการฝึกสอน', to: '/teaching-log', icon: FileText },
  { label: 'กิจกรรม', to: '/activities', icon: ImageIcon },
  { label: 'วิจัยในชั้นเรียน', to: '/classroom-research', icon: GraduationCap },
  { label: 'แบบประเมินการฝึกสอน', to: '/evaluation', icon: Award },
];

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setTopBarVisible(false);
      } else if (scrollY < 10) {
        setTopBarVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ─── ชั้นบน (Top Tier): ชื่อเว็บไซต์ / แบรนด์ และ ปุ่มเข้าสู่ระบบ Admin ─── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          topBarVisible ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & Brand Name */}
            <Link to="/" className="flex items-center space-x-3.5 group">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-nantech-700 via-nantech-600 to-nantech-400 p-0.5 shadow-md shadow-nantech-600/15 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-nantech-600" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-semibold text-nantech-600 tracking-wider uppercase">
                  วิทยาลัยเทคนิคน่าน • Nan Technical College
                </span>
                <span className="block text-base sm:text-xl font-bold text-slate-900 leading-tight">
                  ระบบฝึกประสบการณ์สอน
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500">
                  แผนกวิชาเทคโนโลยีสารสนเทศ (Information Technology Department)
                </span>
              </div>
            </Link>

            {/* Top Right: Admin Login & Mobile Hamburger */}
            <div className="flex items-center space-x-3">
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs sm:text-sm font-medium hover:from-nantech-700 hover:to-nantech-600 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>เข้าสู่ระบบ Admin</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-nantech-600 hover:bg-emerald-50 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
        </div>
      </div>

      {/* ─── ชั้นล่าง (Bottom Tier): แถบเมนูนำทาง (Desktop) ─── */}
      <div className="hidden lg:block bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-emerald-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-1.5 space-x-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-nantech-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-nantech-700 hover:bg-emerald-50/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ─── Mobile Drawer Menu ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            เมนูระบบ
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-nantech-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-nantech-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-nantech-600'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-nantech-600 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>เข้าสู่ระบบ Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
