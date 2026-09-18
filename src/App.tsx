import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '@/components/PublicLayout';
import AdminLayout from '@/components/AdminLayout';

// Public Pages
import HomePage from '@/components/HomePage';
import SchoolInfoPage from '@/components/SchoolInfoPage';
import SchedulePage from '@/components/SchedulePage';
import LessonPlanPage from '@/components/LessonPlanPage';
import TeachingLogPage from '@/components/TeachingLogPage';
import ActivitiesPage from '@/components/ActivitiesPage';
import ClassroomResearchPage from '@/components/ClassroomResearchPage';
import EvaluationPage from '@/components/EvaluationPage';

// Admin Core Pages
import AdminLoginPage from '@/components/AdminLoginPage';
import AdminDashboard from '@/components/AdminDashboard';

// Modular Admin Components (src/admin/)
import AdminProfile from '@/admin/AdminProfile';
import AdminSchoolInfo from '@/admin/AdminSchoolInfo';
import AdminTeachers from '@/admin/AdminTeachers';
import AdminSchedule from '@/admin/AdminSchedule';
import AdminLessonPlan from '@/admin/AdminLessonPlan';
import AdminTeachingLog from '@/admin/AdminTeachingLog';
import AdminWorkPhotos from '@/admin/AdminWorkPhotos';
import AdminWorkArtifacts from '@/admin/AdminWorkArtifacts';
import AdminActivities from '@/admin/AdminActivities';
import AdminClassroomResearch from '@/admin/AdminClassroomResearch';
import AdminEvaluation from '@/admin/AdminEvaluation';
import AdminUsers from '@/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="school-info" element={<SchoolInfoPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="lesson-plan" element={<LessonPlanPage />} />
          <Route path="teaching-log" element={<TeachingLogPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="classroom-research" element={<ClassroomResearchPage />} />
          <Route path="evaluation" element={<EvaluationPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Dedicated Clean Admin Routes */}
          <Route path="profile" element={<AdminProfile />} />
          <Route path="school-info" element={<AdminSchoolInfo />} />
          <Route path="it-teachers" element={<AdminTeachers />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="lesson-plan" element={<AdminLessonPlan />} />
          <Route path="teaching-log" element={<AdminTeachingLog />} />
          <Route path="work-photos" element={<AdminWorkPhotos />} />
          <Route path="work-artifacts" element={<AdminWorkArtifacts />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="classroom-research" element={<AdminClassroomResearch />} />
          <Route path="evaluation" element={<AdminEvaluation />} />
          <Route path="users" element={<AdminUsers />} />

          {/* Legacy Redirects for backwards compatibility */}
          <Route path="manage/profile" element={<Navigate to="/admin/profile" replace />} />
          <Route path="manage/school_info" element={<Navigate to="/admin/school-info" replace />} />
          <Route path="manage/it_teachers" element={<Navigate to="/admin/it-teachers" replace />} />
          <Route path="manage/schedule" element={<Navigate to="/admin/schedule" replace />} />
          <Route path="manage/lesson_plan" element={<Navigate to="/admin/lesson-plan" replace />} />
          <Route path="manage/teaching_log" element={<Navigate to="/admin/teaching-log" replace />} />
          <Route path="manage/activities" element={<Navigate to="/admin/activities" replace />} />
          <Route path="manage/classroom_research" element={<Navigate to="/admin/classroom-research" replace />} />
          <Route path="manage/evaluation" element={<Navigate to="/admin/evaluation" replace />} />
          <Route path="manage/users" element={<Navigate to="/admin/users" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
