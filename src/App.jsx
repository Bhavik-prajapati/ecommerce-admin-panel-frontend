import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import { ToastContainer } from "react-toastify"; // ✅ only once
import "react-toastify/dist/ReactToastify.css"; 
import Categories from "./pages/Categories";

const App = () => {
  return (
    <>
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        limit={5}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/categories" element={<Categories />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
