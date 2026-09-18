import { 
  DatabaseTab, 
  ProfileData, 
  SchoolInfoData, 
  TeacherMember,
  ScheduleItem, 
  LessonPlanItem, 
  TeachingLogItem, 
  ActivityItem, 
  ClassroomResearchItem, 
  EvaluationItem, 
  UserItem 
} from './types';
import { 
  initialProfile, 
  initialSchoolInfo, 
  initialSchedule, 
  initialLessonPlans, 
  initialTeachingLogs, 
  initialActivities, 
  initialClassroomResearch, 
  initialEvaluations, 
  initialUsers,
  initialWorkPhotos,
  initialWorkArtifacts,
  initialScheduleImages
} from './initial-data';
import { idbGet, idbSet, idbGetAll } from './idb';

const STORAGE_PREFIX = 'nantech_data_';

const defaultData: Record<DatabaseTab, any> = {
  profile: initialProfile,
  school_info: initialSchoolInfo,
  it_teachers: initialSchoolInfo.it_teachers || [],
  schedule: initialSchedule,
  lesson_plan: initialLessonPlans,
  teaching_log: initialTeachingLogs,
  activities: initialActivities,
  classroom_research: initialClassroomResearch,
  evaluation: initialEvaluations,
  users: initialUsers,
  work_photos: initialWorkPhotos,
  work_artifacts: initialWorkArtifacts,
  schedule_images: initialScheduleImages,
};

// In-memory cache for ultra-fast, synchronous access across components
const memoryStore: Partial<Record<DatabaseTab, any>> = {};

// Background sync from IndexedDB on startup
if (typeof window !== 'undefined') {
  idbGetAll().then((idbData) => {
    let hasChanges = false;
    for (const [key, value] of Object.entries(idbData)) {
      if (value !== undefined && value !== null) {
        memoryStore[key as DatabaseTab] = value;
        hasChanges = true;
      }
    }
    if (hasChanges) {
      window.dispatchEvent(new Event('nantech_storage_update'));
    }
  }).catch((err) => {
    console.warn('[data-store] IndexedDB init error:', err);
  });

  // Cross-tab broadcast & storage sync listener
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
      const tab = e.key.replace(STORAGE_PREFIX, '') as DatabaseTab;
      try {
        if (e.newValue) {
          memoryStore[tab] = JSON.parse(e.newValue);
        }
      } catch (err) {}
      window.dispatchEvent(new Event('nantech_storage_update'));
    }
  });
}

// Retrieve data for a tab synchronously
export function getStoredData<T = any>(tab: DatabaseTab): T {
  // 1. Check memory cache first
  if (memoryStore[tab] !== undefined) {
    return memoryStore[tab] as T;
  }

  if (typeof window === 'undefined') {
    return defaultData[tab] as T;
  }

  // 2. Check localStorage
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + tab);
    if (raw) {
      const parsed = JSON.parse(raw) as T;
      memoryStore[tab] = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn(`Error reading ${tab} from localStorage:`, err);
  }

  // 3. Fallback to default
  memoryStore[tab] = defaultData[tab];
  // Fire async idb check in case localStorage was cleared but idb has it
  idbGet(tab).then((val) => {
    if (val !== null && val !== undefined) {
      memoryStore[tab] = val;
      window.dispatchEvent(new Event('nantech_storage_update'));
    }
  });

  return defaultData[tab] as T;
}

// Update data for a tab (saves to Memory, IndexedDB, and LocalStorage)
export function setStoredData(tab: DatabaseTab, data: any): void {
  // 1. Immediate memory store update
  memoryStore[tab] = data;

  if (typeof window === 'undefined') return;

  // 2. Save to IndexedDB (Unlimited capacity, never hits 5MB quota!)
  idbSet(tab, data).catch((err) => {
    console.error(`[idbSet] Failed to save ${tab} to IndexedDB:`, err);
  });

  // 3. Save to localStorage as best-effort cache
  try {
    localStorage.setItem(STORAGE_PREFIX + tab, JSON.stringify(data));
  } catch (err) {
    console.warn(`[setStoredData] LocalStorage quota exceeded for ${tab}, safely saved to IndexedDB instead.`, err);
  }

  // Keep it_teachers and school_info.it_teachers synchronized
  if (tab === 'it_teachers' && Array.isArray(data)) {
    try {
      const currentSchool = memoryStore['school_info'] || getStoredData<SchoolInfoData>('school_info');
      const updatedSchool = { ...currentSchool, it_teachers: data };
      memoryStore['school_info'] = updatedSchool;
      idbSet('school_info', updatedSchool);
      try {
        localStorage.setItem(STORAGE_PREFIX + 'school_info', JSON.stringify(updatedSchool));
      } catch (e) {
        // Safe to ignore localStorage quota since IndexedDB has it
      }
    } catch (e) {
      console.warn('Sync it_teachers to school_info failed:', e);
    }
  }

  if (tab === 'school_info' && typeof data === 'object' && data !== null) {
    try {
      const teachers = memoryStore['it_teachers'] || getStoredData('it_teachers');
      if (teachers && Array.isArray(teachers)) {
        data.it_teachers = teachers;
      }
    } catch (e) {
      console.warn('Sync school_info teachers failed:', e);
    }
  }

  // 4. Trigger local storage event for reactive updates across all components
  window.dispatchEvent(new Event('nantech_storage_update'));
}

// Reset all data back to initial defaults
export function resetAllData(): void {
  Object.keys(defaultData).forEach((tab) => {
    setStoredData(tab as DatabaseTab, defaultData[tab as DatabaseTab]);
  });
}

// Authentication Session Management
const AUTH_KEY = 'nantech_admin_session';

export function getAdminSession(): UserItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(user: UserItem): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('nantech_auth_change'));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('nantech_auth_change'));
}
