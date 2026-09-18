import React from 'react';
import { Building2, Heart, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-nantech-600 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">วิทยาลัยเทคนิคน่าน</h3>
                <p className="text-xs text-slate-400">สำนักงานคณะกรรมการการอาชีวศึกษา</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ระบบบันทึกข้อมูลการฝึกประสบการณ์สอน<br />
              แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคน่าน
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm mb-3">ปรัชญาและวิสัยทัศน์</h4>
            <p className="text-xs text-slate-400 italic">"วิชาชีพยอดเยี่ยม สูงเปี่ยมคุณธรรม เลิศล้ำการกีฬา ก้าวหน้าการจัดการ"</p>
            <div className="flex items-center space-x-2 text-xs text-nantech-400 pt-2">
              <GraduationCap className="w-4 h-4" />
              <span>การฝึกประสบการณ์วิชาชีพครูประจำปีการศึกษา 2569</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <h4 className="text-white font-semibold text-sm mb-3">ที่อยู่และการติดต่อ</h4>
            <p>เลขที่ 2 ถนนรอบกำแพงเมืองทิศตะวันตก ตำบลในเวียง อำเภอเมืองน่าน จังหวัดน่าน 55000</p>
            <p>แผนกวิชาเทคโนโลยีสารสนเทศ</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2025 Department of Computer Education (KMUTNB) - TANICHA SUANWONG</p>
          {/* <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>พัฒนาด้วยความประณีต</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>สำหรับโครงการฝึกประสบการณ์สอน</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
