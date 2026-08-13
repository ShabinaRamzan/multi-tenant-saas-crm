import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await axiosInstance.post('/api/v1/auth/register', {
        name,
        email,
        password,
        company_name: companyName,
        company_email: companyEmail,
      });
      toast.success('Registration complete. Please sign in.');
      navigate('/login');
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Create your company</h1>
          <p className="mt-3 text-sm text-slate-500">Register your company and admin user to get started.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Company name</span>
              <input
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Company email</span>
              <input
                type="email"
                value={companyEmail}
                onChange={(event) => setCompanyEmail(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Registering…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
