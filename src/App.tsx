import {  Outlet } from "react-router-dom";
import "./styles/main.css";
import Navbar from "./pages/Home/Components/navbar.js";
export default function App() {
  return (
    <div className="app-root">
      <header>
       <Navbar/>
      </header>

      <section>
        <Outlet />
      </section>
    </div>
  );
}
