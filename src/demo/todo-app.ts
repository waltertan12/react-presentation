import { createNode } from '../virtual-dom';
import { SyntheticEvent } from '../event-delegator/synthetic-event';
import { Todo } from "./todo";

export interface TodoAppProps {
    input: string;
    onSubmit: (event: SyntheticEvent) => void;
    onKeyUp: (event: SyntheticEvent<HTMLInputElement, KeyboardEvent>) => void;
    onDeleteTodo: (index: number) => void;
    todos: Todo[];
}

export const TodoApp = (props: TodoAppProps) => createNode('div', {},
    createNode('h1', {}, 'Todo App'),
    createNode('div', { className: 'form-group' },
        createNode(
            'input',
            {
                id: 'input',
                className: 'form-control',
                type: 'text',
                placeholder: 'Do laundry',
                value: props.input,
                onKeyUp: props.onKeyUp
            }
        ),
        createNode('br', {}),
        createNode(
            'button',
            { id: 'button', className: 'btn btn-primary', onClick: props.onSubmit },
            'Add Todo'
        )
    ),
    createNode('h2', {}, 'Things to do:'),
    createNode(
        'ul',
        { id: 'list', className: 'list-group' },
        ...props.todos.map((todo: Todo, key: number) => {
            return createNode(
                'li',
                { className: 'list-group-item d-flex justify-content-between', key: todo.timestamp },
                todo.content,
                createNode(
                    'button',
                    { className: 'btn btn-danger', onClick: () => props.onDeleteTodo(key) },
                    'X'
                )
            );
        })
    )
);
