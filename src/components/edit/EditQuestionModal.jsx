import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../../shared/Spinner";
import { setAuthError} from "../../redux/reducers/authSlice";
import { useUpdateQuestionMutation } from "../../redux/api/api";

function EditQuestionModal({ question, onClose, fetchCategories }) {
  const dispatch = useDispatch();

  const [questionName, setQuestionName] = useState("");
  const [questionLink1, setQuestionLink1] = useState("");
  const [questionLink2, setQuestionLink2] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionSolutionLink, setQuestionSolutionLink] = useState("");

  const [updateQuestion, { isLoading }] = useUpdateQuestionMutation();

  useEffect(() => {
    if (question) {
      setQuestionName(question.question_name);
      setQuestionLink1(question.question_link?.[0] || "");
      setQuestionLink2(question.question_link?.[1] || "");
      setQuestionDifficulty(question.question_difficulty || "Easy");
      setQuestionSolutionLink(question.question_solution || "");
    }
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedQuestion = {
      id: question._id,
      question_name: questionName,
      question_link: [questionLink1, questionLink2],
      question_difficulty: questionDifficulty,
      question_solution: questionSolutionLink,
    };

    try {
     await updateQuestion({ questionId: question._id, updatedData: updatedQuestion }).unwrap();
      dispatch(setAuthError("Successfully updated question"));
      fetchCategories();
      onClose();
    } catch (error) {
      dispatch(setAuthError(error?.data?.message || "Failed to edit question"));
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-8">
      <div className="w-8 h-8">{isLoading && <Spinner />}</div>
      <div className="bg-white dark:bg-gray-800 p-4 mt-2 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
          Edit Question
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2 sm:mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={questionName}
              onChange={(e) => setQuestionName(e.target.value)}
              className="input"
              placeholder="Question Name"
              required
            />
          </div>
          <div className="mb-2 sm:mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty <span className="text-red-500">*</span>
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
          </div>
          <div className="mb-2 sm:mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Link 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={questionLink1}
              onChange={(e) => setQuestionLink1(e.target.value)}
              className="input"
              placeholder="LeetCode Link"
              required
            />
          </div>
          <div className="mb-2 sm:mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Link 2
            </label>
            <input
              type="text"
              value={questionLink2}
              onChange={(e) => setQuestionLink2(e.target.value)}
              className="input"
              placeholder="Coding Ninjas Link"
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Solution Link <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={questionSolutionLink}
              onChange={(e) => setQuestionSolutionLink(e.target.value)}
              className="input"
              placeholder="Solution URL"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded shadow hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuestionModal;
