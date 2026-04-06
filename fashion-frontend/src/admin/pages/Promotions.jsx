import { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';

const Promotions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const promotions = [];
  const loading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement create/update
    setModalOpen(false);
  };

  const handleDelete = () => {
    setConfirmDelete(null);
  };

  const columns = [
    { header: 'Code', key: 'code' },
    { header: 'Discount', key: 'discount' },
    { header: 'Type', key: 'type' },
    { header: 'Valid Until', key: 'valid_until' },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">Edit</button>
          <button
            onClick={() => setConfirmDelete(row)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Add Promotion
        </Button>
      </div>
      <Table
        columns={columns}
        data={promotions}
        loading={loading}
        emptyMessage="No promotions found"
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Promotion"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Promo Code" required />
          <Input type="number" placeholder="Discount Amount" required />
          <Input type="date" placeholder="Valid Until" required />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
              Create
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Promotion"
        message="Are you sure you want to delete this promotion?"
        confirmText="Delete"
      />
    </div>
  );
};

export default Promotions;