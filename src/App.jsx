import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos , addTodo , editTodoAsync , deleteTodoAsync} from './slice/TodoSlice';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.todo);
  const [todoInput, setTodoInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
console.log(data);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (todoInput.trim()) {
      const newTodo = {
        id: data.length > 0 ? Math.max(...data.map(todo => todo.id)) + 1 : 1,
        title: todoInput,
        completed: false,
      };
      dispatch(addTodo(newTodo));
      setTodoInput("");
    }
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodoAsync(id));
  };

  const handleToggleComplete = (id) => {
    const todo = data.find(todo => todo.id === id);
    if (todo) {
      dispatch(editTodoAsync({ id, updates: { completed: !todo.completed } }));
    }
  };

  console.log(todoInput);

  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditSubmit = (id) => {
    if (editingTitle) {
      dispatch(editTodoAsync({ id, updates: { title: editingTitle } }));
      setEditingId(null);
      setEditingTitle("");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <main className="text-center">
        <header>
          <h2>To-Do List</h2>
        </header>

        <section className="mb-3" style={{ width: '900px' }}>
          <div className="input-group">
            <input 
              className="form-control bg-body-tertiary" 
              type="text" 
              placeholder='Add a new To-do'
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <Button onClick={handleAddTodo} variant="success">Add</Button>
          </div>
        </section>

        <section style={{ overflowY: "auto", width: '900px', height: "400px" }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>No.</th>
                <th>Todo item</th>
                <th>Completed</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((todo,index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td style={{ textAlign: "left"}}>
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        style={{ width:"500px" }} 
                      />
                    ) : (
                     todo.title
                    )}
                  </td>
                  <td>
                    <input 
                      className='mt-2'
                      type='checkbox' 
                      checked={todo.completed} 
                      onChange={() => handleToggleComplete(todo.id)} 
                    />
                  </td>
                  <td>
                    {editingId === todo.id ? (
                      <Button onClick={() => handleEditSubmit(todo.id)} variant="success">Save</Button>
                    ) : (
                      <Button onClick={() => handleEditClick(todo)} variant="primary">Edit</Button>
                    )}
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteTodo(todo.id)}>
                      <i className="bi bi-trash3"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
