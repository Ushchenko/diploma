import { useState } from "react"
import "./Book.scss"
import { Link } from "react-router-dom"

export const Book = ({
  title,
  authors,
  imageLinks,
  isbn13
}) => {
  const [isbn13State, setisbn13State] = useState(isbn13)
  // console.log(isbn13State);

  return (
    <div className="book__card">
      <h3 className="card__tilte">{title}</h3>
      <div className="card__authors">{authors}</div>
      <div className="card__cover">
        {imageLinks?.small && <Link to={`/books/book/${isbn13State}`}><img src={imageLinks.small} alt={title} /></Link>}
      </div>
    </div>
  )
}