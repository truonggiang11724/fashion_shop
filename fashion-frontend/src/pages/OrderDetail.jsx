import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, detailStatus, detailError } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (detailStatus === 'loading') return <LoadingSpinner message="Loading order detail..." />;
  if (detailStatus === 'failed') return <p className="text-red-600 text-center">{detailError}</p>;
  if (!detail) return <p>No order found.</p>;

  const items = detail.items || [];
  const total = Number(detail.total_amount || detail.total || 0);

  return (
    <main className="max-w-5xl mx-auto p-4 mt-6">
      <h1 className="text-2xl font-bold mb-4">Order #{detail.order_id || detail.id}</h1>
      <p>Status: <span className="font-semibold">{detail.order_status}</span></p>
      <div className="mt-4 bg-white rounded-lg border p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id || item.variant_id} className="flex justify-between">
            <span>{item.product_name || item.variant_id}</span>
            <span>{item.quantity} x ${item.unit_price || item.price || 0}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right text-xl font-bold">Total: ${total.toFixed(2)}</div>
    </main>
  );
}
