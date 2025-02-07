import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from 'pages/HomePage'
import { RepositoryPage } from 'pages/RepositoryPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/repository/:name',
        element: <RepositoryPage />,
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />
}
