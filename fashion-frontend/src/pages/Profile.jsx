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
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-lg border p-4 max-w-lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input value={formData.username} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="w-full border rounded p-2" />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600">Update Profile</button>
        </form>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
