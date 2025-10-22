import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCharacterById } from "../../api";
import type { Character, SingleCharacterResponse, PersonalDetails, CharacterRank } from "../../models/character"; 
import "../../styles/components/_characterDetail.scss"; 
import { Users, Zap, Award } from "lucide-react"; 

// --- Formateador de Valor Reutilizable y Robusto ---
const formatValue = (v: any, fallback = "N/A"): string => {
  if (v === null || v === undefined || v === "") return fallback;
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  
  if (Array.isArray(v)) {
    if (v.length === 0) return fallback; 
    return v.join(", ");
  }

  if (typeof v === 'object' && !Array.isArray(v)) {
    return Object.entries(v)
        .map(([key, val]) => {
            const displayKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
            const displayValue = formatValue(val, "N/A");
            return `${displayKey}: ${displayValue}`;
        })
        .filter(entry => !entry.endsWith("N/A"))
        .join(" | ");
  }
  
  return fallback;
};
// ----------------------------------------------------

/**
 * Función para intentar construir una lista de hitos (milestones)
 * basándose en los datos de 'debut', 'rank' y 'clan'.
 */
const getCharacterMilestones = (character: Character) => {
    const milestones: { title: string, subtitle: string }[] = [];

    // Hito 1: Información de Debut
    if (character.debut) {
        const debutInfo = formatValue(character.debut).split(" | ");
        if (debutInfo.length > 0 && debutInfo[0] !== 'N/A') {
            milestones.push({
                title: "First Appearance / Debut",
                subtitle: debutInfo.join(' | '),
            });
        }
    }

    // Hito 2: Rango o Título principal
    const primaryTitle = character.personal?.titles?.find(t => t) || character.rank?.ninjaRank ? Object.values(character.rank.ninjaRank).pop() : null;
    if (primaryTitle) {
        milestones.push({
            title: "Achieved Primary Rank/Title",
            subtitle: primaryTitle,
        });
    }

    // Hito 3: Clan/Familia
    if (character.personal?.clan && formatValue(character.personal.clan) !== 'N/A') {
        milestones.push({
            title: "Member of Clan",
            subtitle: formatValue(character.personal.clan, 'N/A'),
        });
    }

    return milestones;
};


