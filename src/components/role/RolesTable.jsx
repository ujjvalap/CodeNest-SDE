import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FaSortDown,
  FaSortUp,
  FaSearch,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditUserModal from "../edit/EditUserModal";
import ConfirmationModal from "../../shared/ConfirmationModal";
import AdminHeader from "../admin/AdminHeader";
import Spinner from "../../shared/Spinner";
import { setAuthError } from "../../redux/reducers/authSlice";
import { useGetUsersQuery, useDeleteUserMutation } from "../../redux/api/api";

function RolesTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);

  const [editUser, setEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(false);

  const [showUsers, setShowUsers] = useState(true);
  const [showAdmins, setShowAdmins] = useState(true);
  const [showSuperAdmins, setShowSuperAdmins] = useState(true);

  // Use the API query hook
  const {
    data: usersData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery();

  // Delete user mutation
  const [deleteUserAPI] = useDeleteUserMutation();

  useEffect(() => {
    if (isError) {
      const errMsg = error?.data?.message || "Error fetching users";
      dispatch(setAuthError(errMsg));
      if (errMsg === "Session Expired") {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }
    }
  }, [isError, error, dispatch, navigate]);

  useEffect(() => {
    if (userType === "User") navigate("/");
  }, [userType, navigate]);

  // Calculate counts for each user type
  const { userCount, adminCount, superAdminCount } = useMemo(() => {
    let userCount = 0;
    let adminCount = 0;
    let superAdminCount = 0;

    usersData.forEach((user) => {
      if (user.userType === "User") userCount++;
      else if (user.userType === "Admin") adminCount++;
      else if (user.userType === "Super Admin") superAdminCount++;
    });

    return { userCount, adminCount, superAdminCount };
  }, [usersData]);

  // Prepare data with serial IDs
  const data = useMemo(() => {
    let u = 0,
      a = 0,
      s = 0;
    return usersData.map((user) => {
      let prefix = "";
      if (user.userType === "User") prefix = "U-" + String(++u).padStart(3, "0");
      else if (user.userType === "Admin") prefix = "A-" + String(++a).padStart(3, "0");
      else if (user.userType === "Super Admin") prefix = "S-" + String(++s).padStart(3, "0");
      return { ...user, serialId: prefix };
    });
  }, [usersData]);

  // Filter data based on visibility toggles
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      if (user.userType === "User" && !showUsers) return false;
      if (user.userType === "Admin" && !showAdmins) return false;
      if (user.userType === "Super Admin" && !showSuperAdmins) return false;
      return true;
    });
  }, [data, showUsers, showAdmins, showSuperAdmins]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "S.No.",
        accessor: (row, index) => index + 1,
        id: "serialNo",
      },
      {
        Header: "ID",
        accessor: "serialId",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "userType",
        sortType: (a, b) => {
          const order = { "Super Admin": 1, Admin: 2, User: 3 };
          return order[a.original.userType] - order[b.original.userType];
        },
      },
      {
        Header: "Date Joined",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
        sortType: (a, b) => new Date(a.original.createdAt) - new Date(b.original.createdAt),
      },
      ...(userType === "Super Admin"
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              Cell: ({ row }) => (
                <div className="flex space-x-6">
                  <FaEdit
                    className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    title="Edit Role"
                    onClick={() => handleEdit(row.original)}
                  />
                  <FaTrash
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    title="Delete"
                    onClick={() => handleDelete(row.original)}
                  />
                </div>
              ),
            },
          ]
        : []),
    ],
    [userType]
  );

  // Action handlers
  const handleEdit = useCallback((user) => {
    setEditUser(true);
    setSelectedUser(user);
  }, []);

  const handleDelete = useCallback((user) => {
    setDeleteUser(true);
    setSelectedUser(user);
  }, []);

  // THE FIX: Memoize table options to prevent infinite re-renders
  const tableOptions = useMemo(() => ({
    columns,
    data: filteredData,
    initialState: { globalFilter: '' },
  }), [columns, filteredData]);

  // Table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    tableOptions,
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 transition duration-500">
      <AdminHeader userType={userType} text="User Info" fetchUsers={refetch} />

      <div className="mt-8 space-y-2 py-4 pb-6 p-6 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global Search"
              className="pl-9 py-1.5 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-md focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={showUsers} 
                  onChange={() => setShowUsers(!showUsers)} 
                  className="mr-2"
                /> 
                Users ({userCount})
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={showAdmins} 
                  onChange={() => setShowAdmins(!showAdmins)} 
                  className="mr-2"
                /> 
                Admins ({adminCount})
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={showSuperAdmins} 
                  onChange={() => setShowSuperAdmins(!showSuperAdmins)} 
                  className="mr-2"
                /> 
                Super Admins ({superAdminCount})
              </label>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border rounded shadow" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => {
                const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                return (
                  <tr key={key} {...restHeaderGroupProps}>
                    {headerGroup.headers.map((column) => {
                      const { key: headerKey, ...restHeaderProps } = column.getHeaderProps(column.getSortByToggleProps());
                      return (
                        <th
                          key={headerKey}
                          {...restHeaderProps}
                          className="p-3 text-left bg-gray-100 dark:bg-gray-700 text-sm font-semibold"
                        >
                          <div className="flex items-center">
                            {column.render("Header")}
                            {column.isSorted && (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />)}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                const { key, ...restRowProps } = row.getRowProps();
                return (
                  <tr 
                    key={key} 
                    {...restRowProps} 
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...restCellProps } = cell.getCellProps();
                      return (
                        <td 
                          key={cellKey} 
                          {...restCellProps} 
                          className="p-3 text-sm"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && (
        <EditUserModal
          fetchUsers={refetch}
          user={selectedUser}
          onClose={() => {
            setEditUser(false);
            setSelectedUser(null);
          }}
        />
      )}

      {deleteUser && (
        <ConfirmationModal
          selectedUser={selectedUser}
          message={`Are you sure you want to delete ${selectedUser.firstName} (${selectedUser.userType})?`}
          onCancel={() => {
            setDeleteUser(false);
            setSelectedUser(null);
          }}
          onConfirm={async () => {
            try {
              await deleteUserAPI(selectedUser._id).unwrap();
              refetch();
              setDeleteUser(false);
              setSelectedUser(null);
            } catch (err) {
              dispatch(setAuthError(err?.data?.message || "Delete failed"));
            }
          }}
        />
      )}
    </div>
  );
}

export default RolesTable;
