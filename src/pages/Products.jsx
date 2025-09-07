import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";
import AddProductModal from "../Components/AddProductModal";
import { toast } from "react-toastify";
import axios from "axios";
import ReviewsModal from "../Components/ReviewsModal";
import sentimentApi from "../api/sentimentApi";

const Products = () => {
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [sentiments, setSentiments] = useState({});

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ limit, offset }));
  }, [dispatch, limit, offset]);

  const handleSave = async (product) => {
    try {
      const resultAction = editingProduct
        ? await dispatch(updateProduct({ ...product, id: editingProduct.id }))
        : await dispatch(addProduct(product));

      if (
        (updateProduct.fulfilled &&
          updateProduct.fulfilled.match(resultAction)) ||
        (addProduct.fulfilled && addProduct.fulfilled.match(resultAction))
      ) {
        toast.success(
          editingProduct
            ? "Product updated successfully"
            : "Product added successfully"
        );
        setShowModal(false);
        setEditingProduct(null);
      } else {
        toast.error(resultAction.error?.message || "Failed to save product");
      }
    } catch (error) {
      toast.error("Something went wrong while saving the product");
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await dispatch(deleteProduct({ id: prodId })).unwrap();
      toast.success("Product deleted successfully ✅");
    } catch (err) {
      toast.error(err || "Failed to delete product ❌");
    }
  };

  const handleAnalyze = async (reviewId, text) => {
    try {
      const response = await sentimentApi.post("/analyze", { text });
      setSentiments((prev) => ({ ...prev, [reviewId]: response.data }));
    } catch (err) {
      toast.error("Sentiment analysis failed ❌");
    }
  };

  /*  const handleShowReviews = (reviews) => {
    setSelectedReviews(reviews);
    setShowReviewsModal(true);
  }; */

  const handleShowReviews = async (reviews) => {
    setSelectedReviews(reviews);
    try {
      const reviewTexts = reviews.map((rev) => rev.comment);

      const response = await sentimentApi.post("/analyze", {
        reviews: reviewTexts,
      });

      // Map results back to review IDs
      const newSentiments = {};
      response.data.forEach((res, idx) => {
        newSentiments[reviews[idx].id] = res;
      });

      setSentiments(newSentiments);
      setShowReviewsModal(true);
    } catch (err) {
      toast.error("Failed to analyze all reviews ❌");
    }
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

      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 overflow-x-auto">
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
              <th className="p-3 text-left">Reviews</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((prod) => (
              <tr
                key={prod.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 align-top"
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
                <td className="p-3">
                  ⭐ {prod.average_rating} ({prod.rating_count})
                </td>
                <td className="p-3">
                  {prod.reviews && prod.reviews.length > 0 ? (
                    <button
                      onClick={() => handleShowReviews(prod.reviews)}
                      className="text-white-600"
                    >
                      Show Reviews ({prod.reviews.length})
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">No reviews</span>
                  )}
                </td>
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

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="px-3 py-1 bg-red-700 text-white rounded-lg hover:bg-red-800 cursor-pointer m-2"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length > 0 ? (
          <div className="flex justify-end">
            {offset > 0 && (
              <button
                className="px-3 py-1 bg-red-700 text-white rounded-lg mt-3 mr-2"
                onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}

            {products.length < 10 ? (
              <></>
            ) : (
              <button
                onClick={() => setOffset((prev) => prev + limit)}
                className="px-3 py-1 bg-red-700 text-white rounded-lg mt-3"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialData={editingProduct}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        reviews={selectedReviews}
        analyzeSentiment={handleAnalyze}
        sentiments={sentiments}
      />
    </AdminLayout>
  );
};

export default Products;
