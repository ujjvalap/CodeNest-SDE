
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetUsersQuery,
  useGetCategoriesQuery,
} from "../../redux/api/api";

import { selectUserType  , setAuthError } from "../../redux/reducers/authSlice";

import AdminHeader from "../admin/AdminHeader";
import CategoriesAccordion from "../categriy/CategoriesAccordion";
import RolesMenu from "../role/RolesMenu";

function AdminPanel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);

  // Fetch users and categories using RTK Query
  const {
    data: usersData,
    error: usersError,
    isLoading: loadingUsers,
    refetch: fetchUsers,
  } = useGetUsersQuery();

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: loadingCategories,
    refetch: fetchCategories,
  } = useGetCategoriesQuery();

  // Auto redirect on session expiration or unauthorized access
  useEffect(() => {
    if (userType === "User") navigate("/");

    if (usersError?.data?.message === "Session Expired" || categoriesError?.data?.message === "Session Expired") {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      navigate("/login");
    }

    if (usersError) dispatch(setAuthError(usersError.data?.message || "Failed to fetch users"));
    if (categoriesError) dispatch(setAuthError(categoriesError.data?.message || "Failed to fetch categories"));
  }, [userType, usersError, categoriesError, navigate, dispatch]);

  // Role categorization logic
  const users = usersData?.filter((u) => u.userType === "User") || [];
  const admins = usersData?.filter((u) => u.userType === "Admin") || [];
  const superAdmins = usersData?.filter((u) => u.userType === "Super Admin") || [];

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 transition duration-500">
      <AdminHeader
        userType={userType}
        text="Admin Panel"
        fetchUsers={fetchUsers}
      />

      <div className="flex flex-col lg:flex-row mt-8 space-y-8 lg:space-y-0 lg:space-x-8">
        <CategoriesAccordion
          categories={categories}
          fetchCategories={fetchCategories}
          loadingCategories={loadingCategories}
        />
        <RolesMenu
          users={users}
          admins={admins}
          superAdmins={superAdmins}
          fetchUsers={fetchUsers}
          loadingUsers={loadingUsers}
        />
      </div>
    </div>
  );
}

export default AdminPanel;



