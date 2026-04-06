import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderStatus, setStatusFilter, setPage } from '../../store/slices/orderAdminSlice';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import Select from '../../components/Select';
import Button from '../../components/Button';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, total, page, limit, status, loading, error } = useSelector((state) => state.orderAdmin);

  useEffect(() => {
    dispatch(fetchAdminOrders({ page, limit, status }));
  }, [dispatch, page, limit, status]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const columns = [
    {
      header: 'Order ID',
      key: 'order_id',
      render: (row) => (
        <Link
          to={`/admin/orders/${row.order_id}`}
          className="text-blue-600 hover:text-blue-900 font-medium"
        >
          #{row.order_id}
        </Link>
      ),
    },
    {
      header: 'Customer',
      key: 'customer',
      render: (row) => row.customer?.username || 'N/A',
    },
    {
      header: 'Total',
      key: 'total_amount',
      render: (row) => `$${row.total_amount || 0}`,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Select
          value={row.status}
          onChange={(e) => handleStatusChange(row.order_id, e.target.value)}
          options={statusOptions.slice(1)} // Remove 'All Status'
          className="text-xs"
        />
      ),
    },
    {
      header: 'Date',
      key: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          value={status}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          options={statusOptions}
          className="max-w-xs"
        />
      </div>

      <Table
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage="No orders found"
      />

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page === 1}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="px-4 py-2">Page {page} of {Math.ceil(total / limit)}</span>
          <Button
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= Math.ceil(total / limit)}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;