import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import initGame from './initGame';
import ReactUI from './ReactUI';
import { Provider } from 'jotai';
import { store } from './store';

const ui = document.getElementById('ui');
const root = createRoot(ui);
root.render(
    // the strict mode helps to highlight potential problems in an application by running certain functions twice(like useEffect, etc)
    // the provider is used to provide the Jotai store to the React application, allowing components to access and manipulate global state
    <StrictMode>
        <Provider store = {store}>
            <ReactUI />
        </Provider>
    </StrictMode>
)

initGame();