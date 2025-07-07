import React, { useState, useCallback, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import EditCategoryModal from "../edit/EditCategoryModal";
import EditQuestionModal from "../edit/EditQuestionModal";
import ConfirmationModal from "../../shared/ConfirmationModal";
import AddModal from "../add_model/AddModal";
import Spinner from "../../shared/Spinner";

const CategoriesAccordion = ({ categories, fetchCategories, loadingCategories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subDropdowns, setSubDropdowns] = useState({});
  const [dropdowns, setDropdowns] = useState({});
  const [editCategory, setEditCategory] = useState(false);
  const [editQuestion, setEditQuestion] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const difficultyLevels = ["Easy", "Medium", "Hard"];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSubDropdown = useCallback((id) => {
    setSubDropdowns((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    setDropdowns((prevState) => {
      const updated = { ...prevState };
      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${id}`)) updated[key] = false;
      });
      return updated;
    });
  }, []);

  const toggleDropdown = useCallback((id) => {
    setDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const getFilteredQuestions = useCallback(
    (questions = []) => {
      return questions?.filter((q) =>
        q?.question_name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    },
    [searchTerm]
  );

  const getQuestionCount = useCallback(
    (questions = [], level) => {
      return getFilteredQuestions(questions).filter(
        (q) => q?.question_difficulty === level
      ).length;
    },
    [getFilteredQuestions]
  );

  const filteredCategories = useMemo(() => {
    return categories?.filter(
      (cat) =>
        cat?.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFilteredQuestions(cat?.questions).length > 0
    ) || [];
  }, [categories, searchTerm, getFilteredQuestions]);

  return (
    <div className="w-full lg:w-3/4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-600 transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-0">Categories</h2>

        {/* Search + Add */}
        <div className="relative w-full lg:w-1/3 flex items-center">
          <span className="absolute left-3 text-gray-500 dark:text-gray-300">
            <FaSearch />
          </span>
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Categories or Questions..."
            className="w-full pl-10 pr-10 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md"
          />
          {searchTerm && (
            <FaTimes
              onClick={() => setSearchTerm("")}
              className="absolute right-12 text-gray-500 cursor-pointer"
            />
          )}
          <button
            onClick={() => setAddModal(true)}
            className="ml-2 p-2 rounded-md bg-green-600 hover:bg-green-700 text-white shadow-md"
            title="Add Category or Question"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Show Spinner or No Results */}
      {filteredCategories.length === 0 ? (
        loadingCategories ? (
          <Spinner />
        ) : (
          <div className="text-gray-500 dark:text-gray-300">No Categories or Questions found</div>
        )
      ) : (
        filteredCategories.map((cat) => (
          <div key={cat._id} className="mb-4">
            <div
              onClick={() => toggleSubDropdown(cat._id)}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg cursor-pointer shadow-md"
            >
              <div className="flex items-center space-x-2">
                {subDropdowns[cat._id] ? <FaChevronUp /> : <FaChevronDown />}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {cat.category_name} ({getFilteredQuestions(cat.questions).length})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setEditCategory(true);
                  }}
                  className="text-blue-500 cursor-pointer"
                />
                <FaPlus
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setAddModal(true);
                  }}
                  className="text-green-500 cursor-pointer"
                />
                <FaTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setDeleteCategory(true);
                  }}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Questions */}
            {subDropdowns[cat._id] && (
              <div className="mt-3 ml-4">
                {difficultyLevels.map((level) => (
                  <div key={level} className="mb-2">
                    <div
                      onClick={() => toggleDropdown(`${cat._id}+${level}`)}
                      className="flex justify-between items-center bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-md cursor-pointer"
                    >
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {level} ({getQuestionCount(cat.questions, level)})
                      </span>
                      {dropdowns[`${cat._id}+${level}`] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>

                    {dropdowns[`${cat._id}+${level}`] && (
                      <div className="mt-2 ml-3 space-y-2">
                        {getFilteredQuestions(cat.questions)
                          .filter((q) => q.question_difficulty === level)
                          .map((q) => (
                            <div
                              key={q._id}
                              className="flex justify-between items-center bg-gray-100 dark:bg-gray-500 p-2 rounded-md"
                            >
                              <span className="text-sm text-gray-900 dark:text-white">
                                {q.question_name}
                              </span>
                              <div className="flex items-center gap-2">
                                <FaEdit
                                  onClick={() => {
                                    setSelectedQuestion(q);
                                    setEditQuestion(true);
                                  }}
                                  className="text-blue-500 cursor-pointer"
                                />
                                <FaTrash
                                  onClick={() => {
                                    setSelectedCategory(cat);
                                    setSelectedQuestion(q);
                                    setDeleteQuestion(true);
                                  }}
                                  className="text-red-500 cursor-pointer"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* ✅ Modals (with fetch refresh) */}
      {editCategory && (
        <EditCategoryModal
          category={selectedCategory}
          fetchCategories={fetchCategories}
          onClose={() => {
            setEditCategory(false);
            setSelectedCategory(null);
            fetchCategories(); // refresh after edit
          }}
        />
      )}

      {editQuestion && (
        <EditQuestionModal
          question={selectedQuestion}
          fetchCategories={fetchCategories}
          onClose={() => {
            setEditQuestion(false);
            setSelectedQuestion(null);
            fetchCategories(); // refresh after edit
          }}
        />
      )}

      {deleteCategory && (
        <ConfirmationModal
          message="Are you sure you want to delete this category?"
          selectedCategory={selectedCategory}
          fetchCategories={fetchCategories}
          onCancel={() => {
            setDeleteCategory(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {deleteQuestion && (
        <ConfirmationModal
          message="Are you sure you want to delete this question?"
          selectedCategory={selectedCategory}
          selectedQuestion={selectedQuestion}
          fetchCategories={fetchCategories}
          onCancel={() => {
            setDeleteQuestion(false);
            setSelectedQuestion(null);
          }}
        />
      )}

      {addModal && (
        <AddModal
          selectedCategory={selectedCategory}
          categories={categories}
          fetchCategories={fetchCategories}
          onClose={() => {
            setAddModal(false);
            setSelectedCategory(null);
            fetchCategories(); // ✅ refresh after adding
          }}
        />
      )}
    </div>
  );
};

export default CategoriesAccordion;
