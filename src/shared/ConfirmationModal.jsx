import React, { useState } from "react";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux";
import {
  useDeleteCategoryMutation,
  useDeleteQuestionMutation,
  useDeleteUserMutation,
} from "../redux/api/api";
import { setAuthError } from "../redux/reducers/authSlice"; // updated to use Redux instead of Context

function ConfirmationModal({
  message,
  selectedCategory,
  selectedUser,
  selectedQuestion,
  fetchCategories,
  fetchUsers,
  onCancel,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [deleteUser] = useDeleteUserMutation();

  const onDeleteCategory = async () => {
    try {
      setIsLoading(true);
      await deleteCategory(selectedCategory._id).unwrap();
      fetchCategories();
      dispatch(setAuthError(`Deleted Category ${selectedCategory.category_name}`));
      onCancel();
    } catch (error) {
      dispatch(setAuthError(error?.data?.message || "Error deleting Category"));
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteQuestion = async () => {
    try {
      setIsLoading(true);
      await deleteQuestion({
        questionId: selectedQuestion._id,
        categoryId: selectedCategory._id,
      }).unwrap();
      fetchCategories();
      dispatch(setAuthError(`Deleted Question ${selectedQuestion.question_name}`));
      onCancel();
    } catch (error) {
      dispatch(setAuthError(error?.data?.message || "Error deleting Question"));
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteUser = async () => {
    try {
      setIsLoading(true);
      await deleteUser(selectedUser._id).unwrap();
      fetchUsers();
      dispatch(setAuthError("Successfully deleted User"));
      onCancel();
    } catch (error) {
      dispatch(setAuthError(error?.data?.message || "Error deleting User"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="w-8 h-8">{isLoading && <Spinner />}</div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mt-2 w-full">
        <h2 className="text-lg font-semibold mb-2 text-center text-gray-900 dark:text-gray-100">
          Confirm Deletion
        </h2>
        <p className="mb-2 text-center text-gray-700 dark:text-gray-300">{message}</p>
        <p className="mb-4 text-center text-red-600 dark:text-red-400">
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            title="Cancel"
            className="w-1/2 px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={
              selectedQuestion
                ? onDeleteQuestion
                : selectedUser
                ? onDeleteUser
                : onDeleteCategory
            }
            title="Delete"
            className="w-1/2 px-2 py-1 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
