import React, { useState, useEffect } from "react";

const UpdateOrderModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order?.payment_status || "");
  const [expectedDate, setExpectedDate] = useState(
    order?.expected_delivery_date?.split("T")[0] || ""
  );

  useEffect(() => {
    if (order) {
      setStatus(order.payment_status);
      setExpectedDate(order.expected_delivery_date.split("T")[0]);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Order #{order.id}</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Payment Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Expected Delivery Date</label>
          <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={() => onUpdate(order.id, status, expectedDate)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
