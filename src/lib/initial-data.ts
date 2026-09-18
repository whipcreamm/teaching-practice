import { 
  ProfileData, 
  SchoolInfoData, 
  ScheduleItem, 
  ScheduleImagesData,
  LessonPlanItem, 
  TeachingLogItem, 
  WorkPhotoItem,
  WorkArtifactItem,
  ActivityItem, 
  ClassroomResearchItem, 
  EvaluationItem, 
  UserItem 
} from './types';

export const initialProfile: ProfileData = {
  id: 'prof-1',
  school_name: 'วิทยาลัยเทคนิคน่าน',
  school_address: 'เลขที่ 1 ถนนสุมนเทวราช ตำบลในเวียง อำเภอเมืองน่าน จังหวัดน่าน 55000',
  mentor_name: 'อาจารย์สมศักดิ์ ปัญญาวิเศษ',
  mentor_position: 'ครูชำนาญการพิเศษ หัวหน้าแผนกวิชาเทคโนโลยีสารสนเทศ',
  mentor_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  student_name: 'นายณัฐพงษ์ วงศ์น่าน',
  student_id: '64309010001',
  student_major: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
  student_university: 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา',
  student_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
  academic_year: '2569 (ปีการศึกษา 2569)',
  cover_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
  bio: 'พอร์ตฟอลิโอบันทึกและรวบรวมข้อมูลการฝึกประสบการณ์วิชาชีพครู ณ แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคน่าน ทั้งการจัดทำแผนการสอน บันทึกหลังการสอน วิจัยในชั้นเรียน และการร่วมกิจกรรมสถานศึกษา',
};

export const initialSchoolInfo: SchoolInfoData = {
  history: `วิทยาลัยเทคนิคน่าน ตั้งขึ้นเมื่อวันที่ 12 พฤษภาคม พ.ศ. 2481 เดิมชื่อ "โรงเรียนช่างไม้ น่าน" ตั้งอยู่ ณ ตำบลในเวียง อำเภอเมืองน่าน จังหวัดน่าน ต่อมาได้มีการพัฒนาและขยายการจัดการศึกษาสาขาวิชาต่างๆ จนได้รับยกระดับเป็น "วิทยาลัยเทคนิคน่าน" สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา กระทรวงศึกษาธิการ

ปัจจุบันจัดการศึกษาในระดับ ปวช., ปวส. และปริญญาตรีสายเทคโนโลยีหรือสายปฏิบัติการ มุ่งเน้นการผลิตและพัฒนากำลังคนด้านวิชาชีพให้มีความรู้ ความสามารถ ทักษะฝีมือ และคุณธรรมจริยธรรม ตอบสนองความต้องการของตลาดแรงงานและการพัฒนาประเทศ`,
  philosophy: 'ทักษะเยี่ยม เปี่ยมคุณธรรม นำเทคโนโลยี พัฒนาสังคม',
  vision: 'เป็นสถานศึกษาอาชีวศึกษาชั้นนำที่ผลิตกำลังคนอาชีวศึกษาสมรรถนะสูง ด้วยเทคโนโลยีและนวัตกรรมเพื่อการพัฒนาที่ยั่งยืน',
  executives: [
    {
      id: 'exec-1',
      name: 'นายชลทิตย์ ชัยราช',
      position: 'ผู้อำนวยการวิทยาลัยเทคนิคน่าน',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      order_num: 1,
    },
    {
      id: 'exec-2',
      name: 'นายสุรชัย คำนวณ',
      position: 'รองผู้อำนวยการฝ่ายวิชาการ',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
      order_num: 2,
    },
    {
      id: 'exec-3',
      name: 'นางสาวจิราพร วงศ์ชัย',
      position: 'รองผู้อำนวยการฝ่ายแผนงานและความร่วมมือ',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
      order_num: 3,
    },
    {
      id: 'exec-4',
      name: 'นายพงษ์ศักดิ์ นันตา',
      position: 'รองผู้อำนวยการฝ่ายพัฒนากิจการนักเรียนนักศึกษา',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
      order_num: 4,
    },
  ],
  it_teachers: [
    {
      id: 't-1',
      name: 'อาจารย์สมศักดิ์ ปัญญาวิเศษ',
      position: 'หัวหน้าแผนกวิชาเทคโนโลยีสารสนเทศ',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน ระบบเครือข่ายคอมพิวเตอร์ และ Cloud Computing',
      order_num: 1,
    },
    {
      id: 't-2',
      name: 'อาจารย์วิภาดา สุขใจ',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน การพัฒนาเว็บแอปพลิเคชัน และ UX/UI Design',
      order_num: 2,
    },
    {
      id: 't-3',
      name: 'อาจารย์ธนกร สุวรรณโณ',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน Database Management & SQL',
      order_num: 3,
    },
    {
      id: 't-4',
      name: 'อาจารย์นภาวรรณ นันทกา',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน การเขียนโปรแกรมภาษา Python & AI Basics',
      order_num: 4,
    },
    {
      id: 't-5',
      name: 'อาจารย์อนุชา ไชยสิทธิ์',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน Cybersecurity & System Administration',
      order_num: 5,
    },
    {
      id: 't-6',
      name: 'อาจารย์ปรียาภรณ์ ชัยชนะ',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน Multimedia & Graphic Design',
      order_num: 6,
    },
    {
      id: 't-7',
      name: 'อาจารย์กิตติศักดิ์ คำเมือง',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน Mobile Application Development (Flutter/React Native)',
      order_num: 7,
    },
    {
      id: 't-8',
      name: 'อาจารย์รัตนาวดี ใจดี',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน ระบบคอมพิวเตอร์และฮาร์ดแวร์ IoT',
      order_num: 8,
    },
    {
      id: 't-9',
      name: 'อาจารย์พิชญะ จิตสงบ',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน Data Analytics & E-Commerce Systems',
      order_num: 9,
    },
    {
      id: 't-10',
      name: 'อาจารย์ศิริพร บุญช่วย',
      position: 'ครูประจำแผนก IT',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      bio: 'เชี่ยวชาญด้าน เทคโนโลยีคอมพิวเตอร์เบื้องต้น และโครงสร้างข้อมูล',
      order_num: 10,
    },
  ],
};

