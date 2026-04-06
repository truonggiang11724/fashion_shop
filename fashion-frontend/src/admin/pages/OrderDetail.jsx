import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderDetail } from '../../store/slices/orderAdminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, loading, error } = useSelector((state) => state.orderAdmin);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetail(id));
    }
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!detail) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order #{detail.order_id}</h1>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
          detail.status === 'completed'
            ? 'bg-green-100 text-green-800'
            : detail.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {detail.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {detail.order_items?.map((item) => (
              <div key={item.order_item_id} className="flex items-center space-x-4">
                <img
                  src={item.product?.product_media?.[0]?.media_url || '/placeholder.jpg'}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-900">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-lg font-medium">
              <span>Total:</span>
              <span>${detail.total_amount || 0}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {detail.customer?.username}</p>
              <p><strong>Email:</strong> {detail.customer?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><strong>Address:</strong> {detail.shipping_address || 'N/A'}</p>
              <p><strong>Phone:</strong> {detail.customer?.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-2">
              <p><strong>Method:</strong> {detail.payment_method || 'N/A'}</p>
              <p><strong>Status:</strong> {detail.payment_status || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;