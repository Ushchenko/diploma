import { useEffect, useState } from "react"
import "./FavBooksPage.scss"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllBooks, fetchBooksGoogle } from "../../redux/slices/books"
import axios from "../../axios";
import { SearchForm } from "../../components/SearchForm"
import { Link } from "react-router-dom"

export const FavBooksPage = () => {
  const dispatch = useDispatch()
  const { items, status } = useSelector(state => state.books.favBooks)
  const isFavBooksLoading = status === 'loading'

  const [googleBooks, setGoogleBooks] = useState([])
  const [likedBooks, setLikedBooks] = useState({})

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await dispatch(fetchAllBooks()).unwrap()
        const results = []
        const likedMap = {}

        for (const book of data) {
          const res = await dispatch(fetchBooksGoogle({ isbn: book.isbn })).unwrap()
          if (res?.data) {
            results.push(res.data)

            const likeRes = await axios.get(`/book-is-liked/${book.isbn}`)
            likedMap[book.isbn] = likeRes.data.liked
          }
        }

        setGoogleBooks(results)
        setLikedBooks(likedMap)

      } catch (err) {
        console.error(err)
      }
    }

    fetchBooks()
  }, [dispatch])

  const handleLikeToggle = async (isbn13, isLiked) => {
    try {
      if (isLiked) {
        await axios.delete(`/book-remove-from-fav/${isbn13}`)
      } else {
        await axios.post(`/book-like`, { isbn: isbn13 })
      }

      setLikedBooks(prev => ({
        ...prev,
        [isbn13]: !isLiked
      }))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <SearchForm />
      <div className="book__grid">
        {isFavBooksLoading ? (
          <p>Loading...</p>
        ) : (
          googleBooks.map((book, index) => {
            const isLiked = likedBooks[book.isbn13]

            return (
              <div className="book__card" key={index}>
                <h3 className="card__title">{book.title}</h3>
                <div className="card__author">{book.authors?.join(", ")}</div>
                <div className="card__cover">
                  {book.imageLinks?.small && (
                    <Link to={`/books/book/${book.isbn13}`}><img src={book.imageLinks.small} alt={book.title} /></Link>
                  )}
                </div>
                <div className="card__actions">
                  <button onClick={() => handleLikeToggle(book.isbn13, isLiked)}>
                    {isLiked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                        <path
                          d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-bookmark" viewBox="0 0 16 16">
                        <path
                          d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
