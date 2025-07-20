import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CircularProgressBar from "../progress/CircularProgressBar";

function Category({ category, userResponses }) {
  // Memoize derived values for performance
  const { categoryQuestions, categoryDone, categoryPercentage } = useMemo(() => {
    const category_name = category?.category_name;
    const categoryValues = userResponses?.category_values || {};
    const categoryData = categoryValues[category_name] || {};
    return {
      categoryQuestions: categoryData.categoryQuestions || 0,
      categoryDone: categoryData.categoryDone || 0,
      categoryPercentage: typeof categoryData.categoryPercentage === 'number' ? categoryData.categoryPercentage : 0,
    };
  }, [category, userResponses]);

  return (
    <Link to={`/${category?._id || "#"}`} title={`Solve ${category?.category_name || "Category"} questions`}>
      <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 transform transition-transform hover:scale-105 hover:z-50 hover:dark:border-gray-300 hover:border-gray-300 hover:shadow-lg hover:cursor-pointer">
        <div className="flex justify-between">
          <div>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {category?.category_name || "Category"}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Total Number of Questions: {categoryQuestions}
            </p>
          </div>
          <div>
            <div className="flex-col items-center mb-3">
              <CircularProgressBar percentage={categoryPercentage} />
              <span className="ml-2 text-gray-800 dark:text-white">
                {categoryDone}/{categoryQuestions}
              </span>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600">
          Solve Now
        </div>
      </div>
    </Link>
  );
}


Category.propTypes = {
  category: PropTypes.object.isRequired,
  userResponses: PropTypes.object,
};

export default Category;





