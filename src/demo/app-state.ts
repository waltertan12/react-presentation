import { Todo } from "./todo";

export interface AppState {
    input: string;
    todos: Todo[];
}

let state: AppState = {
    input: '',
    todos: [],
};

export const getState = () => state;

export const setState = (nextState: Partial<AppState>, callback?: () => void) => {
    state = {
        ...state,
        ...nextState,
    };
    if (callback) {
        callback();
    }
};