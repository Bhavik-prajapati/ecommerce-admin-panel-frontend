import React from "react";

const sentimentEmoji = {
  POSITIVE: "😊",
  NEGATIVE: "😞",
  NEUTRAL: "😐",
};

const ReviewsModal = ({ isOpen, onClose, reviews, sentiments }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full overflow-y-auto max-h-[80vh] shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">🌟 Product Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews available.</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((rev) => (
              <div key={rev.id} className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 shadow-sm">
                <p className="text-md font-medium mb-2">💬 {rev.comment}</p>
                <p className="text-sm text-gray-600">⭐ Rating: {rev.rating}</p>

                {sentiments[rev.id] ? (
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-xl">
                      {sentimentEmoji[sentiments[rev.id].sentiment] || "🤔"}
                    </span>
                    <span
                      className={
                        sentiments[rev.id].sentiment === "POSITIVE"
                          ? "text-green-600 font-semibold"
                          : sentiments[rev.id].sentiment === "NEGATIVE"
                          ? "text-red-600 font-semibold"
                          : "text-gray-600 font-semibold"
                      }
                    >
                      {sentiments[rev.id].sentiment}
                    </span>
                    <span className="text-xs text-gray-500">
                      (Confidence: {sentiments[rev.id].confidence.toFixed(2)})
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm mt-2">Analyzing sentiment...</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
