import React, { useState, useRef, useEffect } from 'react'
import { Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap'

import TodoItem from './TodoItem'
import { ITodo, ITodoForm } from './typescript/interface'


const TodoForm: React.FC<ITodoForm> = ({ socket, todos, orderBy }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [todoText, setTodoText] = useState('')
  const [orderTodosBy, setOrderTodos] = useState<string>('')
  const [suggestedTods, setSuggestedTodos] = useState<ITodo[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    setOrderTodos(orderBy)
  }, [orderBy])

  const searchTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value; // user input
    setSearchTerm(searchInput)

    let matches = todos.filter((todo => {
      // if any todo starts with searchInput we return the matched tods
      const regex = new RegExp(`^${searchInput.split(" ").join("")}`, 'gi')
      return todo.text.split(" ").join("").match(regex)
    }))
    setSuggestedTodos(matches)
  }

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoText.length < 5) return alert("The text should be atlest 5 characters");
    socket?.emit("add_todo", todoText)
    setTodoText('')
    handleScroll(true);
  }

  const handleOrderBy = (e: any) => {
    const orderBy = e.target.value
    setOrderTodos(orderBy)
    socket.emit("order_by_time", orderBy)
    handleScroll(false);
  }


  const handleScroll = (newTodo: boolean) => {
    if (scrollRef?.current == null) return

    if (newTodo && orderTodosBy === 'oldest') {
      const scroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      scrollRef.current.scrollTo(0, scroll);;
    } else {
      scrollRef.current.scrollTo(0, 0);;
    }
  }


  return (
    <Row className="m-0">
      <Col lg={6} xs={10} className="mb-3">
        <div className="d-flex align-items-center">
          <InputGroup size="sm" >
            <FormControl placeholder="Search for a todo" value={searchTerm} onChange={searchTodos} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            <Form.Select onChange={handleOrderBy} value={orderTodosBy} aria-label="Default select example" size="sm">
              <option value="oldest" >Oldest to newest</option>
              <option value="newest">Newest to oldest</option>
            </Form.Select>
          </InputGroup>
        </div>
      </Col>
      <Form onSubmit={addTodo} className="overflow-hidden">
        <div className="bg-light" ref={scrollRef} style={{ maxHeight: 500, overflow: "auto", overflowY: 'scroll', scrollBehavior: "smooth" }}>
          {suggestedTods.length > 0 && (
            <>
              {suggestedTods.map(({ id, text, done, time }) => (
                <TodoItem time={time} socket={socket} key={id} text={text} done={done} id={id} />
              ))}
            </>
          )}
          {todos.length < 1 && (
            <>
              <h5>Add todos...</h5>
            </>
          )}

          {suggestedTods.length === 0 && (
            <>
              {todos.map(({ id, text, done, time }) => (
                <TodoItem time={time} socket={socket} key={id} text={text} done={done} id={id} />
              ))}
            </>
          )}
        </div>
        <div className="mt-3">
          <Button onClick={() => socket.emit("remove_done_todos")}>Clear chacked todos</Button>
          <h5 className="my-2">New Task</h5>
          <Col lg={6} xs={12}>
            <InputGroup size="sm" className="mb-3">
              <FormControl required placeholder="Add a todo (at least 5 characters)" onChange={(e: any) => setTodoText(e.target.value)} value={todoText} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
              <Button type="submit">Add</Button>
            </InputGroup>
          </Col>
        </div>
      </Form>

    </Row>
  )
}

export default TodoForm