export const initialScheduleImages: ScheduleImagesData = {
  term1_image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600&auto=format&fit=crop&q=80',
  term2_image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600&auto=format&fit=crop&q=80',
};

export const initialSchedule: ScheduleItem[] = [
  // ภาคเรียนที่ 1
  {
    id: 'sch-1',
    term: 'term1',
    day: 'วันจันทร์',
    time: '08:30 - 12:30',
    subject_code: '30901-1002',
    subject_name: 'การพัฒนาเว็บแอปพลิเคชัน',
    level: 'ปวส.1 เทคโนโลยีสารสนเทศ',
    room: 'ห้องปฏิบัติการคอมพิวเตอร์ 432',
    doc_link: 'https://drive.google.com',
  },
  {
    id: 'sch-2',
    term: 'term1',
    day: 'วันอังคาร',
    time: '13:00 - 16:00',
    subject_code: '20901-1001',
    subject_name: 'ระบบการจัดการฐานข้อมูล',
    level: 'ปวช.2 เทคโนโลยีสารสนเทศ',
    room: 'ห้องปฏิบัติการคอมพิวเตอร์ 434',
    doc_link: 'https://drive.google.com',
  },
  {
    id: 'sch-3',
    term: 'term1',
    day: 'วันพุธ',
    time: '09:00 - 12:00',
    subject_code: '30901-2001',
    subject_name: 'การวิเคราะห์และออกแบบระบบ',
    level: 'ปวส.2 เทคโนโลยีสารสนเทศ',
    room: 'ห้องบรรยาย 431',
    doc_link: 'https://drive.google.com',
  },
  {
    id: 'sch-4',
    term: 'term1',
    day: 'วันพฤหัสบดี',
    time: '13:00 - 17:00',
    subject_code: '20901-2005',
    subject_name: 'การเขียนโปรแกรมภาษาคอมพิวเตอร์',
    level: 'ปวช.1 เทคโนโลยีสารสนเทศ',
    room: 'ห้องปฏิบัติการ 433',
    doc_link: 'https://drive.google.com',
  },
  // ภาคเรียนที่ 2
  {
    id: 'sch-5',
    term: 'term2',
    day: 'วันจันทร์',
    time: '08:30 - 12:30',
    subject_code: '30901-2104',
    subject_name: 'โครงการเทคโนโลยีสารสนเทศ (Project)',
    level: 'ปวส.2 เทคโนโลยีสารสนเทศ',
    room: 'ห้องปฏิบัติการวิจัย IT',
    doc_link: 'https://drive.google.com',
  },
  {
    id: 'sch-6',
    term: 'term2',
    day: 'วันพุธ',
    time: '13:00 - 17:00',
    subject_code: '20901-2102',
    subject_name: 'เครือข่ายคอมพิวเตอร์เบื้องต้น',
    level: 'ปวช.2 เทคโนโลยีสารสนเทศ',
    room: 'ห้องปฏิบัติการเครือข่าย 435',
    doc_link: 'https://drive.google.com',
  },
  {
    id: 'sch-7',
    term: 'term2',
    day: 'วันศุกร์',
    time: '08:30 - 11:30',
    subject_code: '30901-1005',
    subject_name: 'ความปลอดภัยในระบบสารสนเทศ',
    level: 'ปวส.1 เทคโนโลยีสารสนเทศ',
    room: 'ห้องบรรยาย 431',
    doc_link: 'https://drive.google.com',
  },
];

