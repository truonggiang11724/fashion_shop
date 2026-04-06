import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}> 
          <div className="font-black text-2xl text-orange-500">Fashion</div>
          <span className="text-xs text-gray-500">Shop</span>
        </div>

        <nav className="flex items-center gap-4 text-sm text-gray-700">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-orange-500' : 'hover:text-orange-500')}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'text-orange-500' : 'hover:text-orange-500')}>Products</NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? 'text-orange-500' : 'hover:text-orange-500')}>Orders</NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'text-orange-500' : 'hover:text-orange-500')}>Cart ({cartCount})</NavLink>
          {user ? (
            <div className="flex items-center gap-2">
              <NavLink to="/profile" className="text-gray-700 hover:text-orange-500">{user.username || user.email}</NavLink>
              <button onClick={() => dispatch(logout())} className="text-gray-500 hover:text-gray-800">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="hover:text-orange-500">Login</NavLink>
              <NavLink to="/register" className="hover:text-orange-500">Register</NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
