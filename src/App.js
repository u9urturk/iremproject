import { useRoutes } from 'react-router-dom';
import './App.css';
import routes from './routes';
import { Flip, ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';

function App() {
  const showRoutes = useRoutes(routes)
  return (
    <div className="App ">
      <CartProvider >
        <Navbar></Navbar>
        <ScrollToTop></ScrollToTop>

        {showRoutes}

        <Footer></Footer>
        <ToastContainer
          position="top-left"
          autoClose={1500}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          progress={undefined}
          theme="colored"
          transition={Flip}
        />
      </CartProvider>

    </div>
  );
}

export default App;
