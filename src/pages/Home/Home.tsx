import { useQuery } from "@tanstack/react-query";
import { Carousel } from "./Components/carousel";

import { fetchCharacters } from "../../api";
import type { Characters } from "../../models/api_response";
import type { Character } from "../../models/character";
import CharacterCard from "./Components/main_character_cards";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery<Characters, Error>({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    staleTime: 1000 * 60 * 5,
  });

  const list: Character[] = (data?.characters ?? []).map((item: Character) => ({
    id: Number(item.id),
    name: String(item.name),
    images: Array.isArray(item.images)
      ? item.images.map((img) => String(img))
      : [],
  }));

  return (
    <main>

      <section className="hero-section flex-center">
        <div className="hero-text">
          <h1>Bienvenido a Shinobi Data</h1>
          <p>Explora el mundo ninja con nuestra extensa base de datos</p>
        </div>
        <Carousel
          images={[
            "https://4kwallpapers.com/images/walls/thumbs_3t/22818.jpg",
            "https://4kwallpapers.com/images/walls/thumbs_3t/19963.jpg",
            "https://4kwallpapers.com/images/walls/thumbs_3t/19824.jpg",
          ]}
        />
      </section>
      <section className="container">
        <h2>Personajes destacados</h2>
        {isLoading ? <div>Cargando...</div> : null}
        {isError ? <div>Error: {error?.message}</div> : null}
        {list.length > 0 ? (
          <div className="row justify-between">
            {list.map((p) => (
              <div
                className="col-12 col-md-6 col-lg-3 align-center"
                style={{ marginBottom: "20px" }}
              >
                <CharacterCard
                  key={p.id}
                  image={p.images[0]}
                  name={p.name}
                  // TODO(Any): Add description to API and use it here
                  description="Descripción breve del personaje."
                />
              </div>
            ))}
          </div>
        ) : (
          <div>No hay personajes destacados</div>
        )}
      </section>
    </main>
  );
}
