import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, fetchMe } from '../store/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { token, status, error: authError } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (token && status === 'succeeded') {
      dispatch(fetchMe());
      navigate(from, { replace: true });
    }
  }, [token, status, navigate, from, dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      const tokenResult = result.access_token || result.token;
      localStorage.setItem('token', tokenResult);
      dispatch(fetchMe());
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg border">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="mt-1 w-full border rounded p-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {(error || authError) && <p className="text-red-600">{error || authError}</p>}
        <p className="text-sm text-gray-600">
          Don’t have an account? <Link to="/register" className="text-orange-500">Register here</Link>
        </p>
      </form>
    </main>
  );
}
