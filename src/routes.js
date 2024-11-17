import { path } from "framer-motion/client"
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
                path:'product/:productId',
                element:<Product></Product>
            },
            {
                path:"profile",
                element:<MainProfile></MainProfile>,
                children:[
                    {
                        index:true,
                        element:<IndexProfile></IndexProfile>

                    },
                    {
                        path:"address",
                        element:<AddressManager mainPage={true}></AddressManager>

                    }
                ]
                
            },
            {
                path:"checkoutsummary",
                element:<CheckoutSummary></CheckoutSummary>    
            }
            ,
            {
                path:'yöneticipaneli',
                element:<DevDash></DevDash>,
                children:[
                    {
                        index:true,
                        element:<OrderManagment></OrderManagment>
                    },
                    {
                        path:'kategoriislemleri',
                        element:<CategoryOperations></CategoryOperations>
                    },
                    {
                        path:'ozellikislemleri',
                        element:<PropertyOperations></PropertyOperations>
                    },
                    {
                        path:'ozellikislemleri/renkler',
                        element:<ColorOperations></ColorOperations>
                    },
                    {
                        path:'ozellikislemleri/kumaslar',
                        element:<FabricOperations></FabricOperations>
                    },
                    {
                        path:'ozellikislemleri/desenler',
                        element:<PatternOperations></PatternOperations>
                    },
                    {
                        path:'urunislemleri',
                        element:<ProductOperations></ProductOperations>
                    },
                    {
                        path:'kullaniciislemleri',
                        element:<CategoryOperations></CategoryOperations>
                    }
                ]
            },
            {
                path:'useragreement',
                element:<UserAgreement></UserAgreement>
            },
            {
                path:'privacypolicy',
                element:<PrivacyPolicy></PrivacyPolicy>
            },
            {
                path:'cookiepolicy',
                element:<CookiePolicy></CookiePolicy>
            },
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