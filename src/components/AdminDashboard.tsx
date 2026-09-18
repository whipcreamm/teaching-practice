import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, resetAllData, exportAllData, importAllData } from '@/lib/data-store';
import { 
  Building2, 
  Users, 
  Calendar, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  Camera,
  FolderGit2,
  GraduationCap, 
  Award, 
  UserCheck, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [profile, setProfile] = useState(() => getStoredData('profile'));
  const [schoolInfo, setSchoolInfo] = useState(() => getStoredData('school_info'));
  const [teachers, setTeachers] = useState(() => getStoredData('it_teachers') || []);
  const [schedules, setSchedules] = useState(() => getStoredData('schedule') || []);
  const [lessonPlans, setLessonPlans] = useState(() => getStoredData('lesson_plan') || []);
  const [teachingLogs, setTeachingLogs] = useState(() => getStoredData('teaching_log') || []);
  const [workPhotos, setWorkPhotos] = useState(() => getStoredData('work_photos') || []);
  const [workArtifacts, setWorkArtifacts] = useState(() => getStoredData('work_artifacts') || []);
  const [activities, setActivities] = useState(() => getStoredData('activities') || []);
  const [researches, setResearches] = useState(() => getStoredData('classroom_research') || []);
  const [evaluations, setEvaluations] = useState(() => getStoredData('evaluation') || []);

  const refreshData = () => {
    setProfile(getStoredData('profile'));
    setSchoolInfo(getStoredData('school_info'));
    setTeachers(getStoredData('it_teachers') || []);
    setSchedules(getStoredData('schedule') || []);
    setLessonPlans(getStoredData('lesson_plan') || []);
    setTeachingLogs(getStoredData('teaching_log') || []);
    setWorkPhotos(getStoredData('work_photos') || []);
    setWorkArtifacts(getStoredData('work_artifacts') || []);
    setActivities(getStoredData('activities') || []);
    setResearches(getStoredData('classroom_research') || []);
    setEvaluations(getStoredData('evaluation') || []);
  };

  useEffect(() => {
    window.addEventListener('nantech_storage_update', refreshData);
    return () => window.removeEventListener('nantech_storage_update', refreshData);
  }, []);

  const handleReset = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่? (ข้อมูลที่แก้ไขไว้จะกลับเป็นค่า Mock)')) {
      resetAllData();
      refreshData();
    }
  };

  const statCards = [
    {
      title: 'ข้อมูลสถานศึกษา',
      subtitle: 'ประวัติ, ปรัชญา, วิสัยทัศน์ & ผู้บริหาร',
      count: `${schoolInfo?.executives?.length || 4} ผู้บริหาร`,
      href: '/admin/school-info',
      icon: Building2,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'ครูแผนกวิชา IT',
      subtitle: 'แยกจัดการครูในแผนกโดยเฉพาะ',
      count: `${teachers.length} ท่าน`,
      href: '/admin/it-teachers',
      icon: Users,
      color: 'bg-teal-500',
      lightBg: 'bg-teal-50 text-teal-700',
    },
    {
      title: 'ตารางสอน',
      subtitle: 'ภาคเรียนที่ 1 & ภาคเรียนที่ 2',
      count: `${schedules.length} รายการ`,
      href: '/admin/schedule',
      icon: Calendar,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'แผนการสอน',
      subtitle: 'หน่วยการเรียนรู้ & ลิงก์ PDF',
      count: `${lessonPlans.length} หน่วย`,
      href: '/admin/lesson-plan',
      icon: BookOpen,
      color: 'bg-indigo-500',
      lightBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'บันทึกการสอน',
      subtitle: 'บันทึกรายสัปดาห์ & ปัญหา/วิธีแก้',
      count: `${teachingLogs.length} บันทึก`,
      href: '/admin/teaching-log',
      icon: FileText,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'ภาพการปฏิบัติงาน',
      subtitle: 'ภาพบันทึกการทำงานตามสัปดาห์',
      count: `${workPhotos.length} ภาพ`,
      href: '/admin/work-photos',
      icon: Camera,
      color: 'bg-cyan-500',
      lightBg: 'bg-cyan-50 text-cyan-700',
    },
    {
      title: 'ภาพผลงาน',
      subtitle: 'ผลงานระหว่างปฏิบัติงาน/สื่อการสอน',
      count: `${workArtifacts.length} ภาพ`,
      href: '/admin/work-artifacts',
      icon: FolderGit2,
      color: 'bg-indigo-500',
      lightBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'ภาพกิจกรรม',
      subtitle: 'กิจกรรมภายในสถานศึกษา',
      count: `${activities.length} กิจกรรม`,
      href: '/admin/activities',
      icon: ImageIcon,
      color: 'bg-rose-500',
      lightBg: 'bg-rose-50 text-rose-700',
    },
    {
      title: 'วิจัยในชั้นเรียน',
      subtitle: 'งานวิจัยแก้ไขปัญหาการเรียนการสอน',
      count: `${researches.length} เรื่อง`,
      href: '/admin/classroom-research',
      icon: GraduationCap,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'ผลการประเมิน',
      subtitle: 'จากครูพี่เลี้ยง, ผู้บริหาร, คณะกรรมการ',
      count: `${evaluations.length} รายการ`,
      href: '/admin/evaluation',
      icon: Award,
      color: 'bg-cyan-500',
      lightBg: 'bg-cyan-50 text-cyan-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-nantech-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nantech-500/20 text-nantech-300 text-xs font-semibold border border-nantech-400/20">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>ระบบจัดการข้อมูลฝึกสอน (Admin SPA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            แผงควบคุมผู้ดูแลระบบ
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            จัดการข้อมูลทั้งหมด 8 เมนูหลักของเว็บไซต์ฝึกประสบการณ์สอน วิทยาลัยเทคนิคน่าน 
            พร้อมระบบแยกเมนูข้อมูลสถานศึกษาและครูแผนก IT ออกจากกัน
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              try {
                const data = await exportAllData();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'database-export.json';
                a.click();
                URL.revokeObjectURL(url);
              } catch (err) {
                alert('เกิดข้อผิดพลาดในการ Export ข้อมูล');
              }
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดไฟล์ Data (Export JSON)</span>
          </button>
          <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors shadow-sm cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>นำเข้าข้อมูล (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const parsed = JSON.parse(text);
                  await importAllData(parsed);
                  alert('นำเข้าข้อมูลสำเร็จ!');
                  refreshData();
                } catch (err) {
                  alert('ไฟล์ JSON ไม่ถูกต้อง');
                }
              }}
            />
          </label>
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตค่าเริ่มต้น (Defaults)</span>
          </button>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-nantech-600 hover:bg-nantech-500 text-white text-xs font-semibold transition-colors shadow-md shadow-nantech-900/30"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดหน้าเว็บไซต์สาธารณะ</span>
          </Link>
        </div>
      </div>

      {/* Trainee Profile Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={profile?.student_image}
            alt={profile?.student_name}
            className="w-16 h-16 rounded-2xl object-contain bg-slate-50 border-2 border-nantech-500 shadow-md"
          />
          <div>
            <div className="text-xs text-nantech-600 font-bold uppercase tracking-wider">นักศึกษาฝึกประสบการณ์สอน</div>
            <h2 className="text-lg font-bold text-slate-800">{profile?.student_name}</h2>
            <p className="text-xs text-slate-500">รหัสนักศึกษา: {profile?.student_id} • {profile?.student_major}</p>
          </div>
        </div>
        <Link
          to="/admin/profile"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-nantech-50 text-slate-700 hover:text-nantech-700 text-xs font-semibold transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          <span>แก้ไขข้อมูลโปรไฟล์</span>
        </Link>
      </div>

      {/* CRUD Management Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">เมนูจัดการข้อมูลทั้ง 8 ส่วน</h2>
          <span className="text-xs text-slate-500">คลิกที่การ์ดเพื่อเข้าสู่หน้าจัดการข้อมูล</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                to={card.href}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-nantech-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${card.lightBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 px-2.5 py-1 rounded-full bg-slate-100 group-hover:bg-nantech-100 group-hover:text-nantech-800 transition-colors">
                      {card.count}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base group-hover:text-nantech-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-nantech-600 transition-colors">
                  <span>เข้าสู่หน้าจัดการ</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
