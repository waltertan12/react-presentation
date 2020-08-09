import {TodoApp} from "./todo-app";

const noop = () => void '☺️';

export const StubTodoApp = TodoApp({
    input: '',
    onSubmit: noop,
    onKeyUp: noop,
    onDeleteTodo: noop,
    todos: [],
});
