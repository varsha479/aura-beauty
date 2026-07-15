import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import VirtualStudio from "./pages/VirtualStudio";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Bag from "./pages/Bag";
import Account from "./pages/Account";
import Product from "./pages/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/studio" element={<VirtualStudio />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/products" element={<Navigate to="/collections" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;