import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { fetchLeads, createLead, updateLead, deleteLead } from '../api/leads';
import { fetchCustomers } from '../api/customers';

const initialLead = { title: '', description: '', source: '', estimated_value: '', customer_id: '', assigned_to: '', status: 'new' };
const statusStyles = {
  new: 'bg-sky-100 text-sky-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-violet-100 text-violet-700',
  converted: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [form, setForm] = useState(initialLead);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [leadsResponse, customersResponse] = await Promise.all([fetchLeads(), fetchCustomers()]);
        setLeads(leadsResponse.data);
        setCustomers(customersResponse.data);
      } catch (error) {
        toast.error('Unable to load leads or customers');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const openCreate = () => {
    setSelectedLead(null);
    setForm(initialLead);
    setModalOpen(true);
  };

  const openEdit = (lead) => {
    setSelectedLead(lead);
    setForm({
      title: lead.title || '',
      description: lead.description || '',
      source: lead.source || '',
      estimated_value: lead.estimated_value || '',
      customer_id: lead.customer_id || '',
      assigned_to: lead.assigned_to || '',
      status: lead.status || 'new',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Lead title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedLead) {
        await updateLead(selectedLead.id, form);
        setLeads((prev) => prev.map((item) => (item.id === selectedLead.id ? { ...item, ...form } : item)));
        toast.success('Lead updated');
      } else {
        const response = await createLead(form);
        setLeads((prev) => [response.data, ...prev]);
        toast.success('Lead created');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(`Delete ${lead.title}?`);
    if (!confirmed) return;

    try {
      await deleteLead(lead.id);
      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
      toast.success('Lead deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete lead');
    }
  };

  const sortedLeads = useMemo(
    () => leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [leads],
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Leads</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage leads</h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Source</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Value</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sortedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 text-slate-900">{lead.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[lead.status] ?? 'bg-slate-100 text-slate-700'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{lead.source || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{lead.estimated_value || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{customers.find((item) => item.id === lead.customer_id)?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(lead)} className="rounded-2xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(lead)} className="rounded-2xl bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedLeads.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title={selectedLead ? 'Edit lead' : 'Create lead'}
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
            <span className="mb-2 block text-sm font-semibold text-slate-700">Source</span>
            <input
              type="text"
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Estimated value</span>
            <input
              type="number"
              value={form.estimated_value}
              onChange={(event) => setForm((prev) => ({ ...prev, estimated_value: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Assigned to</span>
            <input
              type="text"
              value={form.assigned_to}
              onChange={(event) => setForm((prev) => ({ ...prev, assigned_to: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Customer</span>
            <select
              value={form.customer_id}
              onChange={(event) => setForm((prev) => ({ ...prev, customer_id: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="new">new</option>
              <option value="contacted">contacted</option>
              <option value="qualified">qualified</option>
              <option value="converted">converted</option>
              <option value="lost">lost</option>
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
