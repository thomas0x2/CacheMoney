import './Todo.css'
import {useEffect, useState} from "react";

export default function Todo() {
    const [todos, setTodos] = useState([]);
    const [textField, setTextField] = useState('');

    function updateTodos() {
        fetch(`/api/todos`)
            .then(response => response.json())
            .then(data => setTodos(data));
    }

    function deleteTodo(id) {
        fetch(`/api/todos/${id}`, {method: 'DELETE'})
            .then(() => updateTodos());
    }

    function createTodo() {
        fetch('/api/todos', {
            method: 'POST',
            body: JSON.stringify({title: textField}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                updateTodos();
                setTextField('');
            });
    }


    useEffect(() => {
        updateTodos();
    }, []);

    return (
        <main className="Todo">
            <h1>Todos</h1>
            <div>
                <input type="text" placeholder="Enter todo item" value={textField} onChange={(e) => setTextField(e.target.value)}/>
                <button onClick={createTodo}>Create Todo</button>
            </div>
            <table>
                <thead>
                <tr>
                        <th>No.</th>
                        <th>Item</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {todos.map((todo, index) => (
                    <tr key={todo.id}>
                        <td>{index + 1}</td>
                        <td>{todo.title}</td>
                        <td>
                            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
