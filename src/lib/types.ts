export type TermType = 'term1' | 'term2';
export type EvaluatorType = 'mentor' | 'executive' | 'committee';
export type UserRole = 'admin' | 'mentor' | 'executive' | 'student';

export interface ProfileData {
  id: string;
  school_name: string;
  school_address: string;
  mentor_name: string;
  mentor_position: string;
  mentor_image: string;
  student_name: string;
  student_id: string;
  student_major: string;
  student_university: string;
  student_image: string;
  academic_year: string;
  cover_image: string;
  bio: string;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  position: string;
  image: string;
  order_num: number;
}

export interface TeacherMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  order_num: number;
}

export interface SchoolInfoData {
  history: string;
  philosophy: string;
  vision: string;
  executives: ExecutiveMember[];
  it_teachers: TeacherMember[];
}

export interface ScheduleImagesData {
  term1_image: string;
  term2_image: string;
}

export interface ScheduleItem {
  id: string;
  term: TermType;
  subject_code: string;
  subject_name: string;
  day?: string;
  time?: string;
  level?: string;
  room?: string;
  doc_link?: string;
}

export interface LessonPlanItem {
  id: string;
  term: TermType;
  unit_no: number;
  unit_name: string;
  hours: number;
  pdf_link: string;
  description: string;
}

export interface TeachingLogItem {
  id: string;
  term?: TermType;
  week: number;
  date: string;
  work: string;
  note?: string;
  topic?: string;
  summary?: string;
  problems?: string;
  solutions?: string;
  status?: string;
}

export interface WorkPhotoItem {
  id: string;
  week?: number;
  title: string;
  date?: string;
  image: string;
}

export interface WorkArtifactItem {
  id: string;
  week?: number;
  title: string;
  date?: string;
  image: string;
}

export interface ActivityItem {
  id: string;
  term: TermType;
  title: string;
  date: string;
  location: string;
  description: string;
  images: string[];
}

export interface ClassroomResearchItem {
  id: string;
  title: string;
  abstract: string;
  target_group: string;
  result: string;
  file_link: string;
  year: string;
}

export interface EvaluationItem {
  id: string;
  evaluator_type: EvaluatorType;
  evaluator_name: string;
  title: string;
  score: number;
  max_score: number;
  comment: string;
  date: string;
  pdf_link?: string;
}

export interface UserItem {
  id: string;
  username: string;
  password?: string;
  password_hash?: string;
  name: string;
  role: UserRole;
}

export type DatabaseTab = 
  | 'profile'
  | 'school_info'
  | 'it_teachers'
  | 'schedule'
  | 'lesson_plan'
  | 'teaching_log'
  | 'activities'
  | 'classroom_research'
  | 'evaluation'
  | 'users'
  | 'work_photos'
  | 'work_artifacts'
  | 'schedule_images';

