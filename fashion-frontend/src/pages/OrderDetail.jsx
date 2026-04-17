import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, detailStatus, detailError } = useSelector((state) => state.orders);
  console.log(detail);
  

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (detailStatus === 'loading') return <LoadingSpinner message="Đang tải chi tiết đơn hàng..." />;
  if (detailStatus === 'failed') return <p className="text-red-600 text-center font-medium">{detailError}</p>;
  if (!detail) return <p className="text-gray-600 text-center">Không tìm thấy đơn hàng.</p>;

  const items = detail.order_items || [];
  const total = Number(detail.total_amount || detail.total || 0);

  return (
    <main className="max-w-5xl mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Đơn hàng #{detail.order_id || detail.id}</h1>
      <p className="text-gray-700">Trạng thái: <span className="font-medium text-gray-900">{detail.order_status}</span></p>
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id || item.variant_id} className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
            <img src={'http://localhost:3000'+item.product_variants.image_url} className="w-20 h-20 object-cover rounded" />
            <span className="text-gray-700">{item.product_variants.products.product_name}</span>
            </div>
            <span className="text-gray-700 font-medium">{item.quantity} x ${item.unit_price || item.price || 0}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right text-xl font-bold text-gray-900">Tổng cộng: ${total.toFixed(2)}</div>
    </main>
  );
}
