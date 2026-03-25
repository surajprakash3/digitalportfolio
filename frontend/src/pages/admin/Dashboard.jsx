import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Users, FolderKanban, MessageSquare, FileText, Lightbulb,
  TrendingUp, BarChart3
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { getAnalyticsSummary, getProjects, getSkills, getContacts, getAllBlogPosts } from '../../services/api';
import SEO from '../../components/SEO';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, projects, skills, contacts, posts] = await Promise.all([
          getAnalyticsSummary(30).catch(() => null),
          getProjects().catch(() => []),
          getSkills().catch(() => []),
          getContacts().catch(() => []),
          getAllBlogPosts().catch(() => []),
        ]);
        
        setAnalytics(analyticsData);
        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          messages: Array.isArray(contacts) ? contacts.length : 0,
          posts: Array.isArray(posts) ? posts.length : 0,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Page Views', value: analytics?.totalViews || 0, icon: Eye, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Unique Visitors', value: analytics?.uniqueVisitors || 0, icon: Users, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'from-accent-500 to-indigo-500', bgColor: 'bg-accent-50 dark:bg-accent-900/20' },
    { label: 'Skills', value: stats.skills, icon: Lightbulb, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Blog Posts', value: stats.posts, icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'from-rose-500 to-red-500', bgColor: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  // Chart data
  const lineChartData = {
    labels: analytics?.viewsOverTime?.map(v => {
      const d = new Date(v._id);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [{
      label: 'Page Views',
      data: analytics?.viewsOverTime?.map(v => v.count) || [],
      fill: true,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointBorderWidth: 0,
      pointRadius: 3,
      pointHoverRadius: 6,
    }],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: '#94a3b8', maxTicksLimit: 7 },
      },
      y: { 
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#94a3b8' },
        beginAtZero: true,
      },
    },
  };

  const doughnutData = {
    labels: analytics?.viewsByPage?.map(v => v._id || 'Unknown') || [],
    datasets: [{
      data: analytics?.viewsByPage?.map(v => v.count) || [],
      backgroundColor: [
        '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
        '#ec4899', '#f43f5e', '#f97316', '#eab308', 
      ],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          color: '#94a3b8', 
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard" description="Portfolio admin dashboard" />
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="text-accent-500" /> Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your portfolio analytics ({analytics?.period || 'last 30 days'})
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-5 border border-slate-200 dark:border-dark-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <card.icon size={20} className={`bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ color: card.color.includes('accent') ? '#6366f1' : undefined }} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl p-6 border border-slate-200 dark:border-dark-700 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Visitors Over Time</h3>
            <div className="h-72">
              {analytics?.viewsOverTime?.length > 0 ? (
                <Line data={lineChartData} options={lineChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  No analytics data yet. Views will appear as visitors browse the site.
                </div>
              )}
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-slate-200 dark:border-dark-700 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Page Distribution</h3>
            <div className="h-72">
              {analytics?.viewsByPage?.length > 0 ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  No page view data yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
