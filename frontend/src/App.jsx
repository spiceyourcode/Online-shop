import {BrowserRouter as Router, Routes ,Route} from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from  "./pages/Cart"
import Checkout from "./pages/Checkout";
import Navbar from "./components/ui/Navbar";

function App(){
  return(
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar/>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/login" element = {<Login/>}/>
            <Route path="/Register" element = {<Register/>}/>
            <Route path="/products/:slug" element={<ProductDetail/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
          </Routes>
        </main>
      </div>

    </Router>
  );
}

export default App;