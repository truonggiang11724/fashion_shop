import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [promo, setPromo] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.quantity || 0) * Number(item.price || 0), 0), [items]);
  const discount = promo === 'SAVE10' ? 0.1 : 0;
  const grandTotal = total - total * discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setError('Cart is empty');
      return;
    }
    if (!address || !phone) {
      setError('Please provide shipping details');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      await dispatch(placeOrder({
        customer_id: user?.user_id,
        order_status: 'PENDING',
        payment_status: 'UNPAID',
        total_amount: Number(grandTotal),
        items: items.map((item) => ({ variant_id: item.product_id, quantity: item.quantity, unit_price: Number(item.price) })),
      })).unwrap();
      dispatch(clearCart());
      setStatus('succeeded');
      setTimeout(() => navigate('/orders'), 1200);
    } catch (err) {
      setError(err?.message || 'Checkout failed');
      setStatus('failed');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 mt-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input value={user?.username || user?.email || ''} readOnly className="mt-1 w-full border rounded p-2 bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Promotion code</label>
          <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="SAVE10" className="mt-1 w-full border rounded p-2" />
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Discount</span>
          <span>${(total * discount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>

        <button disabled={status === 'loading'} onClick={handleSubmit} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-60">
          {status === 'loading' ? 'Placing order...' : 'Place Order'}
        </button>

        {status === 'loading' && <LoadingSpinner message="Submitting order..." />}
        {error && <p className="text-red-600">{error}</p>}
        {status === 'succeeded' && <p className="text-green-600">Order successful. Redirecting to orders...</p>}
      </div>
    </main>
  );
}
