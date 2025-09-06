// src/Components/AddCategoryModal.jsx
import React, { useState, useEffect } from "react";
import { fetchCategoriesData } from "../store/categoriesSlice";

const AddCategoryModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });

  useEffect(() => {
  if (isOpen) {
    if (initialData) {
      setFormData({
        category: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({ category: "", description: "" });
    }
  }
}, [isOpen, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.category.trim()) {
    alert("Category name is required");
    return;
  }

  try {
    const result = await onSave(formData);
    console.log(result)

    if (result && !result.error) {
      dispatch(fetchCategoriesData());
      onClose();
    }
  } catch (error) {
    console.error("Error saving category:", error);
    alert("Failed to save category. Please try again.");
  }
};



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block mb-1 font-semibold">Category Name</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Optional description"
              rows={3}
            />
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

export default AddCategoryModal;
