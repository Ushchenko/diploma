import "./Home.scss"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBooksGPT, fetchBooksGoogle } from "../../redux/slices/books"
import { Carousel } from "../../components/Сarousel"
import { SearchForm } from "../../components/SearchForm"

export const Home = () => {
  const oneDayInMs = 24 * 60 * 60 * 1000

  const dispatch = useDispatch()
  const booksState = useSelector((state) => state.books?.books || { items: [], status: 'loading' })
  const { items, status } = booksState
  const [isLoading, setIsLoading] = React.useState(false)

  const [prompt, setPrompt] = React.useState("Якісь цікаві книги")
  const [googleBooks, setGoogleBooks] = React.useState(() => {
    const saved = localStorage.getItem("googleBooks")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.timestamp && Array.isArray(parsed.books)) {
          const isExpired = Date.now() - parsed.timestamp > oneDayInMs
          if (!isExpired) {
            return parsed.books;
          } else {
            localStorage.removeItem("googleBooks")
          }
        } else {
          localStorage.removeItem("googleBooks")
        }
      } catch (e) {
        console.error("Error parsing localStorage data:", e)
        localStorage.removeItem("googleBooks")
      }
    }
    return [];
  })



  React.useEffect(() => {
    if (googleBooks.length > 0) return

    dispatch(fetchBooksGPT(prompt))
  }, [dispatch, prompt])

  const parseBooksString = (booksString) => {
    return booksString
      .split(";")
      .map(entry => entry.trim())
      .filter(Boolean)
      .map(pair => {
        const [title, author] = pair.split("|").map(s => s.trim())
        return { title, author: [author] }
      });
  };

  React.useEffect(() => {
  const fetchGoogleBooks = async () => {
    if (googleBooks.length > 0) return
    if (!items?.data || typeof items.data !== "string") return

    setIsLoading(true)

    const parsed = parseBooksString(items.data)
    const results = []

    for (const book of parsed) {
      try {
        const res = await dispatch(fetchBooksGoogle(book))
        if (res.payload.data) {
          results.push(res.payload.data)
        }
      } catch (err) {
        console.error("Google Book fetch failed for:", book, err)
      }
    }

    setGoogleBooks(results);

    const dataToStore = {
      timestamp: Date.now(),
      books: results,
    };
    localStorage.setItem("googleBooks", JSON.stringify(dataToStore))

    setIsLoading(false)
  };

  fetchGoogleBooks()
}, [items, googleBooks.length, dispatch])

  return (
    <>
    <div className="book_list fullscreen__section">
      <SearchForm />
      {isLoading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <div className="carousel__container">
          <Carousel googleBooks={googleBooks.filter(book => book && book.title && book.imageLinks)} />
        </div>
      )}
    </div>
  </>
  )
}
