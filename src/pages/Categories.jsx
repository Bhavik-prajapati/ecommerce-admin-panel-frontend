import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesData, addCategoriesData, updateCategoryData, deleteCategoryData } from "../store/categoriesSlice";
import AddCategoryModal from "../Components/AddCategoryModal";
import { toast } from "react-toastify";


const Categories = () => {
  const dispatch = useDispatch();
  const { data: categories, loading, error } = useSelector((state) => state.categories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoriesData());
  }, [dispatch]);

    const handleSave = async (categoryData) => {
    try {
      let resultAction;

      if (editingCategory) {
        resultAction = await dispatch(
          updateCategoryData({
            id: editingCategory.id,
            name: categoryData.category,
            description: categoryData.description,
          })
        );
      } else {
        resultAction = await dispatch(addCategoriesData(categoryData));
      }

      if (resultAction.type.endsWith("fulfilled")) {
        toast.success(editingCategory ? "Category updated successfully" : "Category added successfully");
        dispatch(fetchCategoriesData());
        setShowModal(false);
        setEditingCategory(null);
      } else {
        toast.error(resultAction.payload?.message || "Failed to save category");
      }
    } catch (err) {
      toast.error("Something went wrong while saving the category");
    }
  };

  const handleDeleteCategory=async(id)=>{
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const resultAction = await dispatch(deleteCategoryData({ id }));

      if (deleteCategoryData.fulfilled.match(resultAction)) {
        toast.success("Category deleted successfully");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete category");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting the category");
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
        {loading && <p className="text-gray-500">Loading categories...</p>}
        {error && <p className="text-red-500">{error.error}</p>}

        {categories && categories.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Updated At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="p-3">{cat.id}</td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3">{cat.description || "-"}</td>
                  <td className="p-3">{new Date(cat.created_at).toLocaleString()}</td>
                  <td className="p-3">{new Date(cat.updated_at).toLocaleString()}</td>
                  <td className="p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {handleDeleteCategory(cat.id)}}
                    className="px-3 py-1 bg-red-700 text-white rounded-lg hover:bg-yellow-600 cursor-pointer m-2"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p className="text-gray-500">No categories found.</p>
        )}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        initialData={editingCategory}
      />
    </AdminLayout>
  );
};

export default Categories;
