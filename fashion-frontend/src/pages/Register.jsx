import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await dispatch(register({ username, email, password })).unwrap();
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setError(err?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg border">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required type="text" className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="mt-1 w-full border rounded p-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Registering...' : 'Register'}
        </button>
        {(error || authError) && <p className="text-red-600">{error || authError}</p>}
        <p className="text-sm text-gray-600">
          Already have account? <Link to="/login" className="text-orange-500">Login</Link>
        </p>
      </form>
    </main>
  );
}
