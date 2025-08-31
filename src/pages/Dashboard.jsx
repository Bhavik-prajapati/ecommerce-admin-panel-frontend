import AdminLayout from "../layouts/AdminLayout";

const Dashboard = () => {
  const stats = [
    { title: "Total Sales", value: "₹1,20,000", color: "from-orange-400 to-pink-500" },
    { title: "Orders", value: "350", color: "from-blue-400 to-indigo-500" },
    { title: "Customers", value: "120", color: "from-green-400 to-emerald-500" },
    { title: "Products", value: "58", color: "from-purple-400 to-fuchsia-500" },
  ];

  const orders = [
    { id: "#1234", customer: "John Doe", amount: "₹1200", status: "Paid" },
    { id: "#1235", customer: "Jane Smith", amount: "₹850", status: "Pending" },
    { id: "#1236", customer: "Mark Lee", amount: "₹560", status: "Paid" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${s.color}`}
          >
            <h2 className="text-lg">{s.title}</h2>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.amount}</td>
                <td
                  className={`p-3 font-medium ${
                    order.status === "Paid" ? "text-green-600" : "text-yellow-500"
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
