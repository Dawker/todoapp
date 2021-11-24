import { Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid';

import { ITodo } from "typescript/interface";


let todos: ITodo[] = [];
let ORDER_BY = "oldest"

const socketLinesers = (socket: Socket) => {

  socket.on("get_todos", () => {
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
    socket.emit("order_by", ORDER_BY)
  })

  socket.on("add_todo", (text) => {
    if (!text || text.length < 5) return;
    todos = [...todos, { text, done: false, id: uuidv4(), time: Date.now() / 1000 }]
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("remove_todo", (id) => {
    todos = todos.filter(todo => todo.id !== id)
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("set_todo_done", (id) => {
    // todos[id].done = !todos[id].done
    todos = todos.map(todo => {
      if (todo.id === id) {
        todo.done = !todo.done
      }
      return todo
    })
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("edit_todo", (id, newText) => {
    console.log(id, newText)
    todos = todos.map(todo => {
      if (todo.id === id) {
        todo.text = newText
      }
      return todo
    })
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("remove_done_todos", () => {
    todos = todos.filter(todo => !todo.done)
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("order_by_time", (orderBy) => {
    ORDER_BY = orderBy
    const orderedTodos = orderTodos(ORDER_BY)
    todos = orderedTodos
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

};


function orderTodos(orderBy: string) {
  let orderedTodos = todos.sort((a, b) => {
    if (orderBy === "newest") {
      return b.time - a.time
    } else {
      return a.time - b.time
    }
  })
  return orderedTodos

}

export default socketLinesers;