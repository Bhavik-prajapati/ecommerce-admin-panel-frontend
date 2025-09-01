import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, updateProduct } from "../store/productSlice";
import AddProductModal from "../Components/AddProductModal";

const Products = () => {
  const { products, loading, error } = useSelector((s) => s.products);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Handle Save / Update
  const handleSave = (product) => {
    if (editingProduct) {
      // update existing product
      dispatch(updateProduct({ ...product, id: editingProduct.id }));
    } else {
      // add new product
      dispatch(addProduct(product));
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr
                key={prod.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-3">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{prod.name}</td>
                <td className="p-3">${prod.price}</td>
                <td className="p-3 font-medium">{prod.category_name}</td>
                <td className="p-3">{prod.stock}</td>
                <td className="p-3">⭐ {prod.average_rating} ({prod.rating_count})</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Add / Edit Product Modal */}
      <AddProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialData={editingProduct}
      />
    </AdminLayout>
  );
};

export default Products;
