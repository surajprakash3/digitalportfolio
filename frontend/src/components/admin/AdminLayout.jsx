import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, FolderKanban, Lightbulb, Briefcase, 
  FileText, MessageSquare, Upload, LogOut, ChevronLeft, User, Award, Globe
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Skills', path: '/admin/skills', icon: Lightbulb },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Social', path: '/admin/social', icon: Globe },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Resume', path: '/admin/resume', icon: Upload },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-dark-700">
          <NavLink to="/" className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-accent-600 transition-colors">
            <ChevronLeft size={16} /> Back to site
          </NavLink>
          <h2 className="mt-2 font-bold font-heading text-lg text-slate-900 dark:text-white">Admin Panel</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ name, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-700'
                }`
              }
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-dark-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            id="admin-logout"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-dark-900">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
