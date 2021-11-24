import { useState } from "react";
import { Button, Col, Form, FormControl, Row } from "react-bootstrap"

import { ITodoItem } from "./typescript/interface";

const { Group, Check: CheckBox } = Form

const TodoItem: React.FC<ITodoItem> = ({ done, id, text, socket }) => {
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(text);

  function editItem() {
    setEdit((prev) => !prev);
    if (!edit) return;
    socket.emit("edit_todo", id, editValue);
  }

  return (
    <Row className="border border-gray p-2 m-0">
      <Col lg={8} className="d-flex">
        <div className="d-flex align-items-center">
          <Group >
            <CheckBox className="me-1" type="checkbox" defaultChecked={done} onClick={() => socket.emit("set_todo_done", id)} />
          </Group>
          {edit ? <FormControl className="w-100" value={editValue} onChange={(e: any) => setEditValue(e.target.value)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            : <p className="mb-0 textWrap" onClick={editItem}> {text} </p>}
        </div>
      </Col>
      <Col lg={4} className="text-end">
        <Button onClick={editItem} className="m-1 button"
          variant="warning">{edit ? "Done with my edits" : "Edit"}</Button>
        <Button className="button" variant="danger" onClick={() => socket.emit("remove_todo", id)}>Remove</Button>
      </Col>
    </Row>
  )
}

export default TodoItem
