import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
//CSS
import './index.css';
//COMPONENTS
import App from './App.tsx';
import Ref from './components/Ref.tsx';
import Search from './components/Search.tsx';
import State from './components/State.tsx';
import SignalR from './components/SignalR.tsx';
//CONTEXT
import { ContextProvider } from './context/ContextProvider';
import Effect from './components/Effect.tsx';
import DadosAPI from './components/DadosAPI.tsx';
import Socket from './components/Socket.tsx';
import Calculos from './components/Calculos.tsx';
import Delivery from './components/Delivery.tsx';

let router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/state',
                element: <State />,
            },
            {
                path: '/ref',
                element: <Ref />,
            },
            {
                path: '/search',
                element: <Search />,
            },
            {
                path: '/effect',
                element: <Effect />,
            },
            {
                path: '/api/dadosapi',
                element: <DadosAPI />,
            },
            {
                path: '/socket/',
                element: <Socket />,
            },
            {
                path: '/signalr/',
                element: <SignalR />,
            },
            {
                path: '/delivery/',
                element: <Delivery />,
            },
            {
                path: '/calculos',
                element: <Calculos />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    </StrictMode>
);
