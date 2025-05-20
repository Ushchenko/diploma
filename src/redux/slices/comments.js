import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios.js'

export const fetchCommentsByTitle = createAsyncThunk("comments/fetch-all-comments", async (title) => {
  console.log("req.title: ", title);
  console.log("get request: ", `/book/all-comments?title=${encodeURIComponent(title)}`);
  const response = await axios.get(`/book/all-comments?title=${encodeURIComponent(title)}`);
  return response.data;
})

export const deleteCommentById = createAsyncThunk("comments/delete-comment", async ({ commentId, title }) => {
  await axios.delete("/book/remove-comment", { data: { commentId } });
  return title;
});

const initialState = {
  comments: {
    items: [],
    status: 'idle'
  }
}

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByTitle.pending, (state) => {
        state.comments.status = 'loading'
      })
      .addCase(fetchCommentsByTitle.fulfilled, (state, action) => {
        state.comments.items = action.payload
        state.comments.status = 'loaded'
      })
      .addCase(fetchCommentsByTitle.rejected, (state) => {
        state.comments.status = 'failed'
      })
      .addCase(deleteCommentById.fulfilled, (state, action) => {
        state.comments.status = 'loaded'
      })
  }
})

export const commentsReducer = commentsSlice.reducer