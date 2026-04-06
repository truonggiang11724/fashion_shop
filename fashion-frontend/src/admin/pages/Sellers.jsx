const Sellers = () => {
  // Placeholder - implement when backend ready
  const sellers = [];
  const loading = false;

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Status', key: 'status' },
    {
      header: 'Actions',
      key: 'actions',
      render: () => (
        <div className="flex space-x-2">
          <button className="text-green-600 hover:text-green-900">Approve</button>
          <button className="text-red-600 hover:text-red-900">Reject</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
      <Table
        columns={columns}
        data={sellers}
        loading={loading}
        emptyMessage="No sellers found"
      />
    </div>
  );
};

export default Sellers;