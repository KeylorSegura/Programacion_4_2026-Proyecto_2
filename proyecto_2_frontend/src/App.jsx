import logo from './assets/logo.png';
import './App.css';
import Principal from "./pages/publico/Principal.jsx";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import BuscarPuestos from "./pages/publico/BuscarPuestos.jsx";
import { AppProvider } from "@/AppProvider.jsx";

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
          <Link className="navbar__nav-link" to="/">Registro Empresa</Link>
          <Link className="navbar__nav-link" to="/">Registro Oferente</Link>
          <Link className="navbar__nav-link" to="/puestos">Buscar puestos</Link>
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
          {/*<Route exact path="/empresa/registrar" element={<div>Registro Empresa</div>} />*/}
          {/*<Route exact path="/oferente/registrar" element={<div>Registro Oferente</div>} />*/}
          {/*<Route exact path="/login" element={<div>Login</div>} />*/}
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