import { Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

import { ITodo } from "typescript/interface";

function getTodos(): any {
  let todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  return todos
}

let todos: ITodo[] = getTodos();
let ORDER_BY = "oldest"

const socketListeners = (socket: Socket) => {

  socket.on("get_todos", () => {

    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
    socket.emit("order_by", ORDER_BY)
  })

  socket.on("add_todo", (text) => {
    if (!text || text.length < 5) return;
    todos = [...todos, { text, done: false, id: uuidv4(), time: Date.now() / 1000 }]
    fs.writeFileSync("todos.json", JSON.stringify(todos))
    const orderedTodos = orderTodos(ORDER_BY)
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("remove_todo", (id) => {
    todos = todos.filter(todo => todo.id !== id)
    const orderedTodos = orderTodos(ORDER_BY)
    fs.writeFileSync("todos.json", JSON.stringify(orderedTodos))
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
    fs.writeFileSync("todos.json", JSON.stringify(todos))
    socket.emit("updated_todos", todos, ORDER_BY)
  })

  socket.on("edit_todo", (id, newText) => {
    console.log(id, newText)
    todos = todos.map(todo => {
      if (todo.id === id) {
        todo.text = newText
        todo.time = Date.now() / 1000
      }
      return todo
    })
    const orderedTodos = orderTodos(ORDER_BY)
    fs.writeFileSync("todos.json", JSON.stringify(orderedTodos))
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("remove_done_todos", () => {
    todos = todos.filter(todo => !todo.done)
    const orderedTodos = orderTodos(ORDER_BY)
    fs.writeFileSync("todos.json", JSON.stringify(orderedTodos))
    socket.emit("updated_todos", orderedTodos, ORDER_BY)
  })

  socket.on("order_by_time", (orderBy) => {
    ORDER_BY = orderBy
    const orderedTodos = orderTodos(ORDER_BY)
    todos = [...orderedTodos]
    fs.writeFileSync("todos.json", JSON.stringify(todos))
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

export default socketListeners;