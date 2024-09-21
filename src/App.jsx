import { useState } from "react";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

function App() {
  const [todos, setTodos] = useState([]);
  const [fileteredTodos, setFilteredTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error("Error while fetching the todos ", error);
    }
  };

  const getFilteredTodos = (searchTerm) => {
    const filteredTodoList = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(filteredTodoList);
    setFilteredTodos(filteredTodoList);
  };

  useEffect(() => {
    const getTodos = async () => {
      const todos = await fetchTodos();
      setTodos(todos);
      setFilteredTodos(todos);
    };
    getTodos();
  }, []);

  return (
    <>
      <h1>Todo List</h1>
      <Formik
        initialValues={{ searchTerm: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.searchTerm) {
            errors.searchTerm = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          getFilteredTodos(values.searchTerm);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="searchTerm" />
            <ErrorMessage name="email" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Search
            </button>
          </Form>
        )}
      </Formik>
      <ul>
        {fileteredTodos.length !== 0 ? (
          fileteredTodos.map((todo) => <li key={todo.id}>{todo.title}</li>)
        ) : (
          <li>No Todos found!</li>
        )}
      </ul>
    </>
  );
}

export default App;
