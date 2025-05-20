import { useSelector } from "react-redux";

import { SearchForm } from "../../components/SearchForm";
import { Carousel } from "../../components/Сarousel";

export const BooksResults = () => {
  const books = useSelector((state) => state.books.books.items);

  const validBooks = Array.isArray(books)
    ? books.filter(book => book && book.title && book.imageLinks)
    : [];

  return (
    <div className="book_list fullscreen__section">
      <SearchForm />
      <div className="carousel__container">
        <Carousel googleBooks={validBooks} />
      </div>
    </div>
  );
};
