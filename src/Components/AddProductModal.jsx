import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesData } from "../store/categoriesSlice";

const AddProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const dispatch = useDispatch();
  const { data: categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  const [loadingDescription, setLoadingDescription] = useState(false);
  const [showAiIcon, setShowAiIcon] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategoriesData());
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          price: initialData.price || "",
          stock: initialData.stock || "",
          image_url: initialData.image_url || "",
          category_id: initialData.category_id || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          image_url: "",
          category_id: "",
        });
      }
    }
  }, [isOpen, initialData, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Show AI icon when user starts writing in description
    if (name === "description" && value.trim().length > 5) {
      setShowAiIcon(true);
    } else if (name === "description") {
      setShowAiIcon(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const generateBetterDescription = async () => {

    try {
      setLoadingDescription(true);

      const response = await fetch("http://localhost:8000/description/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.description}),
      });

      const data = await response.json();
      setFormData((prev) => ({ ...prev, description: data.description }));
      setShowAiIcon(false);
    } catch (error) {
      console.error("AI description generation failed:", error);
    } finally {
      setLoadingDescription(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Description with AI icon */}
          <div className="relative">
            <label className="block mb-1 font-semibold">Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />

            {showAiIcon && (
              <button
                type="button"
                onClick={generateBetterDescription}
                className="absolute right-2 top-8 text-blue-500 hover:text-blue-700"
                title="Generate smart description from title"
                disabled={loadingDescription}
              >
                {loadingDescription ? (
                  <span>⏳</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 7H7v6h6V7z" />
                    <path
                      fillRule="evenodd"
                      d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm10 12H5V5h10v10z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-semibold">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
