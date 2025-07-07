import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAddCategoryMutation,
  useAddQuestionMutation,
} from "../../redux/api/api";
import { setAuthError } from "../../redux/reducers/authSlice"; // or your error handler
import Spinner from "../../shared/Spinner";

function AddModal({ onClose, categories, selectedCategory, fetchCategories }) {
  const dispatch = useDispatch();

  const [addCategory] = useAddCategoryMutation();
  const [addQuestion] = useAddQuestionMutation();

  const [selectedOption, setSelectedOption] = useState(
    selectedCategory ? "question" : "category"
  );
  const [optedCategory, setOptedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryResource, setCategoryResource] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("Easy");
  const [questionLink1, setQuestionLink1] = useState("");
  const [questionLink2, setQuestionLink2] = useState("");
  const [solutionLink, setSolutionLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionChange = (e) => setSelectedOption(e.target.value);
  const handleCategoryChange = (e) => setOptedCategory(e.target.value);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (selectedOption === "category") {
        await addCategory({
          category_name: categoryName,
          category_resources: categoryResource,
        }).unwrap();
        dispatch(setAuthError(`Added Category ${categoryName}`));
      } else {
        await addQuestion({
          question_name: questionName,
          question_link: [questionLink1, questionLink2],
          question_difficulty: questionDifficulty,
          question_solution: solutionLink,
          categoryId: optedCategory || selectedCategory._id,
        }).unwrap();
        dispatch(setAuthError("Successfully added question"));
      }

      fetchCategories(); // refresh list
      onClose(); // close modal
    } catch (error) {
      dispatch(
        setAuthError(error?.data?.message || error.message || "Operation failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryFields = () => (
    <>
      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Category Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Category Name"
        className="input"
        required
      />

      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Category Resource <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={categoryResource}
        onChange={(e) => setCategoryResource(e.target.value)}
        placeholder="Category Resource"
        className="input"
        required
      />
    </>
  );

  const renderQuestionFields = () => (
    <>
      {!selectedCategory && (
        <>
          <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            value={optedCategory}
            onChange={handleCategoryChange}
            className="input"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </>
      )}

      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Question Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={questionName}
        onChange={(e) => setQuestionName(e.target.value)}
        placeholder="Question Name"
        className="input"
        required
      />

      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Question Difficulty <span className="text-red-500">*</span>
      </label>
      <select
        value={questionDifficulty}
        onChange={(e) => setQuestionDifficulty(e.target.value)}
        className="input"
        required
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Question Link 1 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={questionLink1}
        onChange={(e) => setQuestionLink1(e.target.value)}
        placeholder="LeetCode Link"
        className="input"
        required
      />

      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Question Link 2
      </label>
      <input
        type="text"
        value={questionLink2}
        onChange={(e) => setQuestionLink2(e.target.value)}
        placeholder="CodeNest Link"
        className="input"
      />

      <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">
        Solution Link <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={solutionLink}
        onChange={(e) => setSolutionLink(e.target.value)}
        placeholder="Solution Link"
        className="input"
        required
      />
    </>
  );

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-8 h-8">{isLoading && <Spinner />}</div>
      <div className="bg-white dark:bg-gray-800 mt-2 p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-lg font-semibold my-2 text-center text-gray-900 dark:text-gray-100">
          Add New
        </h2>

        {!selectedCategory && (
          <div className="flex justify-center gap-4 mb-4">
            <label className="text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="option"
                value="category"
                checked={selectedOption === "category"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Category
            </label>
            <label className="text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="option"
                value="question"
                checked={selectedOption === "question"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Question
            </label>
          </div>
        )}

        {selectedOption === "category" && renderCategoryFields()}
        {selectedOption === "question" && renderQuestionFields()}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddModal;


