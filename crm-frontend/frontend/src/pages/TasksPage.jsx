import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { fetchLeads } from '../api/leads';

const initialTask = { title: '', description: '', priority: 'low', due_date: '', assigned_to: '', lead_id: '', status: 'pending' };
const priorityStyles = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-rose-100 text-rose-700',
};
const statusStyles = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-orange-100 text-orange-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState(initialTask);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [tasksResponse, leadsResponse] = await Promise.all([fetchTasks(), fetchLeads()]);
        setTasks(tasksResponse.data);
        setLeads(leadsResponse.data);
      } catch (error) {
        toast.error('Unable to load tasks or leads');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const openCreate = () => {
    setSelectedTask(null);
    setForm(initialTask);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setSelectedTask(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'low',
      due_date: task.due_date ? task.due_date.slice(0, 10) : '',
      assigned_to: task.assigned_to || '',
      lead_id: task.lead_id || '',
      status: task.status || 'pending',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, form);
        setTasks((prev) => prev.map((item) => (item.id === selectedTask.id ? { ...item, ...form } : item)));
        toast.success('Task updated');
      } else {
        const response = await createTask(form);
        setTasks((prev) => [response.data, ...prev]);
        toast.success('Task created');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Delete ${task.title}?`);
    if (!confirmed) return;

    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((item) => item.id !== task.id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete task');
    }
  };

  const sortedTasks = useMemo(
    () => tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [tasks],
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tasks</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Task board</h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Task</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Priority</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Due date</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Lead</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sortedTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 text-slate-900">{task.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${priorityStyles[task.priority] ?? 'bg-slate-100 text-slate-700'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[task.status] ?? 'bg-slate-100 text-slate-700'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(task.due_date)}</td>
                    <td className="px-6 py-4 text-slate-600">{leads.find((item) => item.id === task.lead_id)?.title || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(task)} className="rounded-2xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(task)} className="rounded-2xl bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedTasks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title={selectedTask ? 'Edit task' : 'Create task'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-3xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="rounded-3xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Priority</span>
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Due date</span>
            <input
              type="date"
              value={form.due_date}
              onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Assigned to</span>
            <input
              type="text"
              value={form.assigned_to}
              onChange={(event) => setForm((prev) => ({ ...prev, assigned_to: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Related lead</span>
            <select
              value={form.lead_id}
              onChange={(event) => setForm((prev) => ({ ...prev, lead_id: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Select lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>{lead.title}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </Modal>
    </Layout>
  );
}
