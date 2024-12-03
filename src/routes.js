import CookiePolicy from "./components/policy/CookiePolicy "
import PrivacyPolicy from "./components/policy/PrivacyPolicy "
import UserAgreement from "./components/policy/UserAgreement"
import DevDash from "./pages/DevDash/Main"
import CategoryOperations from "./pages/DevDash/Pages/CategoryOperations"
import ColorOperations from "./pages/DevDash/Pages/Components/ColorOperations"
import FabricOperations from "./pages/DevDash/Pages/Components/FabricOperations"
import OrderManagment from "./pages/DevDash/Pages/Components/OrderManagment"
import PatternOperations from "./pages/DevDash/Pages/Components/PatternOperations"
import ProductOperations from "./pages/DevDash/Pages/ProductOperations"
import PropertyOperations from "./pages/DevDash/Pages/PropertyOperations"
import Layout from "./pages/Layout"
import Main from "./pages/Main"
import Product from "./pages/Product"
import AddressManager from "./pages/profile/AddressManager"
import IndexProfile from "./pages/profile/IndexProfile"
import MainProfile from "./pages/profile/MainProfile"
import PrivateRoute from "./utils"
import CheckoutSummary from "./pages/uiComponents/CheckoutSummary"
import OrderManager from "./pages/profile/OrderManager"
import OrderDetail from "./pages/profile/OrderDetail"

const routes = [
    {
        path: '/',
        element: <Layout></Layout>,
        children: [
            {
                index: true,
                element: <Main></Main>,

            },
            {
                path: 'product/:productId',
                element: <Product></Product>
            },
            {
                path: "profile",
                element: <MainProfile></MainProfile>,
                auth: true,
                children: [
                    {
                        auth: true,
                        index: true,
                        element: <IndexProfile></IndexProfile>

                    },
                    {
                        auth: true,
                        path: "address",
                        element: <AddressManager mainPage={true}></AddressManager>

                    },
                    {
                        auth: true,
                        path: "orders",
                        element: <OrderManager></OrderManager>

                    },
                    {
                        auth: true,
                        path: "orders/:id",
                        element: <OrderDetail></OrderDetail>

                    }
                ]

            },
            {
                auth: true,
                path: "checkoutsummary",
                element: <CheckoutSummary></CheckoutSummary>
            }
            ,
            {
                auth: true,
                admin: true,
                path: 'yöneticipaneli',
                element: <DevDash></DevDash>,
                children: [
                    {
                        auth: true,
                        admin: true,
                        index: true,
                        element: <OrderManagment></OrderManagment>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'kategoriislemleri',
                        element: <CategoryOperations></CategoryOperations>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'ozellikislemleri',
                        element: <PropertyOperations></PropertyOperations>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'ozellikislemleri/renkler',
                        element: <ColorOperations></ColorOperations>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'ozellikislemleri/kumaslar',
                        element: <FabricOperations></FabricOperations>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'ozellikislemleri/desenler',
                        element: <PatternOperations></PatternOperations>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'urunislemleri',
                        element: <ProductOperations></ProductOperations>
                    },
                    {
                        auth: true,
                        admin: true,
                        path: 'kullaniciislemleri',
                        element: <CategoryOperations></CategoryOperations>
                    }
                ]
            },
            {
                path: 'useragreement',
                element: <UserAgreement></UserAgreement>
            },
            {
                path: 'privacypolicy',
                element: <PrivacyPolicy></PrivacyPolicy>
            },
            {
                path: 'cookiepolicy',
                element: <CookiePolicy></CookiePolicy>
            },
        ]
    }
]

const authCheck = routes => routes.map(route => {
    if (route?.auth) {
        route.element = <PrivateRoute>{route.element}</PrivateRoute>
    }
    if (route?.auth && route?.admin) {
        route.element = <PrivateRoute type={"admin"}>{route.element}</PrivateRoute>
    }
    if (route?.children) {
        route.children = authCheck(route.children)
    }
    return route
})


export default authCheck(routes);