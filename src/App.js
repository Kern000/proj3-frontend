// CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// React Router
import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Context
import UserContextData from './context/user-context';
import CartContextData from './context/cart-context';

// Pages
import ProductListing from './pages/productListing';
import ProductDetails from './pages/productDetails';
import ProductsByUser from './pages/productsByUser';
import UserLogin from './pages/userLogin';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

// Components
import NavBar from './components/navbar';
import Footer from './components/footer';


function App() {

  return (
    <>
      <UserContextData>
        <CartContextData>
          <NavBar />
            <Routes>
              <Route path="/" element={<ProductListing />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/products/user/:userId" element={<ProductsByUser />} />
              <Route path="/users/login" element={<UserLogin />} />
              <Route path="/users/register" element={<Register />} />
              <Route path="/users/dashboard/:userId" element={<Dashboard />} />
            </Routes>
          <Footer />
        </CartContextData>
      </UserContextData>
    </>
  );
}


export default App;