export default function CharacterDetails() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery<SingleCharacterResponse | Character, Error>({
    queryKey: ["character", id],
    queryFn: () => fetchCharacterById(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const [activeTab, setActiveTab] = useState<"history" | "abilities" | "jutsu" | "stats">("history");

  if (isLoading) return (<div className="character-detail"><p className="loading-message">Cargando detalles del personaje...</p></div>);
  if (isError) return (<div className="character-detail"><p className="error-message">Error: No se pudieron cargar los datos. {(error as Error).message}</p></div>);
  if (!id) return (<div className="character-detail"><p className="error-message">ID inválido.</p></div>);

  const character: Character | undefined = data 
    ? ("character" in data ? data.character : (data as Character))
    : undefined;

  if (!character) return (<div className="character-detail"><p className="error-message">Personaje no encontrado.</p></div>);

  const personal: PersonalDetails | undefined = character.personal;
  const characterRank: CharacterRank | undefined = character.rank;

  // Datos Dinámicos
  const apiImage = character.images?.find(img => img && img.length > 0);
  const primaryImage = apiImage || "/assets/default.png";

  const primaryRank = characterRank?.ninjaRank ? Object.values(characterRank.ninjaRank).pop() : "N/A";
  const primaryAffiliation = personal?.affiliation?.[0] ?? "N/A";
  const mainTitle = personal?.titles?.find(t => t.toLowerCase().includes('kage') || t.toLowerCase().includes('hokage')) || personal?.titles?.[0] || 'Ninja';
  const primaryLand = "Land of Fire"; // Placeholder si la API no lo ofrece directamente
  const primaryTeam = formatValue(personal?.team?.[0], "N/A");
  const characterMilestones = getCharacterMilestones(character);

  return (
    <div className="character-detail"> 
      
      {/* === CONTENEDOR IZQUIERDO: character-sidebar-detail (aside) === */}
      <aside className="character-sidebar-detail">
        
        {/* Cabecera del Perfil */}
        <div className="profile-header">
          <div className="profile-image-detail">
            <img 
              src={primaryImage} 
              alt={character.name ?? "imagen personaje"} 
              onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/assets/default.png") {
                      target.onerror = null; 
                      target.src = "/assets/default.png";
                  }
              }}
            />
            <div className="village-badge">
              <img src="/assets/konoha-emblem.png" alt="Konoha Emblem" /> 
            </div>
          </div>
          
          <h2>{character.name ?? "Sin nombre"}</h2>
          <p className="subtitle">{mainTitle}</p>
        </div>

        {/* Tarjetas de información */}
        <div className="info-group">
          
          {/* Affiliation Card */}
          <div className="info-card">
            <Award size={20} className="icon orange-icon" /> 
            <div className="card-content">
              <h4>Affiliation</h4>
              <span>{primaryAffiliation}</span>
              <small className="land-text">{primaryLand}</small>
            </div>
          </div>

          {/* Rank Card */}
          <div className="info-card">
            <Zap size={20} className="icon orange-icon" /> 
            <div className="card-content">
              <h4>Rank</h4>
              <span>{primaryRank}</span>
            </div>
          </div>

          {/* Team Card */}
          <div className="info-card">
            <Users size={20} className="icon orange-icon" /> 
            <div className="card-content">
              <h4>Team</h4>
              <span>{primaryTeam}</span>
            </div>
          </div>

        </div>
        
        <Link to="/personajes" className="back-link">← Volver a Personajes</Link>
      </aside>

      {/* === CONTENEDOR DERECHO: character-content-detail (main) === */}
      <main className="character-content-detail">
        
        <nav className="tabs">
          <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "active" : ""}>History</button>
          <button onClick={() => setActiveTab("abilities")} className={activeTab === "abilities" ? "active" : ""}>Abilities</button>
          <button onClick={() => setActiveTab("jutsu")} className={activeTab === "jutsu" ? "active" : ""}>Jutsu</button>
          <button onClick={() => setActiveTab("stats")} className={activeTab === "stats" ? "active" : ""}>Stats</button>
        </nav>

        <section className="tab-content">
          
          {/* === TAB 1: HISTORY === */}
          {activeTab === "history" && (
            <div className="history-tab">
              
              <h3 className="section-title">Origin Story</h3>
              <p className="origin-story-text">
                {character.info ?? "No hay descripción de origen disponible."}
              </p>

              <h3 className="section-title">Key Milestones</h3>
              
              {/* Estructura de Timeline / Milestones (Ahora usa datos reales/derivados) */}
              {characterMilestones.length > 0 ? (
                <div className="milestones-timeline">
                  {characterMilestones.map((milestone, idx) => (
                    <div key={idx} className="milestone-item">
                      <div className="milestone-dot"></div>
                      <div className="milestone-content">
                        <h4>{milestone.title}</h4>
                        <p>{milestone.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay hitos clave disponibles para este personaje.</p>
              )}
            </div>
          )}

          {/* === TAB 2: ABILITIES === */}
          {activeTab === "abilities" && (
            <>
              <h3 className="section-title">CHAKRA & BLOODLINE</h3>
              
              <h4>CHAKRA NATURES</h4>
              {character.natureType && character.natureType.length > 0 ? (
                  <div className="chips">
                    {character.natureType.map((c, i) => (<span key={i} className="chip">{c}</span>))}
                  </div>
              ) : (<p>No hay naturalezas de chakra registradas.</p>)}

              <h4 className="mt-4">KEKKEI GENKAI</h4>
              {personal?.kekkeiGenkai && personal.kekkeiGenkai.length > 0 ? (
                  <div className="chips">
                    {personal.kekkeiGenkai.map((k, i) => (<span key={i} className="chip">{k}</span>))}
                  </div>
              ) : (<p>No tiene Kekkei Genkai listados.</p>)}

              <h4 className="mt-4">CLASSIFICATION</h4>
              {personal?.classification && personal.classification.length > 0 ? (
                  <div className="chips">
                    {personal.classification.map((k, i) => (<span key={i} className="chip">{k}</span>))}
                  </div>
              ) : (<p>No tiene clasificaciones listadas.</p>)}
              
              <h4 className="mt-4">TAILED BEASTS</h4>
              <p className="origin-story-text">{personal?.tailedBeast ?? "N/A"}</p>
            </>
          )}

          {/* === TAB 3: JUTSU === */}
          {activeTab === "jutsu" && (
            <>
              <h3 className="section-title">JUTSU LIST</h3>
              {character.jutsu && character.jutsu.length > 0 ? (
                <ul className="list-columns-2">
                  {character.jutsu.map((j, i) => (<li key={i}>{j}</li>))}
                </ul>
              ) : (<p>No hay jutsus disponibles para este personaje.</p>)}

              <h3 className="mt-4 section-title">TOOLS</h3>
              {character.tools && character.tools.length > 0 ? (
                <ul className="list-columns-2">
                  {character.tools.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              ) : (<p>No hay herramientas listadas.</p>)}
            </>
          )}

          {/* === TAB 4: STATS === */}
          {activeTab === "stats" && (
            <>
              <h3 className="section-title">PHYSICAL & PERSONAL STATS</h3>
              <div className="stats-list">
                <p><strong>ID</strong> {character.id}</p>
                <p><strong>SEX</strong> {personal?.sex ?? "N/A"}</p>
                <p><strong>BLOOD TYPE</strong> {personal?.bloodType ?? "N/A"}</p>
                <p><strong>BIRTHDATE</strong> {personal?.birthdate ?? "N/A"}</p>
                <p><strong>REGISTRATION NO.</strong> {characterRank?.ninjaRegistration ?? "N/A"}</p>
                <p><strong>OCCUPATION</strong> {formatValue(personal?.occupation)}</p>
                <p><strong>AFFILIATION</strong> {formatValue(personal?.affiliation)}</p>
                <p><strong>CLAN</strong> {formatValue(personal?.clan)}</p>
              </div>
              
              <h3 className="mt-4 section-title">RANK & MEASUREMENTS</h3>
              <div className="stats-list">
                <p><strong>NINJA RANKS</strong> {formatValue(characterRank?.ninjaRank)}</p>
                <p><strong>AGE</strong> {formatValue(personal?.age)}</p>
                <p><strong>HEIGHT</strong> {formatValue(personal?.height)}</p>
                <p><strong>WEIGHT</strong> {formatValue(personal?.weight)}</p>
              </div>
              
              <h3 className="mt-4 section-title">VOCALS</h3>
              <div className="stats-list">
                <p><strong>JAPANESE V.A.</strong> {formatValue(character.voiceActors?.japanese)}</p>
                <p><strong>ENGLISH V.A.</strong> {formatValue(character.voiceActors?.english)}</p>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}