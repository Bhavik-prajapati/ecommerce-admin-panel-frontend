import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../store/dashboardSlice";
import { updateOrder, resetOrderState } from "../store/orderSlice";
import UpdateOrderModal from "../Components/UpdateOrderModal";
import { toast } from "react-toastify";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.dashboard);
  const { loading: updating, success, error: updateError } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      dispatch(fetchDashboardData());
      dispatch(resetOrderState());
    }
  }, [success, dispatch]);
  
 

  const handleUpdateOrder = async (orderId, status, expectedDate) => {
  const toastId = toast.loading("Updating order..."); // show loader

  try {
    const resultAction = await dispatch(
      updateOrder({
        orderId,
        payment_status: status,
        expected_delivery_date: expectedDate,
      })
    );

    if (updateOrder.fulfilled.match(resultAction)) {
      toast.update(toastId, {
        render: "Order updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: resultAction.error?.message || "Failed to update order",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  } catch (error) {
    toast.update(toastId, {
      render: "Something went wrong while updating the order",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};


  const stats = [
    { title: "Total Sales", value: `₹${data?.get_admin_dashboard_data?.summary?.total_sales || 0}`, color: "from-orange-400 to-pink-500" },
    { title: "Orders", value: data?.get_admin_dashboard_data?.summary?.total_orders || 0, color: "from-blue-400 to-indigo-500" },
    { title: "Customers", value: data?.get_admin_dashboard_data?.summary?.total_customers || 0, color: "from-green-400 to-emerald-500" },
    { title: "Products", value: data?.get_admin_dashboard_data?.summary?.total_products || 0, color: "from-purple-400 to-fuchsia-500" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading && <p className="text-blue-500">Loading dashboard...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${s.color}`}>
              <h2 className="text-lg">{s.title}</h2>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.get_admin_dashboard_data?.orders?.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex flex-col justify-between">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">User ID: {order.user_id}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Amount:</span> {order.total_price}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Status:</span> {order.payment_status}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Expected Delivery:</span> {new Date(order.expected_delivery_date).toLocaleDateString()}
                </p>
              </div>

              <button
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
              >
                Update Delivery Status
              </button>
            </div>
          ))}
        </div>
      </div>

      <UpdateOrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateOrder}
        loading={updating}
        error={updateError}
      />
    </AdminLayout>
  );
};

export default Dashboard;
