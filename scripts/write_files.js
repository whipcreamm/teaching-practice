import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data.json', 'utf8'));

const keyToExport = {
  profile: 'initialProfile',
  school_info: 'initialSchoolInfo',
  schedule: 'initialSchedule',
  schedule_images: 'initialScheduleImages',
  lesson_plan: 'initialLessonPlans',
  teaching_log: 'initialTeachingLogs',
  work_photos: 'initialWorkPhotos',
  work_artifacts: 'initialWorkArtifacts',
  activities: 'initialActivities',
  classroom_research: 'initialClassroomResearch',
  evaluation: 'initialEvaluations',
  users: 'initialUsers'
};

let ts = `import { 
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

`;

for (const [key, exportName] of Object.entries(keyToExport)) {
  if (data[key] !== undefined) {
    ts += `export const ${exportName}: any = ${JSON.stringify(data[key], null, 2)};\n\n`;
  }
}

fs.writeFileSync('src/lib/initial-data.ts', ts, 'utf8');
console.log('Successfully baked data.json into src/lib/initial-data.ts');