export const initialLessonPlans: LessonPlanItem[] = [
  // ภาคเรียนที่ 1
  {
    id: 'plan-1',
    term: 'term1',
    unit_no: 1,
    unit_name: 'ความรู้เบื้องต้นเกี่ยวกับการพัฒนาเว็บและ HTML5/CSS3',
    hours: 8,
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'ศึกษาโครงสร้างเว็บภาษา HTML5 การจัดสไตล์ด้วย CSS3 และการออกแบบ Responsive Design',
  },
  {
    id: 'plan-2',
    term: 'term1',
    unit_no: 2,
    unit_name: 'การเขียนโปรแกรมเชิงโต้ตอบด้วย JavaScript (ES6+)',
    hours: 12,
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'ศึกษาตัวแปร ฟังก์ชัน Async/Await DOM Manipulation และการรับส่งข้อมูลผ่าน Fetch API',
  },
  {
    id: 'plan-3',
    term: 'term1',
    unit_no: 3,
    unit_name: 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่ด้วย React และ Next.js',
    hours: 16,
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'โครงสร้าง Component, React Hooks, State Management, App Router และ Server Side Rendering',
  },
  // ภาคเรียนที่ 2
  {
    id: 'plan-4',
    term: 'term2',
    unit_no: 1,
    unit_name: 'การออกแบบและบริหารจัดการฐานข้อมูลด้วย SQL & Google Sheets API',
    hours: 12,
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'การออกแบบ Relational Schema, การสร้าง RESTful API เพื่อเชื่อมต่อกับ Database และ Caching Layer',
  },
  {
    id: 'plan-5',
    term: 'term2',
    unit_no: 2,
    unit_name: 'การพัฒนาระบบหลังบ้าน Admin Dashboard และระบบยืนยันตัวตน (Authentication)',
    hours: 16,
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'การสร้าง Admin CRUD Forms, JWT Authentication, Cookie Session management และ Security Practices',
  },
];

export const initialTeachingLogs: TeachingLogItem[] = [
  // สัปดาห์ที่ 1
  {
    id: 'log-w1-1',
    week: 1,
    date: '6/5/2568',
    work: 'ประชุมแผนกวิชาเตรียมความพร้อมก่อนเปิดภาคเรียน, เลือกวิชาสอน',
    note: '',
  },
  {
    id: 'log-w1-2',
    week: 1,
    date: '7/5/2568',
    work: 'รับลงทะเบียนนักเรียน/นักศึกษาใหม่ในกิจกรรมปฐมนิเทศและเข้าค่ายคุณธรรม',
    note: '',
  },
  {
    id: 'log-w1-3',
    week: 1,
    date: '8/5/2568',
    work: 'ดูแลนักเรียน ปวช.1 และ ปวส.1 ในกิจกรรมเข้าค่ายคุณธรรม',
    note: '',
  },
  {
    id: 'log-w1-4',
    week: 1,
    date: '9/5/2568',
    work: 'จัดเตรียมห้องคอมพิวเตอร์-เช็คเครื่องคอม',
    note: '',
  },
  // สัปดาห์ที่ 2
  {
    id: 'log-w2-1',
    week: 2,
    date: '12/5/2568',
    work: 'เปิดภาคเรียนสัปดาห์แรก ปฐมนิเทศรายวิชาการเขียนโปรแกรมบนเว็บ ปวช.2',
    note: 'ห้อง 522',
  },
  {
    id: 'log-w2-2',
    week: 2,
    date: '13/5/2568',
    work: 'สอนวิชาการพัฒนาเว็บแอปพลิเคชัน ปวส.1 เรื่องโครงสร้าง HTML5 Semantic Elements',
    note: '',
  },
  {
    id: 'log-w2-3',
    week: 2,
    date: '14/5/2568',
    work: 'ปฏิบัติหน้าที่เวรประจำวันหน้าประตูวิทยาลัย และตรวจแถวนักศึกษา',
    note: 'เวรเช้า 07.20 น.',
  },
  {
    id: 'log-w2-4',
    week: 2,
    date: '15/5/2568',
    work: 'สอนวิชาระบบเครือข่ายคอมพิวเตอร์ ปวช.3 เรื่องการเข้าหัวสาย LAN (RJ-45)',
    note: 'ปฏิบัติการสาย UTP',
  },
  // สัปดาห์ที่ 3
  {
    id: 'log-w3-1',
    week: 3,
    date: '19/5/2568',
    work: 'สอนการออกแบบ CSS Flexbox & CSS Grid ให้กับนักศึกษา ปวช.2',
    note: '',
  },
  {
    id: 'log-w3-2',
    week: 3,
    date: '20/5/2568',
    work: 'ช่วยงานแผนกวิชาจัดทำเอกสารตรวจสอบครุภัณฑ์คอมพิวเตอร์ประจำปีการศึกษา',
    note: '',
  },
];

