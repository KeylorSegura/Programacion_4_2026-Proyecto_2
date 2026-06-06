import { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import './App.css';
import Principal from "./pages/publico/Principal.jsx";
import { Link, BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import CrearCaracteristicas from "@/pages/admin/CrearCaracteristicas.jsx";
import DashboardOferente from "@/pages/oferente/DashboardOferente.jsx";

import DashboardEmpresa from "@/pages/empresa/DashboardEmpresa.jsx";
import MisPuestos from "@/pages/empresa/MisPuestos.jsx";
import NuevoPuesto from "@/pages/empresa/NuevoPuesto.jsx";
import Candidatos from "@/pages/empresa/Candidatos.jsx";
import DetalleCandidato from "@/pages/empresa/DetalleCandidato.jsx";

function getUser(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        const tipo = Array.isArray(payload.scope) ? payload.scope[0] : payload.scope;
        return { id: payload.id, tipo };
    } catch {
        return null;
    }
}

function initUser() {
    const token = localStorage.getItem('token');
    return token ? getUser(token) : null;
}

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
    const [user, setUser] = useState(initUser());
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setUser(initUser());
    }, [location]);

    function handleLogout() {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    }

    return (
        <header className="navbar">
            <div className="navbar__brand">
                <Link to="/" className="navbar__brand-link">
                    <img src={logo} className="navbar__logo" alt="logo" />
                    <span className="navbar__title">BolsaEmpleo</span>
                </Link>
            </div>

            <nav className="navbar__nav">
                {!user && <Link className="navbar__nav-link" to="/empresa/registrar">Registro Empresa</Link>}
                {!user && <Link className="navbar__nav-link" to="/oferente/registrar">Registro Oferente</Link>}

                {user?.tipo === 'Administrador' && <Link className="navbar__nav-link" to="/admin/dashboard">Dashboard</Link>}
                {user?.tipo === 'Administrador' && <Link className="navbar__nav-link" to="/admin/empresas-pendientes">Empresas Pendientes</Link>}
                {user?.tipo === 'Administrador' && <Link className="navbar__nav-link" to="/admin/oferentes-pendientes">Oferentes Pendientes</Link>}

                {user?.tipo === 'Empresa' && <Link className="navbar__nav-link" to="/empresa/dashboard">Dashboard</Link>}
                {user?.tipo === 'Empresa' && <Link className="navbar__nav-link" to="/empresa/puestos">Puestos</Link>}

                {user?.tipo === 'Oferente' && <Link className="navbar__nav-link" to="/oferente/dashboard">Dashboard</Link>}
                {user?.tipo === 'Oferente' && <Link className="navbar__nav-link" to="/oferente/habilidades">Habilidades</Link>}
                {user?.tipo === 'Oferente' && <Link className="navbar__nav-link" to="/puestos">Buscar puestos</Link>}
            </nav>

            <div className="navbar__login">
                {!user
                    ? <Link className="navbar__login-link" to="/login">Login</Link>
                    : <Link className="navbar__login-link" to="/" onClick={handleLogout}>{user.id} ({user.tipo})</Link>
                }
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
          <Route exact path="/admin/caracteristicas" element={<CrearCaracteristicas />} />
          <Route exact path="/login" element={<Login/>} />

          <Route exact path="/empresa/dashboard" element={<DashboardEmpresa />} />
          <Route exact path="/empresa/puestos" element={<MisPuestos />} />
          <Route exact path="/empresa/puestos/nuevo" element={<NuevoPuesto />} />
          <Route exact path="/empresa/candidatos" element={<Candidatos />} />
          <Route exact path="/empresa/candidatos/detalle" element={<DetalleCandidato />} />

          <Route exact path="/oferente/dashboard" element={<DashboardOferente />} />
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