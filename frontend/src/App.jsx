import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import CustomCursor from './components/CustomCursor';
import AnimatedBackground from './components/AnimatedBackground';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import { BackgroundProvider } from './context/BackgroundContext';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Experience = lazy(() => import('./pages/Experience'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Login = lazy(() => import('./pages/Login'));
const Social = lazy(() => import('./pages/Social'));

// Admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageExperience = lazy(() => import('./pages/admin/ManageExperience'));
const ManageCertifications = lazy(() => import('./pages/admin/ManageCertifications'));
const ManageBlog = lazy(() => import('./pages/admin/ManageBlog'));
const ManageMessages = lazy(() => import('./pages/admin/ManageMessages'));
const ManageResume = lazy(() => import('./pages/admin/ManageResume'));
const ManageProfile = lazy(() => import('./pages/admin/ManageProfile'));
const ManageSocial = lazy(() => import('./pages/admin/ManageSocial'));

const AnimatedRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="certifications" element={<Certifications />} />
        <Route path="experience" element={<Experience />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="socials" element={<Social />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminRequired>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="skills" element={<ManageSkills />} />
        <Route path="experience" element={<ManageExperience />} />
        <Route path="certifications" element={<ManageCertifications />} />
        <Route path="social" element={<ManageSocial />} />
        <Route path="blog" element={<ManageBlog />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="resume" element={<ManageResume />} />
        <Route path="profile" element={<ManageProfile />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BackgroundProvider>
      <BrowserRouter>
        <CustomCursor />
        <AnimatedBackground />
        <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-dark-900">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <AnimatedRoutes />
        
        {/* Global chatbot widget */}
        <ChatBot />
      </Suspense>
    </BrowserRouter>
    </BackgroundProvider>
  );
}

export default App;
