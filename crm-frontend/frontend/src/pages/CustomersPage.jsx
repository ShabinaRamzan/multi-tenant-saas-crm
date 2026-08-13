import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';

const initialCustomer = { name: '', email: '', phone: '', address: '', notes: '' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState(initialCustomer);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        toast.error('Unable to load customers');
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const openCreate = () => {
    setSelectedCustomer(null);
    setForm(initialCustomer);
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, form);
        setCustomers((prev) => prev.map((item) => (item.id === selectedCustomer.id ? { ...item, ...form } : item)));
        toast.success('Customer updated');
      } else {
        const response = await createCustomer(form);
        setCustomers((prev) => [response.data, ...prev]);
        toast.success('Customer added');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(`Delete ${customer.name}?`);
    if (!confirmed) return;

    try {
      await deleteCustomer(customer.id);
      setCustomers((prev) => prev.filter((item) => item.id !== customer.id));
      toast.success('Customer deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete customer');
    }
  };

  const formattedCustomers = useMemo(
    () => customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [customers],
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Customers</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Customer list</h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Phone</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Address</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {formattedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-slate-900">{customer.name}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.email || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.address || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(customer)} className="rounded-2xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(customer)} className="rounded-2xl bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {formattedCustomers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title={selectedCustomer ? 'Edit customer' : 'Add customer'}
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
            <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Phone</span>
            <input
              type="text"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Address</span>
            <input
              type="text"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Notes</span>
          <textarea
            rows="4"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </Modal>
    </Layout>
  );
}
