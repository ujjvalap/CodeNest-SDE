import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../../shared/Spinner";
import { setAuthError } from "../../redux/reducers/authSlice";
import { useUpdateCategoryMutation } from "../../redux/api/api";


function EditCategoryModal({ category, onClose, fetchCategories }) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [categoryResource, setCategoryResource] = useState("");
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setCategoryName(category.category_name || "");
      setCategoryResource(category.category_resources?.[0] || "");
    } else {
      setCategoryName("");
      setCategoryResource("");
    }
  }, [category]);

  // Reset form on close
  const handleClose = () => {
    setCategoryName("");
    setCategoryResource("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !category._id) {
      dispatch(setAuthError("Invalid category data. Cannot perform update."));
      return;
    }
    const updatedPayload = {
      categoryId: category._id,
      updatedData: {
        category_name: categoryName,
        category_resources: [categoryResource],
      },
    };
    try {
      const res = await updateCategory(updatedPayload).unwrap();
      fetchCategories();
      handleClose();
      dispatch(
        setAuthError(`Successfully updated category: ${res?.data?.category_name || categoryName}`)
      );
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || "Failed to Edit Category"));
    }
  };

  if (!category) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-8 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">No category selected</h2>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-8 z-50">
      {isLoading && <div className="w-8 h-8"><Spinner /></div>}

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mt-2 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
          Edit Category
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Resource <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryResource}
              onChange={(e) => setCategoryResource(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Resource URL or Reference"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryModal;
