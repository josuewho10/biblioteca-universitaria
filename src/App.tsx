import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Inventario from "./pages/Inventario";
import Prestamos from "./pages/Prestamos";
import Historial from "./pages/Historial";
import Comprobante from "./pages/Comprobante";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="historial" element={<Historial />} />
          <Route path="comprobante" element={<Comprobante />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
