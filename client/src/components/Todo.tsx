/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { io, Socket } from 'socket.io-client';
import { Container, } from "react-bootstrap"

import TodoForm from "./TodoForm";
import { ITodo } from "./typescript/interface";

const ENDPOINT = "http://localhost:5000";

const Todo = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null)
  const [orderBy, setOrderby] = useState<string>('oldest')


  useEffect(() => {
    const sk = io(ENDPOINT, { transports: ['websocket'] });
    setSocket(sk)

    sk.emit("get_todos")
    // gettings the todos from the server
    sk.on('updated_todos', (todos: ITodo[], orderTodosBy: string) => {
      setTodos(todos)
      setOrderby(orderTodosBy)
    })

    return () => {
      sk?.off("get_todos")
      sk?.off("updated_todos")
    }

  }, []);


  return (
    <div className="mx-1">
      <Container className="border border-3 border-light mt-5 p-3">
        <h1 className="text-center mb-5">What do i need to do Today</h1>
        <TodoForm orderBy={orderBy} todos={todos} socket={socket!} />
      </Container>
    </div>
  )
}

export default Todo
