import React from "react";
import "./SearchForm.scss"

import { TextField, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooksGPT } from "../../redux/slices/books";
import { fetchBooksGoogle } from "../../redux/slices/books";
import { setBooks, clearBooks } from "../../redux/slices/books"
import { useNavigate } from "react-router-dom";

export const SearchForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const booksState = useSelector((state) => state.books?.books || { items: [], status: 'loading' })
  const booksItems = useSelector((state) => state.books.books.items);
  const { items, status } = booksState

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      prompt: '',
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    if (!booksItems) {
      navigate("/");
    }
  }, []);

  const parseBooksString = (booksString) => {
    console.log("BookString", booksString);
    return booksString
      .split(";")
      .map(entry => entry.trim())
      .filter(Boolean)
      .map(pair => {
        const [title, author] = pair.split("|").map(s =>
          s.trim().replace(/[.,;!?]+$/, "")
        );
        if (!title || !author) return null;
        return { title, author: [author] };
      })
      .filter(Boolean);
  };

  const onSubmit = async (data) => {
    try {
      const gptResult = await dispatch(fetchBooksGPT(data.prompt)).unwrap();
      // console.log(gptResult.data);
      const parsedBooks = parseBooksString(gptResult.data);
      // console.log("parsed book", parsedBooks);

      const results = [];

      for (const book of parsedBooks) {
        const res = await dispatch(fetchBooksGoogle(book));
        // console.log("res", res)
        // console.log("res: data", res.payload.data)
        if (res.payload.data) {
          results.push(res.payload.data);
          // console.log(results);
        }
      }

      
      // console.log("results : end", results);
      dispatch(setBooks(results));
      if (!results || results.length === 0) {
        alert("Книги не знайдено")
        console.error("Books not found")
        return
      }
      navigate("/books/finded");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('prompt', { required: 'Введіть запит' })}
        error={Boolean(errors.prompt?.message)}
        helperText={errors.prompt?.message}
        className='form__field'
        label="Пошук..."
        autoComplete="off"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" disabled={status === 'loading' || !isValid}>
                {status === 'loading' ? (
                  <CircularProgress size={20} />
                ) : (
                  <span><SearchIcon /></span>
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};