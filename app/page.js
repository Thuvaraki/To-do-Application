"use client"; //by default next.js is server side rendering, If we want to render(useState like that) from client side then we have to use "use client"
import Todo from "./components/Todo";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((form) => ({ ...form, [name]: value }));
    console.log(formData);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault(); //When we click on the button, It won't refresh the web page
    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.msg);
      setFormData({
        title: "",
        description: "",
      });
      await fetchTodos();
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const fetchTodos = async () => {
    const response = await axios.get("/api");
    setTodoData(response.data.todos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete("/api", {
        params: {
          mongoId: id,
        },
      });
      toast.success(response.data.msg);
      fetchTodos();
    } catch (error) {
      toast.error("Error deleting todo");
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await axios.put(
        "/api",
        {},
        {
          params: {
            mongoId: id,
          },
        }
      );
      // toast.success(response.data.msg);
      fetchTodos();
    } catch (error) {
      toast.error("Error updating todo");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <form
        onSubmit={onSubmitHandler}
        className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Enter Title"
          className="px-3 py-2 border-2 w-full"
          onChange={onChangeHandler}
        />
        <textarea
          name="description"
          placeholder="Enter description"
          value={formData.description}
          className="px-3 py-2 border-2 w-full"
          onChange={onChangeHandler}
        ></textarea>
        <button type="submit" className="bg-gray-600 py-2 px-8 text-white">
          Add Todo
        </button>
      </form>

      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((item, index) => {
              return (
                <Todo
                  key={index}
                  id={index + 1}
                  mongoId={item._id}
                  title={item.title}
                  description={item.description}
                  complete={item.isCompleted}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
