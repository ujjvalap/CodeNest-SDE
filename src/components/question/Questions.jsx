import React, { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Spinner from "../../shared/Spinner";
import Question from "../question/Question";
import HorizontalProgressBar from "../progress/HorizontalProgressBar";

import {
  useGetCategoryDataQuery,
  useGetCategoryDataGuestQuery,
  useGetCategoryResponsesQuery,
  useAddQuestionNoteMutation,
} from "../../redux/api/api";

import { setAuthError, setProgress } from "../../redux/reducers/authSlice";

function Questions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.user.userType);

  const [note, setNote] = useState({ id: "", vnotes: "" });
  const [openModal, setOpenModal] = useState(false);
  const [categoryDone, setCategoryDone] = useState(0);

  const guestQuery = useGetCategoryDataGuestQuery(id);
  const userQuery = useGetCategoryDataQuery(id);

  const { data: catData, isLoading, isError } =
    userType === "Guest" ? guestQuery : userQuery;

  const {
    data: catRes = {},
    refetch: refetchResponses,
    isLoading: loadingResponses,
  } = useGetCategoryResponsesQuery(id, {
    skip: userType === "Guest",
  });

  const [addNote] = useAddQuestionNoteMutation();

  useEffect(() => {
    if (isLoading || loadingResponses) {
      dispatch(setProgress(50));
    } else {
      dispatch(setProgress(100));
    }
  }, [isLoading, loadingResponses, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(setAuthError("Failed to fetch category data"));
      navigate("/");
    }
  }, [isError, dispatch, navigate]);

  useEffect(() => {
    if (catRes?.categoryDone) {
      setCategoryDone(catRes.categoryDone);
    }
  }, [catRes]);

  const questions = catData?.questions || [];
  const { Modified_Questions = [], categoryQuestions = 0 } = catRes;

  const updateNote = (currentNote, qid) => {
    setNote({ id: qid, vnotes: currentNote?.Question_Notes || "" });
    setOpenModal(true);
  };

  const handleSubmission = async () => {
    try {
      await addNote({ qid: note.id, notes: note.vnotes }).unwrap();
      setOpenModal(false);
      setNote({ id: "", vnotes: "" });
      refetchResponses();
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || "Failed to update note"));
    }
  };

  if (isLoading || loadingResponses) {
    return (
      <div className="text-center py-2">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-full w-full relative px-4 pt-2 pb-4">
      {/* Notes Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-2 dark:text-white">Edit Note</h2>
            <textarea
              name="vnotes"
              value={note.vnotes}
              onChange={(e) => setNote({ ...note, vnotes: e.target.value })}
              className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmission}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center pb-4">
          <a
            href={catData?.category_resources?.[0] || "#"}
            target="_blank"
            rel="noreferrer"
            className="text-red-600"
          >
            <FaYoutube className="text-2xl" />
          </a>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-white">
            {catData?.category_name || "Category"}
          </h1>
          <div className="w-6" />
        </div>
        <HorizontalProgressBar done={categoryDone} total={categoryQuestions} />
      </div>

      {/* Questions Table */}
      <div className="overflow-auto max-h-svh mb-10">
        <table className="w-full text-sm text-left border border-gray-300 dark:border-gray-600 rounded-lg">
          <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Problem</th>
              <th className="px-6 py-3">Difficulty</th>
              <th className="px-6 py-3">Links</th>
              <th className="px-6 py-3">Solution</th>
              <th className="px-6 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((element) => {
              const ModifiedQuestion = Modified_Questions.find(
                (item) => item.Question_id === element._id
              );
              const status = ModifiedQuestion?.Question_Status || "Pending";
              return (
                <Question
                  key={element._id}
                  question={element}
                  updateNote={updateNote}
                  notes={ModifiedQuestion}
                  Status={status}
                  cid={id}
                  categoryDone={categoryDone}
                  setCategoryDone={setCategoryDone}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Questions;
