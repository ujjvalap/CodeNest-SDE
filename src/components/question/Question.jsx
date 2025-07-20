
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { useSelector, useDispatch } from "react-redux";

import logo from "../../assets/Logo.png";
import { useUpdateQuestionStatusMutation } from "../../redux/api/api";
import { setAuthError } from "../../redux/reducers/authSlice";

function Question({
  question,
  Status,
  updateNote,
  notes,
  setCategoryDone,
  refetchResponses,
}) {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.user.userType);

  const [status, setStatus] = useState(Status);
  const [prevStatus, setPrevStatus] = useState(Status);
  const [updateQuestionStatus] = useUpdateQuestionStatusMutation();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await updateQuestionStatus({ qid: question._id, status: newStatus }).unwrap();
      if (refetchResponses) refetchResponses();
    } catch (error) {
      dispatch(setAuthError(error?.data?.message || "Error updating status"));
    }
  };

  useEffect(() => {
    if (status !== prevStatus) {
      if (prevStatus === "Pending" && status === "Completed") {
        setCategoryDone((prev) => prev + 1);
      } else if (prevStatus === "Completed" && (status === "Pending" || status === "Revisit")) {
        setCategoryDone((prev) => prev - 1);
      } else if (prevStatus === "Revisit" && status === "Completed") {
        setCategoryDone((prev) => prev + 1);
      }
      setPrevStatus(status);
    }
  }, [status, prevStatus, setCategoryDone]);

  const getRowColor = () => {
    switch (status) {
      case "Revisit":
        return "bg-yellow-100 dark:bg-orange-700 hover:bg-yellow-200 dark:hover:bg-orange-800";
      case "Completed":
        return "bg-green-200 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700";
    }
  };

  return (
    <tr className={`border-b transition duration-300 dark:border-gray-700 ${getRowColor()}`}>
      {/* Status Dropdown */}
      <td className="px-4 sm:px-6 py-4">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={userType === "Guest"}
          className="border rounded px-2 py-1 bg-white dark:bg-gray-200 dark:text-gray-800 dark:border-gray-400"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Done</option>
          <option value="Revisit">Revisit</option>
        </select>
      </td>

      {/* Question Name */}
      <td className="px-4 sm:px-6 py-4 font-medium text-base sm:text-xl text-gray-900 dark:text-white">
        {question.question_name}
      </td>

      {/* Difficulty */}
      <td className="px-4 sm:px-6 py-4 font-medium text-base sm:text-xl text-gray-900 dark:text-white">
        {question.question_difficulty}
      </td>

      {/* Links */}
      <td className="px-4 sm:px-6 py-4 flex justify-between">
        <a
          className="dark:text-gray-100 hover:text-black text-gray-600 text-2xl"
          href={question.question_link[0]}
          target="_blank"
          rel="noopener noreferrer"
          title="LeetCode Link"
        >
          <Icon icon="simple-icons:leetcode" />
        </a>
        <a
          className="dark:text-gray-100 hover:text-black text-gray-600 text-xl"
          href={question.question_link[1]}
          target="_blank"
          rel="noopener noreferrer"
          title="Video Link"
        >
          <img src={logo} alt="Video" className="w-8 h-8" />
        </a>
      </td>

      {/* Solution */}
      <td className="px-4 sm:px-6 py-4">
        <a
          className="dark:text-gray-100 hover:text-black text-gray-600 sm:text-2xl text-xl"
          href={question.question_solution}
          target="_blank"
          rel="noopener noreferrer"
          title="Solution"
        >
          <Icon icon="streamline:ecology-science-erlenmeyer-flask-experiment-lab-flask-science-chemistry-solution" />
        </a>
      </td>

      {/* Notes */}
      <td className="px-4 sm:px-6 py-4 text-base sm:text-xl">
        <button
          className="dark:text-gray-100 text-gray-600 hover:text-black sm:text-2xl text-xl"
          onClick={() => updateNote(notes, question._id)}
          disabled={userType === "Guest"}
          style={{ cursor: userType === "Guest" ? "not-allowed" : "pointer" }}
          title={userType === "Guest" ? "Login to access all features" : "Add Notes"}
        >
          <Icon icon="icon-park-outline:notes" />
        </button>
      </td>
    </tr>
  );
}

export default Question;
