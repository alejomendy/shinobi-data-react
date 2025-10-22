import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles/main.scss";
import Navbar from "./pages/Home/Components/navbar.js";
import Home from "./pages/Home/Home.tsx";
import Characters from "./pages/Characters/Characters.tsx";
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails.tsx";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <HashRouter>
      <div className="app-root">
        <header>
          <Navbar/>
        </header>

        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/personajes" element={<Characters />} />
            <Route path="/personajes/:id" element={<CharacterDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </section>
      </div>
    </HashRouter>
  );
}
