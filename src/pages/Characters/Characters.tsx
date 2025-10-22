import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef, useMemo } from "react";
import { fetchCharacters } from "../../api";
import type { Character } from "../../models/character";
// Nota: 'Characters' del archivo de tipos ya no es estrictamente necesario,
// pero asumiremos que el tipo Character es correcto.
import CharacterCard from "../Characters/components/characterscard";
import "../../styles/components/character.css";

// --- Configuración de Filtros (Sin cambios) ---
const CHARACTER_FILTERS = ["All", "Team 7", "Akatsuki", "Kage", "Jinchuriki"];

const doesCharacterMatchFilter = (character: Character, filter: string): boolean => {
  if (filter === "All") return true;

  const nameLower = character.name?.toLowerCase() ?? "";
  const affiliationLower = character.personal?.affiliation?.map(a => a.toLowerCase()) ?? [];
  const titlesLower = character.personal?.titles?.map(t => t.toLowerCase()) ?? [];

  switch (filter) {
    case "Team 7":
      return nameLower.includes("naruto") || nameLower.includes("sasuke") || nameLower.includes("sakura");
    case "Akatsuki":
      return affiliationLower.some(a => a.includes("akatsuki"));
    case "Kage":
      return titlesLower.some(t => t.includes("kage"));
    case "Jinchuriki":
      return character.personal?.tailedBeast !== undefined && character.personal.tailedBeast !== null;
    default:
      return false;
  }
};
// ---------------------------------------------


export default function CharactersComponent() {
  // Estado para el filtro seleccionado
  const [activeFilter, setActiveFilter] = useState("All");

  // Referencia al elemento que marca el final de la lista
  const loader = useRef(null);

  // === 1. HOOK PRINCIPAL: useInfiniteQuery ===
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['characters'],
    queryFn: ({ pageParam = 1 }) => fetchCharacters(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.currentPage !== 'number' || typeof lastPage.totalPages !== 'number') {
        return undefined;
      }
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
  
  // === 2. LÓGICA DE SCROLL (Intersection Observer / Simulación) ===
  useEffect(() => {
    // Si no hay más páginas o ya está cargando, no hacemos nada.
    if (!hasNextPage || isFetchingNextPage) return;

    // Función que se dispara cuando el elemento 'loader' es visible
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchNextPage();
      }
    };

    // Crea el Intersection Observer
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // Observa la ventana (viewport)
      rootMargin: "20px", // Margen antes de que se active
      threshold: 1.0, // Solo cuando el 100% del target es visible
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    // Limpia el observer al desmontar el componente
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // === 3. PROCESAMIENTO DE DATOS ===
  // Aplanamos y filtramos la lista de todas las páginas cargadas.
  const allCharacters: Character[] = data?.pages?.flatMap((page: any) => 
    (page?.results || page?.characters || []).map((item: any) => ({
      id: Number(item.id),
      name: String(item.name),
      images: Array.isArray(item.images) ? item.images : [],
      personal: item.personal,
      info: item.info,
      rank: item.rank || { ninjaRank: {} },
    }))
  ) ?? [];

  const filteredList = useMemo(() => {
      // Filtramos la lista aplanada según el filtro activo.
      return allCharacters.filter(p => doesCharacterMatchFilter(p, activeFilter));
  }, [allCharacters, activeFilter]);
  
  // === 4. SALIDAS ANTICIPADAS ===
  if (isLoading && !isFetchingNextPage)
    return (
      <main className="characters-page">
        <div className="header-container">
            <h2 className="title-large">Character Selection</h2>
            <p className="subtitle-small">Cargando la primera página de personajes...</p>
        </div>
      </main>
    );
  if (isError)
    return (
      <main className="characters-page">
        <div className="header-container">
            <h2 className="title-large">Character Selection</h2>
            <p className="error-message">Error al cargar datos: {(error as Error).message}</p>
        </div>
      </main>
    );


  return (
    <main className="characters-page">
      
      {/* TÍTULO Y DESCRIPCIÓN */}
      <div className="header-container">
        <h2 className="title-large">Character Selection</h2>
        <p className="subtitle-small">Browse and select characters to view their detailed profiles.</p>
      </div>

      {/* CONTENEDOR DE FILTROS */}
      <div className="filters-container">
        <nav className="filter-buttons">
          {CHARACTER_FILTERS.map((filter) => (
            <button
              key={filter}
              // Resetear a la página 1 al cambiar de filtro (esto lo maneja useInfiniteQuery)
              onClick={() => setActiveFilter(filter)} 
              className={activeFilter === filter ? "active" : ""}
            >
              {filter}
            </button>
          ))}
        </nav>
      </div>

      {/* CARD GRID */}
      {filteredList.length === 0 && !isLoading ? (
        <p className="no-results">No characters found for the selected filter.</p>
      ) : (
        <>
            <div className="cardgrid">
            {filteredList.map((p) => (
                <CharacterCard
                key={p.id}
                id={p.id}
                image={p.images[0] ?? "/assets/default.png"}
                name={p.name}
                />
            ))}
            </div>

            {/* Elemento de Referencia (Loader) */}
            <div ref={loader} style={{ height: '50px', margin: '20px 0', textAlign: 'center' }}>
                {isFetchingNextPage ? (
                    <p className="loading-more">Cargando más personajes...</p>
                ) : hasNextPage ? (
                    // Si no estamos cargando y hay más páginas, se mostrará
                    // pero la detección de scroll lo manejará el Intersection Observer.
                    <p className="scroll-indicator">Desplázate hacia abajo para cargar más.</p>
                ) : (
                    <p className="end-of-list">Fin de la lista de personajes.</p>
                )}
            </div>
        </>
      )}
    </main>
  );
}