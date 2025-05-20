import "./BookPage.scss"

import axios from "../../axios";

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

import { Link } from "react-router-dom";
import { Comments } from "../../components/Comments";

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SearchForm } from "../../components/SearchForm"
import { fetchCommentsByTitle } from "../../redux/slices/comments";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";

export const BookPage = () => {
  const dispatch = useDispatch();

  const { isbn13 } = useParams();

  const isAuth = useSelector(selectIsAuth);
  const [book, setBook] = useState(null);
  const [liked, setLiked] = useState();
  const [commentText, setCommentText] = useState('');
  const maxLength = 500;

  const comments = useSelector(state => state.comments.comments.items);
  const commentsStatus = useSelector(state => state.comments.comments.status);

  // console.log(isbn13);
  // console.log(comments);

  const handleAddToFavorites = async () => {
    try {
      if (!isbn13) {
        return
      }

      await axios.post("/book-like", { isbn: isbn13 });

      setLiked(true);
      alert("Книга додана до улюблених!");
    } catch (err) {
      if (err.response && err.response.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("An error occurred while saving the book.");
      }
      console.error(err);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      await axios.delete(`/book-remove-from-fav/${isbn13}`);

      setLiked(false);
      alert("Книга видаленна з улюблених.");
    } catch (err) {
      console.error(err);
      alert("Failed to remove book from favorites.");
    }
  };

  const handleSubmitComment = async () => {
    try {
      await axios.post("/book/leave-comment", {
        title: book.title,
        authors: book.authors,
        text: commentText,
      });

      setCommentText("");
      dispatch(fetchCommentsByTitle(book.title));
    } catch (err) {
      console.error("Failed to submit comment", err);
      alert("Failed to submit comment");
    }
  };

  useEffect(() => {
    const fetchBookAndLikeStatus = async () => {
      try {
        const response = await axios.post("/find-books-google", { isbn: isbn13 });
        const bookData = response.data.data || null;
        setBook(bookData);

        if (isAuth) {
          const likeRes = await axios.get(`/book-is-liked/${isbn13}`);
          setLiked(likeRes.data.liked);
        }

        if (bookData?.title) {
          // console.log(bookData.title)
          dispatch(fetchCommentsByTitle(bookData.title))
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchBookAndLikeStatus();
  }, [isbn13]);

  // console.log(book);

  if (!book) return <div>Loading or book not found...</div>;

  const info = book;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <>
      <SearchForm />
      <div className="book__page">
        <div className="page__cover">
          <Link to={info.infoLink}><img src={info.imageLinks?.small} alt={info.title} /></Link>
          {info.averageRating && (
            <div className="rating">
              {renderStars(info.averageRating)}
            </div>
          )}
        </div>

        <div className="page__meta">
          <div className="text__title">{info.title}</div>
          <div className="text__authors"><strong>Authors:</strong> {info.authors?.join(', ')}</div>
          <div className="text__categories"><strong>Genre:</strong> {info.categories?.join(', ') || 'N/A'}</div>
          <div className="text__published"><strong>Published:</strong> {info.publishedDate?.slice(0, 4) || 'N/A'}</div>

          {
            liked
              ?
              <button className="favourite__button" onClick={handleRemoveFromFavorites}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />

                </svg>
              </button>
              :
              <button className="favourite__button" onClick={handleAddToFavorites}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                </svg>
              </button>
          }
        </div>

        <div className="page__content">
          <div className="page__description">
            {info.description || 'No description available.'}
          </div>

          <Comments bookTitle={info.title} authors={info.authors} />

        </div>
      </div>
    </>
  );
}