import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAddAdminEmailMutation,
  useDeleteAdminEmailMutation,
} from "../../redux/api/api";
import { setAuthError } from "../../redux/reducers/authSlice";
import Spinner from "../../shared/Spinner";

function AdminHeader({ userType, text, fetchUsers }) {
  const [addEmail, setAddEmail] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");

  const dispatch = useDispatch();
  const [addAdminEmail, { isLoading: isLoadingAdd }] = useAddAdminEmailMutation();
  const [deleteAdminEmail, { isLoading: isLoadingDel }] = useDeleteAdminEmailMutation();

  const handleAddEmailChange = (e) => setAddEmail(e.target.value);
  const handleDeleteEmailChange = (e) => setDeleteEmail(e.target.value);

  const handleAddAdmin = async () => {
    if (addEmail.trim() === "") return;

    try {
      await addAdminEmail({ email: addEmail }).unwrap();
      dispatch(setAuthError("Successfully added admin email"));
      setAddEmail("");
      fetchUsers();
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || err.message || "Add admin failed"));
    }
  };

  const handleDeleteAdmin = async () => {
    if (deleteEmail.trim() === "") return;

    try {
      await deleteAdminEmail({ email: deleteEmail }).unwrap();
      dispatch(setAuthError("Successfully deleted admin email"));
      setDeleteEmail("");
      fetchUsers();
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || err.message || "Delete admin failed"));
    }
  };

  return (
    <>
      {userType === "Super Admin" && (
        <div className="w-full h-auto p-4 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md rounded transition duration-300">
          {/* DELETE */}
          <div className="flex items-center mb-2 lg:mb-0">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-0.5 px-1.5 md:py-1 md:px-2 rounded mr-2 transition duration-300"
              onClick={handleDeleteAdmin}
              title="Remove Admin"
            >
              Delete
            </button>
            <input
              type="email"
              placeholder="Admin Email"
              value={deleteEmail}
              onChange={handleDeleteEmailChange}
              className="border border-gray-300 rounded-md py-0.5 px-1.5 md:px-2 md:py-1 mr-2 focus:outline-none focus:border-blue-500 transition duration-300"
            />
            {isLoadingDel && <Spinner />}
          </div>

          {/* CENTER TEXT */}
          <div className="text-lg text-gray-900 mb-2 md:mb-0 dark:text-white font-bold transition duration-300">
            {text}
          </div>

          {/* ADD */}
          <div className="flex items-center">
            {isLoadingAdd && <Spinner />}
            <input
              type="email"
              placeholder="Admin Email"
              value={addEmail}
              onChange={handleAddEmailChange}
              className="border border-gray-300 rounded-md py-0.5 px-1.5 md:px-2 md:py-1 mx-2 focus:outline-none focus:border-blue-500 transition duration-300"
            />
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-0.5 px-1.5 md:py-1 md:px-2 rounded mr-2 transition duration-300"
              onClick={handleAddAdmin}
              title="Add Admin"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {userType === "Admin" && (
        <div className="w-full h-auto p-4 flex justify-around items-center bg-white dark:bg-gray-800 shadow-md rounded transition duration-300">
          <div className="text-lg text-gray-900 dark:text-white font-bold transition duration-300">
            {text}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminHeader;
