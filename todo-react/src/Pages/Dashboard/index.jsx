/* This example requires Tailwind CSS v2.0+ */
import { LogoutIcon, PlusCircleIcon , TrashIcon} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useSignOut, useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

export default function Dashboard() {
  const signOut = useSignOut();
  const [todos, setTodos] = useState([]);
  const [filterredTodos, setFilterTodos] = useState([]);
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [newTodo, setNewTodo] = useState({Completed: false, Description: "", user: auth().id});
  const Headers = {
    headers: {
      Authorization: authHeader(),
    },
  };
  async function fetchData() {
    try {
      const { data } = await axios.get("/todos?Completed=true",Headers);
      setTodos(data);
      setFilterTodos(data)
    } catch (error) {
      console.log(error);
    }
  }

  function filetedTodos(status) {
    if(status !== undefined) {
      const filtered = todos.filter(  todo => todo.Completed === status)
      setFilterTodos(filtered)
    }else{
      setFilterTodos(todos)
    }
  }
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const resposne =  await axios.post("/todos", newTodo ,Headers);
    if(resposne.status === 200) {
      setTodos((oldTodo)=>{
        setFilterTodos([...oldTodo,resposne.data]);
        return [...oldTodo, resposne.data];
      })
      setNewTodo({Completed: false, Description: "", users_permissions_user: auth().id})
    } 
   
  }
  async function updateTodo(todo){
    todo.Completed = true;
    todo.users_permissions_user = auth().id;
    try {
      const response = await axios.put("/todos/" + todo.id,todo,Headers);
      if(response.status === 200) {
        setTodos((oldTodo)=>{
          const objIndex = oldTodo.findIndex((todoold => todo.id === todoold.id));
          oldTodo[objIndex] = response.data; 
          return oldTodo;
        })
        filetedTodos(false);
      } 
    }catch(error){
      console.log(error)
    }
  }
 async function deleteTodo(todo){
    try {
      const response = await axios.delete("/todos/" + todo.id,Headers);
      if(response.status === 200) {
         setFilterTodos((todoold) =>{
          const objIndex = todoold.findIndex((todoold => todo.id === todoold.id));
          todoold.splice(objIndex,1);
           return todoold;
         })
      }
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <div className="min-h-full">
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-700 rounded-b-md">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center justify-between w-full">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://cdn-icons.flaticon.com/png/512/359/premium/359268.png?token=exp=1635612186~hmac=dc12cb1ef3bbaa6c2941a29a6ba169f3"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden md:block">
                  
                  <div
                    className="ml-10 flex  items-center space-x-1 group"
                    onClick={() => signOut()}
                  >
                    <span className="mr-2 text-white">{ auth().username }</span>
                    <span className="text-white group-hover:text-gray-900 cursor-pointer">
                      Log out
                    </span>
                    <LogoutIcon
                      className="h-5 w-5 text-white group-hover:text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        <header>
          <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Todo's</h1>
          </div>
        </header>
        <div className="max-w-3xl mx-auto py-6 sm:px-4 lg:px-4 rounded shadow-md bg-gray-700 ">
          <form className="flex items-center" onSubmit={onSubmit}>
            <PlusCircleIcon
              onClick={onSubmit}
              type="submit"
              className="h-5 w-5 text-white cursor-pointer mr-2"
            />
            <input
              value= {newTodo.Description}
              className="w-full bg-transparent text-white focus:outline-none"
              placeholder="Create a new todo "
              onChange={(e)=>setNewTodo({...newTodo, Description: e.target.value})}
            />
          </form>
        </div>
        <main>
          <div className="max-w-3xl mx-auto px-2 rounded shadow-md bg-gray-700 mt-4 h-96 overflow-y-auto">
            {
            filterredTodos.map((todo, index) => {
              return (
                <div
                  key={index}
                  className="px-2 py-6 border-b-2 flex items-center"
                >
                  <div
                    className={
                      "h-5 w-5 border border-white rounded-full mr-2 cursor-pointer relative " +
                      (todo.Completed ? "bg-green-600" : "")
                    }
                  >
                   
                  </div>
                  <div className="flex justify-between w-full"><div className="text-white text-base">{todo.Description}</div>
                  <div className="flex items-center ">
                    { !todo.Completed ? <div className="bg-gray-500 text-white text-center p-1 rounded cursor-pointer hover:bg-gray-600" onClick={() => updateTodo(todo)}>Mark as completed</div>:""}
                    <TrashIcon className="ml-2 h-5 w-5 text-red-400 cursor-pointer" onClick={() => deleteTodo(todo)}/>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="max-w-3xl mx-auto px-2 rounded shadow-md bg-gray-700 mt-4">
            <div className="h-14 flex justify-between text-gray-500 items-center px-2">
              <div className="hover:text-white">{todos.length}{todos.length>1 ?" items":" item"} </div>
              <div className="text-gray-500 flex space-x-3">
                <div className="hover:text-white cursor-pointer" onClick={() =>filetedTodos(undefined)}>All</div>
                <div className="hover:text-white cursor-pointer" onClick={() =>filetedTodos(true)}>Completed</div>
                <div className="hover:text-white cursor-pointer" onClick={() => filetedTodos(false)}>Active</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
