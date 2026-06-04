import logo from './assets/logo.png';
import './App.css';
import Principal from "./pages/publico/Principal.jsx";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import BuscarPuestos from "./pages/publico/BuscarPuestos.jsx";
import { AppProvider } from "@/AppProvider.jsx";
import RegistrarOferente from "@/pages/publico/RegistrarOferente.jsx";
import RegistrarEmpresa from "@/pages/publico/RegistrarEmpresa.jsx";

import DashboardAdmin from "@/pages/admin/DashboardAdmin.jsx";
import EmpresasPendientes from "@/pages/admin/EmpresasPendientes.jsx";
import OferentesPendientes from "@/pages/admin/OferentesPendientes.jsx";
import MisHabilidades from "@/pages/oferente/MisHabilidades.jsx";
import MiCV from "@/pages/oferente/MiCV.jsx";
import Login from "@/pages/publico/Login.jsx";

import DashboardEmpresa from "@/pages/empresa/DashboardEmpresa.jsx";
import MisPuestos from "@/pages/empresa/MisPuestos.jsx";
import NuevoPuesto from "@/pages/empresa/NuevoPuesto.jsx";
import Candidatos from "@/pages/empresa/Candidatos.jsx";
import DetalleCandidato from "@/pages/empresa/DetalleCandidato.jsx";

function App() {
  return (
      <AppProvider>
        <BrowserRouter>
          <Header />
          <Main />
          <Footer />
        </BrowserRouter>
      </AppProvider>
  );
}

function Header() {
  return (
      <header className="navbar">
        <div className="navbar__brand">
          <Link to="/" className="navbar__brand-link">
            <img src={logo} className="navbar__logo" alt="logo" />
            <span className="navbar__title">BolsaEmpleo</span>
          </Link>
        </div>

        <nav className="navbar__nav">
          <Link className="navbar__nav-link" to="/empresa/registrar">Registro Empresa</Link>
          <Link className="navbar__nav-link" to="/oferente/registrar">Registro Oferente</Link>
          <Link className="navbar__nav-link" to="/puestos">Buscar puestos</Link>
          <Link className="navbar__nav-link" to="/admin/dashboard">DashboardAdmin</Link>
          <Link className="navbar__nav-link" to="/admin/empresas-pendientes">EmpresasPendientes</Link>
          <Link className="navbar__nav-link" to="/admin/oferentes-pendientes">Oferentes Pendientes</Link>

        </nav>

        <div className="navbar__login">
          <Link className="navbar__login-link" to="/login">Login</Link>
        </div>
      </header>
  );
}

function Main() {
  return (
      <main className="main">
        <Routes>
          <Route exact path="/" element={<Principal />} />
          <Route exact path="/puestos" element={<BuscarPuestos />} />
          <Route exact path="/empresa/registrar" element={<RegistrarEmpresa />} />
          <Route exact path="/oferente/registrar" element={<RegistrarOferente />} />
          <Route exact path="/admin/dashboard" element={<DashboardAdmin />}/>
          <Route exact path="/admin/empresas-pendientes" element={<EmpresasPendientes />}/>
          <Route exact path="/admin/oferentes-pendientes" element={<OferentesPendientes />} />
          <Route exact path="/login" element={<Login/>} />

          <Route exact path="/empresa/dashboard" element={<DashboardEmpresa />} />
          <Route exact path="/empresa/puestos" element={<MisPuestos />} />
          <Route exact path="/empresa/puestos/nuevo" element={<NuevoPuesto />} />
          <Route exact path="/empresa/candidatos" element={<Candidatos />} />
          <Route exact path="/empresa/candidatos/detalle" element={<DetalleCandidato />} />

          <Route exact path="/oferente/habilidades" element={<MisHabilidades />} />
          <Route exact path="/oferente/cv" element={<MiCV />} />

        </Routes>
      </main>
  );
}

function Footer() {
  return (
      <footer className="footer">
        <div className="footer__info">
          <strong className="footer__title">Bolsa de Empleo</strong><br />
          <span className="footer__company">Total Soft Inc.</span>
        </div>
        <div className="footer__contact">
          <span className="footer__email">Contacto: info@bolsaempleo.local</span><br />
          <span className="footer__credits">Créditos: Equipo de desarrollo</span>
        </div>
      </footer>
  );
}

export default App;