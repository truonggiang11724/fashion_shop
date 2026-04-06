import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Orders() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === 'loading') return <LoadingSpinner message="Loading orders..." />;

  return (
    <main className="max-w-6xl mx-auto p-4 mt-6">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {error && <p className="text-red-600">{error}</p>}
      {list.length === 0 && <p>No orders found.</p>}
      <div className="grid gap-3">
        {list.map((order) => (
          <Link key={order.order_id || order.id} to={`/orders/${order.order_id || order.id}`} className="p-4 bg-white rounded-lg border hover:shadow">
            <div className="flex justify-between">
              <p>Order #{order.order_id || order.id}</p>
              <p className="font-medium">{order.order_status || 'Pending'}</p>
            </div>
            <p className="text-sm text-gray-500">Total: ${Number(order.total_amount || order.total || 0).toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