export const initialWorkPhotos: WorkPhotoItem[] = [
  {
    id: 'wp-1',
    week: 1,
    title: 'ประชุมแผนกวิชาเตรียมความพร้อมก่อนเปิดภาคเรียน และจัดเตรียมห้องปฏิบัติการคอมพิวเตอร์',
    date: '6 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wp-2',
    week: 1,
    title: 'กิจกรรมปฐมนิเทศนักศึกษาใหม่และเข้าค่ายคุณธรรมจริยธรรม',
    date: '7 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wp-3',
    week: 2,
    title: 'การจัดกิจกรรมการเรียนรู้ในห้องปฏิบัติการคอมพิวเตอร์ แผนกวิชา IT',
    date: '13 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wp-4',
    week: 2,
    title: 'การปฏิบัติการเข้าหัวสายสัญญาณ UTP และตรวจเช็คระบบเครือข่าย',
    date: '15 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
  },
];

export const initialWorkArtifacts: WorkArtifactItem[] = [
  {
    id: 'wa-1',
    week: 1,
    title: 'ใบงานและผลงานการออกแบบ Wireframe เว็บไซต์ของนักศึกษา ปวช.2',
    date: '8 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wa-2',
    week: 2,
    title: 'ชิ้นงานทดสอบการเข้าหัวสายสัญญาณ RJ-45 มาตรฐาน TIA/EIA-568B',
    date: '15 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wa-3',
    week: 3,
    title: 'ผลงานการพัฒนาเว็บแอปพลิเคชัน Portfolio ด้วย HTML/CSS ของนักศึกษา',
    date: '22 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wa-4',
    week: 4,
    title: 'สื่อการจัดการเรียนรู้มัลติมีเดียและใบความรู้เรื่องระบบคอมพิวเตอร์',
    date: '29 พ.ค. 2568',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  },
];

