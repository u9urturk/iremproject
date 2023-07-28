import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Testimonial from './components/Testimonial';
import Layout from './pages/Layout';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Layout></Layout>
      <Testimonial></Testimonial   >
      <Footer></Footer>
    </div>
  );
}

export default App;
