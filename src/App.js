import { useRoutes } from 'react-router-dom';
import './App.css';
import routes from './routes';
import { ToastContainer } from 'react-toastify';

function App() {

  const showRoutes = useRoutes(routes)
  return (
    <div className="App">

      {showRoutes}
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
