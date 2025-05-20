// src/components/Comments.jsx
import "./Comments.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentById, fetchCommentsByTitle } from "../../redux/slices/comments";
import axios from "../../axios";
import { selectIsAuth } from "../../redux/slices/auth";

export const Comments = ({ bookTitle, authors }) => {
  const dispatch = useDispatch()
  const [commentText, setCommentText] = useState("")
  const maxLength = 500
  const isAuth = useSelector(selectIsAuth)
  const currentUserId = useSelector((state) => state.auth.data?._id)

  const comments = useSelector((state) => state.comments.comments.items)
  const commentsStatus = useSelector((state) => state.comments.comments.status)

  const handleSubmitComment = async () => {
    try {
      await axios.post("/book/leave-comment", {
        title: bookTitle,
        authors,
        text: commentText,
      });

      setCommentText("");
      dispatch(fetchCommentsByTitle(bookTitle))
    } catch (err) {
      console.error("Failed to submit comment", err)
      alert("Failed to submit comment")
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return
    try {
      await dispatch(deleteCommentById({ commentId, title: bookTitle }))
      dispatch(fetchCommentsByTitle(bookTitle))
    } catch (err) {
      alert("Failed to delete comment")
      console.error(err)
    }
  }

  return (
    <div className="page__comments">
      <h3>Comments</h3>
      <div className="comment__form">
        <h4>Leave a Comment</h4>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={maxLength}
          rows={4}
          placeholder="Write your comment here..."
        />
        <div className="char__counter">
          {commentText.length}/{maxLength}
        </div>
        <button onClick={handleSubmitComment} disabled={commentText.length === 0}>
          Submit
        </button>
      </div>
      {commentsStatus === "loading" && <p>Loading comments...</p>}
      {commentsStatus === "failed" && <p>Failed to load comments.</p>}
      {comments.length === 0 && commentsStatus === "loaded" && <p>No comments yet.</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.user?.login || "Anonymous"}:</strong> {comment.text}
            {isAuth && comment.user?._id === currentUserId && (
              <button onClick={() => handleDelete(comment._id)} className="delete__btn">Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
