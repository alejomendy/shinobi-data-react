import "../../../styles/components/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-icon">◆</span>
          <li className="logo-text"><Link to='/'>Shinobi Data</Link></li>
        </div>

        <ul className="nav-links">
          <li><Link to="/personajes">Characters</Link></li> 
          <li><Link to="/teams">Teams</Link></li>
          <li><Link to="/villages">Villages</Link></li>
          <li><Link to="/jutsu">Jutsu</Link></li>
          <li><Link to="/battles">Battles</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <i className="fa fa-search"></i>
        </div>
      </div>
    </nav>
  );
}
