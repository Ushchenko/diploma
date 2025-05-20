import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth"
import { booksReducer } from "./slices/books"
import { commentsReducer } from "./slices/comments"

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    comments: commentsReducer,
  }
})

export default store; 