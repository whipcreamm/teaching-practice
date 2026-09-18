import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData } from '@/lib/data-store';
import { ProfileData, WorkPhotoItem, WorkArtifactItem } from '@/lib/types';
import { 
  Building2, 
  UserCheck, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  Award, 
  ArrowRight, 
  MapPin, 
  CheckCircle2,
  Camera,
  FolderGit2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData>(() => getStoredData<ProfileData>('profile'));
  const [photos, setPhotos] = useState<WorkPhotoItem[]>(() => getStoredData<WorkPhotoItem[]>('work_photos'));
  const [artifacts, setArtifacts] = useState<WorkArtifactItem[]>(() => getStoredData<WorkArtifactItem[]>('work_artifacts'));
  const carouselRef = useRef<HTMLDivElement>(null);
  const artifactsCarouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isArtifactsHovering, setIsArtifactsHovering] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getStoredData<ProfileData>('profile'));
      setPhotos(getStoredData<WorkPhotoItem[]>('work_photos'));
      setArtifacts(getStoredData<WorkArtifactItem[]>('work_artifacts'));
    };
    window.addEventListener('nantech_storage_update', handleUpdate);
    return () => window.removeEventListener('nantech_storage_update', handleUpdate);
  }, []);

  // Continuous auto-scroll effect for work photos
  useEffect(() => {
    if (isHovering || photos.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // If reached end, smoothly loop back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering, photos.length]);

  // Continuous auto-scroll effect for work artifacts
  useEffect(() => {
    if (isArtifactsHovering || artifacts.length === 0) return;

    const interval = setInterval(() => {
      if (artifactsCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = artifactsCarouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          artifactsCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          artifactsCarouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isArtifactsHovering, artifacts.length]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollArtifactsCarousel = (direction: 'left' | 'right') => {
    if (artifactsCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      artifactsCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white pt-16 pb-24 shadow-xl">
        {/* Layer 1 (bottom): College background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://scontent.fcnx1-1.fna.fbcdn.net/v/t39.30808-6/473381780_909900937999765_5602439034968428378_n.jpg?stp=dst-jpg_tt6&cstp=mx2957x1417&ctp=s2957x1417&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=Es_88YVTW6sQ7kNvwESjES2&_nc_oc=AdpYhIBkgXS2bLebb4T6T1mXh_qu-Fgw8IcPFqmc0BP2iTV3xu-HUCfQXWrvcSXb9dY&_nc_zt=23&_nc_ht=scontent.fcnx1-1.fna&_nc_gid=2sDp9OF7WTdTgfyKDN_JqA&_nc_ss=7b2a8&oh=00_AQJ4BNTFD9npTDMkekNbAoV4xJwySo-rK9AZGw8Vrk7Ulw&oe=6AAED22F')`,
          }}
        />

        {/* Layer 2 (top): Left solid green → right transparent gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, #064e3b 0%, #064e3b 42%, rgba(6,78,59,0.80) 60%, rgba(6,78,59,0.30) 80%, rgba(6,78,59,0.00) 100%)',
          }}
        />

        {/* Dot pattern subtle overlay on green side only */}
        <div className="absolute inset-0 z-10 opacity-5 bg-[radial-gradient(#97C459_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-nantech-400/20 border border-nantech-400/40 text-nantech-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-nantech-400" />
                <span>TANICHA SUANWONG</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                เว็บไซต์รายงาน <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nantech-300 to-emerald-200">
                  ผลปฏิบัติการฝึกประสบการณ์สอน
                </span>
              </h1>
              
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                {profile.bio || 'ระบบบันทึกและรวบรวมข้อมูลการฝึกประสบการณ์วิชาชีพครู แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคน่าน'}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/school-info"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-nantech-400 hover:bg-emerald-400 text-slate-900 font-bold text-sm shadow-lg shadow-nantech-400/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Building2 className="w-5 h-5" />
                  <span>ข้อมูลสถานศึกษา</span>
                </Link>
                <Link
                  to="/schedule"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>ดูตารางสอน</span>
                </Link>
              </div>
            </div>

            {/* Right side label (visible on large screens, overlaid on the see-through college image) */}
            {/* <div className="lg:col-span-5 hidden lg:flex items-end justify-start pb-4">
              <div className="text-white space-y-1 drop-shadow-lg">
                <p className="text-xs font-semibold text-nantech-300 uppercase tracking-wider">{profile.academic_year}</p>
                <h3 className="font-bold text-2xl drop-shadow-md">{profile.school_name}</h3>
              </div>
            </div> */}

          </div>
        </div>
      </section>


      {/* Main 3 Profiles Grid (สถานศึกษา, ครูพี่เลี้ยง, นักศึกษาฝึกสอน) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-800">ข้อมูลหลัก</h2>
          <p className="text-slate-500 text-sm mt-1">สรุปข้อมูลผู้รับผิดชอบและสถานศึกษาฝึกประสบการณ์สอน</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Card 2: ครูพี่เลี้ยง */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-100 flex flex-row items-center gap-4 sm:gap-6 hover:shadow-xl transition-all duration-300">
            <div className="w-32 sm:w-36 flex-shrink-0 relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={profile.mentor_image}
                alt={profile.mentor_name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block px-3 py-1 rounded-full bg-nantech-600 text-white text-xs font-bold mb-2">
                ครูพี่เลี้ยง
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">{profile.mentor_name}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">{profile.mentor_position}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">หัวหน้าแผนกวิชาเทคโนโลยีสารสนเทศ</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.school_name}</p>
            </div>
          </div>

          {/* Card 3: นักศึกษาฝึกสอน */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-100 flex flex-row items-center gap-4 sm:gap-6 hover:shadow-xl transition-all duration-300">
            <div className="w-32 sm:w-36 flex-shrink-0 relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={profile.student_image}
                alt={profile.student_name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block px-3 py-1 rounded-full bg-nantech-400 text-slate-900 text-xs font-bold mb-2">
                นักศึกษาฝึกสอน
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">{profile.student_name}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">นักศึกษาระดับปริญญาตรี ({profile.student_major})</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">รหัสประจำตัว : {profile.student_id}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.student_university}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Work Photos Carousel Section (แสดงต่อเนื่องจากข้อมูลครูพี่เลี้ยง/นักศึกษาฝึกสอน) */}
      {photos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">รวมภาพการปฏิบัติงาน</h2>
                <p className="text-xs text-slate-500">ประมวลภาพถ่ายการปฏิบัติการสอนและกิจกรรม ({photos.length} ภาพ)</p>
              </div>
            </div>

            {/* Carousel navigation controls (Left / Right) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
                title="เลื่อนไปทางซ้าย"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
                title="เลื่อนไปทางขวา"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Continuous Auto-Scroll Carousel */}
          <div className="relative group/carousel">
            <div
              ref={carouselRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="flex space-x-4 overflow-x-auto no-scrollbar py-2 scroll-smooth cursor-grab active:cursor-grabbing"
            >
              {photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="flex-shrink-0 w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={photo.image}
                    alt="ภาพการปฏิบัติงาน"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work Artifacts Carousel Section (ผลงานระหว่างปฏิบัติงาน) */}
      {artifacts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">ผลงานระหว่างปฏิบัติงาน</h2>
                <p className="text-xs text-slate-500">ประมวลภาพชิ้นงาน สื่อการสอน และผลงานนักเรียน/นักศึกษา ({artifacts.length} ภาพ)</p>
              </div>
            </div>

            {/* Carousel navigation controls (Left / Right) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollArtifactsCarousel('left')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
                title="เลื่อนไปทางซ้าย"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollArtifactsCarousel('right')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
                title="เลื่อนไปทางขวา"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Continuous Auto-Scroll Carousel */}
          <div className="relative group/carousel">
            <div
              ref={artifactsCarouselRef}
              onMouseEnter={() => setIsArtifactsHovering(true)}
              onMouseLeave={() => setIsArtifactsHovering(false)}
              className="flex space-x-4 overflow-x-auto no-scrollbar py-2 scroll-smooth cursor-grab active:cursor-grabbing"
            >
              {artifacts.map((artifact, idx) => (
                <div
                  key={artifact.id || idx}
                  className="flex-shrink-0 w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={artifact.image}
                    alt="ผลงานระหว่างปฏิบัติงาน"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
