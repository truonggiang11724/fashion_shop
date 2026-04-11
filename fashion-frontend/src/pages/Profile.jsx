import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMe, updateProfile } from '../store/slices/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);


  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await dispatch(updateProfile({ username: formData.username, email: formData.email })).unwrap();
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err?.message || 'Update failed');
    }
  };

  if (status === 'loading') return <LoadingSpinner message="Loading profile..." />;

  return (
    <main className="max-w-4xl mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Hồ sơ cá nhân</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên người dùng</label>
            <input value={formData.username} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} className="w-full border border-gray-300 rounded p-2 text-gray-700 focus:border-gray-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="w-full border border-gray-300 rounded p-2 text-gray-700 focus:border-gray-500 focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 font-medium transition">Cập nhật hồ sơ</button>
        </form>
        {message && <p className="mt-3 text-sm text-green-600 font-medium">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </main>
  );
}
