import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TeamCard from '../components/CommunicationFeed.jsx';
import ChatPanel from '../components/TeamDashboard.jsx';
import API from '../services/api.js';
import { createSocket, getSocket } from '../services/socket.js';

export default function Dashboard({ user, onLogout }) {
  const [view, setView] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // socket connection
    createSocket(user);

    async function load() {
      setLoading(true);
      try {
        const [tRes, teamRes] = await Promise.all([
          API.get('/api/tasks'), // tasks for logged in user
          API.get('/api/users')  // list of team members (manager endpoints)
        ]);
        setTasks(tRes.data || []);
        setTeam(teamRes.data || []);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    load();

    // small real-time: listen to task assignment events
    const s = getSocket();
    if (s) {
      s.on('task:assigned', (task) => {
        setTasks(prev => [task, ...prev]);
      });
      s.on('task:statusUpdated', ({ taskId, status }) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      });
    }

    return () => s?.off('task:assigned') && s?.off('task:statusUpdated');
  }, []);

  const markDone = async (taskId) => {
    try {
      await API.post(`/api/tasks/${taskId}/complete`);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} user={user} />
      <div className="flex-1 min-h-screen">
        <Navbar user={user} onLogout={onLogout} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {view === 'overview' && (
            <div className="grid grid-cols-12 gap-6">
              <section className="col-span-12 lg:col-span-8 space-y-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Assigned Tasks</h2>
                    <div className="text-sm text-slate-500">{loading ? 'Loading…' : `${tasks.length} tasks`}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map(t => <TaskCard key={t.id} task={t} onMarkDone={markDone} />)}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                  <div className="text-sm text-slate-500">Activity feed coming from backend events (task updates, uploads, annotations)</div>
                </div>
              </section>

              <aside className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Team Members</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {team.map(m => <TeamCard key={m.id} member={m} />)}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm h-96">
                  <ChatPanel user={user} />
                </div>
              </aside>
            </div>
          )}

          {view === 'tasks' && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">All Tasks</h2>
              <div className="space-y-3">
                {tasks.map(t => <TaskCard key={t.id} task={t} onMarkDone={markDone} />)}
              </div>
            </div>
          )}

          {view === 'team' && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Team Directory</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.map(m => <TeamCard key={m.id} member={m} />)}
              </div>
            </div>
          )}

          {view === 'analytics' && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Analytics (beta)</h2>
              <p className="text-sm text-slate-500">Average resolution time, tasks per tech, heatmap, and charts will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
