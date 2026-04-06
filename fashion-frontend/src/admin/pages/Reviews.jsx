import { useState } from 'react';
import Table from '../../components/Table';
import ConfirmDialog from '../../components/ConfirmDialog';

const Reviews = () => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const reviews = [];
  const loading = false;

  const handleDelete = () => {
    // Implement delete
    setConfirmDelete(null);
  };

  const columns = [
    { header: 'Product', key: 'product_name' },
    { header: 'User', key: 'username' },
    { header: 'Rating', key: 'rating' },
    { header: 'Comment', key: 'comment' },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => setConfirmDelete(row)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
      <Table
        columns={columns}
        data={reviews}
        loading={loading}
        emptyMessage="No reviews found"
      />
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        confirmText="Delete"
      />
    </div>
  );
};

export default Reviews;