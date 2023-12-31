import Layout from "./pages/Layout"
import Product from "./pages/Product"
import Products from "./pages/Products"
import ProductsByCategory from "./pages/ProductsByCategory"
import PrivateRoute from "./utils"

const routes = [
    {
        path: '/',
        element: <Layout></Layout>,
        children: [
            {
                index: true,
                element: <Products></Products>,
              
            },
            {
                path:'products/:categoryId',
                element:<ProductsByCategory></ProductsByCategory>
            },
            {
                path:'test',
                element:<Product></Product>
            }
        ]
    }
]

const authCheck = routes => routes.map(route => {
    if (route?.auth) {
        route.element = <PrivateRoute>{route.element}</PrivateRoute>
    }
    if (route?.children) {
        route.children = authCheck(route.children)
    }
    return route
})


export default authCheck(routes);