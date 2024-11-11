import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const result = await response.json();
    return result.slice(0, 10);
  }
);

export const editTodoAsync = createAsyncThunk(
  'todos/editTodoAsync',
  async ({ id, updates }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    return { id, ...result };
  }
);

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodoAsync',
  async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

const initialState = [];

const TodoSlice = createSlice({
  name: 'Todo',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(editTodoAsync.fulfilled, (state, action) => {
        const index = state.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state[index] = { ...state[index], ...action.payload };
        }
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        return state.filter(todo => todo.id !== action.payload);
      });
  }
});

export const { addTodo, deleteTodo, editTodo } = TodoSlice.actions;
export default TodoSlice.reducer;
