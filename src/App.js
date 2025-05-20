import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { BooksResults } from "./pages/BookResult"
import { BookPage } from "./pages/BookPage";
import { FavBooksPage } from "./pages/FavBooksPage";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";

function App() {

  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books/finded" element={<BooksResults />} />
        <Route path="/books/favourite" element={<FavBooksPage />} />
        <Route path="/books/book/:isbn13" element={<BookPage />} />
        {/* element={<PersonalAccount />} */}
      </Routes>
    </>
  );
}

export default App;