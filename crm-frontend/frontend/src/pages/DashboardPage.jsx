import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import { fetchDashboardStats } from '../api/dashboard';

function statColor(status) {
  switch (status) {
    case 'new': return 'bg-sky-100 text-sky-700';
    case 'contacted': return 'bg-amber-100 text-amber-700';
    case 'qualified': return 'bg-violet-100 text-violet-700';
    case 'converted': return 'bg-emerald-100 text-emerald-700';
    case 'lost': return 'bg-rose-100 text-rose-700';
    case 'pending': return 'bg-slate-100 text-slate-700';
    case 'in_progress': return 'bg-orange-100 text-orange-700';
    case 'completed': return 'bg-emerald-100 text-emerald-700';
    case 'cancelled': return 'bg-rose-100 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">Unable to load dashboard stats.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Overview</h1>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <Card title="Total customers" value={stats.total_customers ?? 0} />
            <Card title="Total leads" value={stats.total_leads ?? 0} />
            <Card title="Total tasks" value={stats.total_tasks ?? 0} />
            <Card title="Conversion rate" value={`${stats.conversion_rate ?? 0}%`} />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card title="Leads by status" value="">
            <div className="space-y-3">
              {Object.entries(stats.leads_by_status || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Badge className={statColor(status)}>{status}</Badge>
                    <p className="text-sm font-medium text-slate-700">{count}</p>
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${Math.min(100, (count / Math.max(1, stats.total_leads || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Tasks by status" value="">
            <div className="space-y-3">
              {Object.entries(stats.tasks_by_status || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Badge className={statColor(status)}>{status}</Badge>
                    <p className="text-sm font-medium text-slate-700">{count}</p>
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${Math.min(100, (count / Math.max(1, stats.total_tasks || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
