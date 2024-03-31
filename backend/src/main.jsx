import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {FichaInmuebleParticular} from "./paginas/FichaInmuebleParticular.jsx";
// import i18n (needs to be bundled ;))
import './i18n/i18n.js';
import {ListaLlamadas} from "./paginas/ListaLlamadas.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/particular/:platformHash",
        element: <FichaInmuebleParticular />,
    },
    {
        path: "/lista",
        element: <ListaLlamadas />,
    },
]);

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>

  </React.StrictMode>,
)
