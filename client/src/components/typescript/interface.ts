import { Socket } from 'socket.io-client'

export interface ITodoForm {
  socket: Socket
  todos: ITodo[]
  orderBy: string;
}

export interface ITodo {
  id: string;
  text: string;
  time: number;
  done: boolean;
}

export interface ITodoItem extends ITodo {
  socket: Socket
}
