import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  useGetAllDataQuery,
  useGetAllCategoriesQuery,
} from "../../redux/api/api";

import { setProgress, setAuthError } from "../../redux/reducers/authSlice";
import Spinner from "../../shared/Spinner";
import Category from "../categriy/Category";
import HorizontalProgressBar from "../progress/HorizontalProgressBar";

function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userType = useSelector((state) => state.user.userType);

  const {
    data: allData,
    error: allDataError,
    isLoading: allDataLoading,
    isSuccess: allDataSuccess,
  } = useGetAllDataQuery(undefined, {
    skip: userType === "Guest" || !userType,
  });

  const {
    data: guestData,
    error: guestError,
    isLoading: guestLoading,
    isSuccess: guestSuccess,
  } = useGetAllCategoriesQuery(undefined, {
    skip: userType !== "Guest",
  });

  // Data selection based on userType
  const data = userType === "Guest" ? guestData?.data : allData?.data;
  const userResponses =
    userType === "Guest" ? {} : allData?.responses || {};
  const error = userType === "Guest" ? guestError : allDataError;
  const isLoading = userType === "Guest" ? guestLoading : allDataLoading;
  const isSuccess = userType === "Guest" ? guestSuccess : allDataSuccess;

  const { Total_Questions, Questions_done, Total_percentage } =
    userResponses?.Total_values || {};

  useEffect(() => {
    dispatch(setProgress(25));

    if (error) {
      dispatch(setProgress(100));
      dispatch(setAuthError(error?.data?.message || "Error fetching data"));

      if (
        error?.data?.message === "Session Expired" ||
        error?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }
    }

    if (isSuccess) {
      dispatch(setProgress(100));
    }
  }, [error, isSuccess, dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="text-center py-2">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container max-w-full px-4 pt-7 pb-4 w-full relative">
      {userResponses?.Total_values && (
        <div className="pb-6">
          <HorizontalProgressBar
            percentage={Total_percentage || 0}
            done={Questions_done || 0}
            total={Total_Questions}
          />
        </div>
      )}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center sm:justify-items-stretch">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((element) => (
              <div key={element._id}>
                <Category category={element} userResponses={userResponses} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No categories available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
