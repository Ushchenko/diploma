import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios.js'

export const fetchBooksGPT = createAsyncThunk("find-books/fetchBooks", async (req) => {
  const { data } = await axios.post("/find-books", {
    prompt: req
  })

  return data
})

export const fetchBooksGoogle = createAsyncThunk("find-books-google/fetchBooksGoogle", async (req) => {
  if (req.isbn) {
    const response = await axios.post("/find-books-google", {
      isbn: req.isbn
    })
    return response.data
  }

  const response = await axios.post("/find-books-google", {
    title: req.title,
    author: req.author,
  })
  return response.data
})

export const fetchAllBooks = createAsyncThunk("fav-books/fetchAllBooks", async () => {
  const { data } = await axios.get("/book/all-books")
  return data
})

const initialState = {
  books: {
    items: [],
    status: "idle"
  },
  favBooks: {
    items: [],
    status: "loading"
  }
}

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books.items = action.payload
    },
    addBook: (state, action) => {
      state.books.items.push(action.payload)
    },
    clearBooks: (state) => {
      state.books.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksGPT.pending, (state) => {
        state.books.status = 'loading'
      })
      .addCase(fetchBooksGPT.fulfilled, (state, action) => {
        state.books.items = action.payload
        state.books.status = 'loaded'
      })
      .addCase(fetchBooksGPT.rejected, (state) => {
        state.books.items = []
        state.books.status = 'error'
      })
      .addCase(fetchBooksGoogle.pending, (state) => {
        state.books.status = 'loading'
      })
      .addCase(fetchBooksGoogle.fulfilled, (state, action) => {
        state.books.items = action.payload
        state.books.status = 'loaded'
      })
      .addCase(fetchBooksGoogle.rejected, (state) => {
        state.books.items = []
        state.books.status = 'error'
      })
      .addCase(fetchAllBooks.pending, (state) => {
        state.favBooks.status = 'loading'
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.favBooks.items = action.payload
        state.favBooks.status = 'loaded'
      })
  }
})

export const { setBooks, addBook, clearBooks } = booksSlice.actions;
export const booksReducer = booksSlice.reducer