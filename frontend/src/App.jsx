import {BrowserRouter as Router, Routes ,Route} from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from  "./pages/Cart"
import Checkout from "./pages/Checkout";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/Register" element = {<Register/>}/>
        <Route path="/products/:slug" element={<ProductDetail/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
      </Routes>
    </Router>
  );
}

export default App;