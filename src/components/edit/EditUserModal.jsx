import React, { useEffect, useState } from "react";
import Spinner from "../../shared/Spinner";
import { useDispatch } from "react-redux";
import { setAuthError } from "../../redux/reducers/authSlice";
import { useUpdateUserMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditUserModal({ user, onClose, fetchUsers }) {
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  // Prefill role when user is passed
  useEffect(() => {
    if (user?.userType) {
      setRole(user.userType);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("Invalid user data. Cannot perform update.");
      return;
    }

    try {
      await updateUser({
        userId: user._id,
        updatedData: { userType: role },
      }).unwrap();

      toast.success(
        `Role updated successfully."${role}".`
      );

      fetchUsers();
      onClose();
    } catch (error) {
      const msg =
        error?.data?.message ||
        "Failed to update the user role. Please try again.";
      toast.error(msg);
      dispatch(setAuthError(msg));
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-8 z-50">
      {isLoading && (
        <div className="absolute top-6">
          <Spinner />
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
          Edit Role
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              ID
            </label>
            <input
              type="text"
              value={user._id}
              readOnly
              className="rounded-md p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={user.firstName}
              readOnly
              className="rounded-md p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={user.lastName}
              readOnly
              className="rounded-md p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded-md p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