export const initialActivities: ActivityItem[] = [
  // ภาคเรียนที่ 1
  {
    id: 'act-1',
    term: 'term1',
    title: 'โครงการอบรมเชิงปฏิบัติการ "การพัฒนาเว็บแอปพลิเคชันด้วย Next.js และ Tailwind CSS"',
    date: '2026-07-15',
    location: 'หอประชุมใหญ่ วิทยาลัยเทคนิคน่าน',
    description: 'จัดกิจกรรมอบรมเชิงปฏิบัติการให้กับนักศึกษาสาขาเทคโนโลยีสารสนเทศ เพื่อเพิ่มทักษะด้านการสร้างเว็บแอปพลิเคชันสมัยใหม่และดีไซน์ UI/UX',
    images: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'act-2',
    term: 'term1',
    title: 'กิจกรรมไหว้ครูประจำปีการศึกษา 2569 วิทยาลัยเทคนิคน่าน',
    date: '2026-06-18',
    location: 'อาคารอเนกประสงค์ วิทยาลัยเทคนิคน่าน',
    description: 'ร่วมพิธีไหว้ครู แสดงความเคารพต่อครูอาจารย์ผู้ประสิทธิ์ประสาทวิชาความรู้ และควบคุมดูแลนักศึกษาเข้าร่วมพิธีอย่างเรียบร้อย',
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80'
    ]
  },
  // ภาคเรียนที่ 2
  {
    id: 'act-3',
    term: 'term2',
    title: 'การประกวดนวัตกรรมและสิ่งประดิษฐ์ของคนรุ่นใหม่ อาชีวศึกษาจังหวัดน่าน',
    date: '2026-12-05',
    location: 'วิทยาลัยเทคนิคน่าน',
    description: 'เป็นอาจารย์ที่ปรึกษาร่วม นำผลงานระบบฝึกประสบการณ์สอนออนไลน์ของนักศึกษาร่วมประกวดสิ่งประดิษฐ์ด้านซอฟต์แวร์',
    images: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export const initialClassroomResearch: ClassroomResearchItem[] = [
  {
    id: 'res-1',
    title: 'การพัฒนาผลสัมฤทธิ์ทางการเรียนวิชาการพัฒนาเว็บแอปพลิเคชัน โดยใช้การเรียนรู้แบบโครงงานเป็นฐาน (Project-Based Learning) ร่วมกับระบบบริหารจัดการเนื้อหาฝึกประสบการณ์สอน',
    abstract: 'การวิจัยครั้งนี้มีวัตถุประสงค์เพื่อ 1) พัฒนาระบบบริหารจัดการเนื้อหาฝึกประสบการณ์สอนสำหรับแผนกวิชาเทคโนโลยีสารสนเทศ 2) เปรียบเทียบผลสัมฤทธิ์ทางการเรียนของนักศึกษาก่อนและหลังเรียนด้วยการเรียนรู้แบบโครงงานเป็นฐาน ผลการวิจัยพบว่าผลสัมฤทธิ์ทางการเรียนหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .01 และความพึงพอใจของนักศึกษาอยู่ในระดับดีมาก',
    target_group: 'นักศึกษาระดับชั้น ปวส.1 สาขาวิชาเทคโนโลยีสารสนเทศ จำนวน 32 คน',
    result: 'นักศึกษามีคะแนนเฉลี่ยหลังเรียนคิดเป็นร้อยละ 84.50 ซึ่งสูงกว่าเกณฑ์ที่กำหนดไว้ (ร้อยละ 75) และรายงานความพึงพอใจเฉลี่ย 4.68 จาก 5.00',
    file_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    year: '2569',
  }
];

export const initialEvaluations: EvaluationItem[] = [
  {
    id: 'eval-1',
    evaluator_type: 'mentor',
    evaluator_name: 'อาจารย์สมศักดิ์ ปัญญาวิเศษ (ครูพี่เลี้ยง)',
    title: 'การเตรียมการสอนและเทคนิคการจัดการเรียนรู้',
    score: 95,
    max_score: 100,
    comment: 'นักศึกษามีความตั้งใจสูง เตรียมสื่อการสอนได้น่าสนใจ มีความเชี่ยวชาญด้านเทคโนโลยี modern web สามารถแก้ไขปัญหาเฉพาะหน้าในชั้นเรียนได้เป็นอย่างดี',
    date: '2026-09-01',
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'eval-2',
    evaluator_type: 'executive',
    evaluator_name: 'นายสุรชัย คำนวณ (รองผู้อำนวยการฝ่ายวิชาการ)',
    title: 'บุคลิกภาพ จรรยาบรรณวิชาชีพครู และมนุษยสัมพันธ์',
    score: 98,
    max_score: 100,
    comment: 'แต่งกายสุภาพเรียบร้อยตรงตามระเบียบ มาปฏิบัติงานตรงเวลาเสมอ ร่วมมือกับกิจกรรมของวิทยาลัยด้วยความเต็มใจ',
    date: '2026-09-05',
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'eval-3',
    evaluator_type: 'committee',
    evaluator_name: 'คณะกรรมการประเมินการฝึกประสบการณ์สอน สถานศึกษา',
    title: 'การจัดทำเอกสาร แผนการจัดการเรียนรู้ และวิจัยในชั้นเรียน',
    score: 94,
    max_score: 100,
    comment: 'จัดทำแผนการสอนครอบคลุมตามจุดประสงค์รายวิชา มีบันทึกหลังการสอนละเอียด และมีผลงานวิจัยในชั้นเรียนที่นำไปปรับใช้ได้จริง',
    date: '2026-09-10',
    pdf_link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
];

export const initialUsers: UserItem[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password_hash: '$2a$10$iK7eD0bM5y4U8H1.g6S5u.Vv1Wf4tZ8P6bE2M9L4y1Z3X5Y7W8Z9O', // admin123 hash or direct bcrypt comparison
    name: 'ผู้ดูแลระบบ (Admin IT)',
    role: 'admin',
  },
  {
    id: 'usr-2',
    username: 'mentor',
    password_hash: '$2a$10$iK7eD0bM5y4U8H1.g6S5u.Vv1Wf4tZ8P6bE2M9L4y1Z3X5Y7W8Z9O',
    name: 'อาจารย์สมศักดิ์ ปัญญาวิเศษ',
    role: 'mentor',
  },
  {
    id: 'usr-3',
    username: 'student',
    password_hash: '$2a$10$iK7eD0bM5y4U8H1.g6S5u.Vv1Wf4tZ8P6bE2M9L4y1Z3X5Y7W8Z9O',
    name: 'นายณัฐพงษ์ วงศ์น่าน',
    role: 'student',
  },
];
