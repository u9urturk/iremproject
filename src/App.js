import { useRoutes } from 'react-router-dom';
import './App.css';
import routes from './routes';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Testimonial from './components/Testimonial';
import Footer from './components/Footer';

function App() {

  const showRoutes = useRoutes(routes)
  return (
    <div className="App ">
      <Navbar></Navbar>


      {showRoutes}

      <Testimonial></Testimonial>
      <Footer></Footer>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </div>
  );
}

export default App;
