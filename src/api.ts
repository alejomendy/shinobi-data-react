import type { Character } from "./models/character";
import type { CharactersResponse, SingleCharacterResponse } from "./models/api_response";

const baseRoute = "https://dattebayo-api.onrender.com";

export async function fetchCharacters(page: number = 1): Promise<CharactersResponse> {
  const res = await fetch(`${baseRoute}/characters?page=${page}`);
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to fetch characters. Status: ${res.status}. Body: ${errorBody.substring(0, 100)}`);
  }

  const data = await res.json();

  // Adaptamos la respuesta al tipo CharactersResponse
  return {
    results: data.characters ?? data.results ?? [],
    currentPage: data.page ?? 1,
    pageSize: data.limit ?? 20,
    totalPages: data.totalPages ?? Math.ceil((data.total ?? 0) / (data.limit ?? 20)),
    totalResults: data.total ?? data.count ?? 0,
  };
}
// Devuelve el objeto Character o el objeto envuelto SingleCharacterResponse
export async function fetchCharacterById(id: number): Promise<Character | SingleCharacterResponse> {
  const res = await fetch(`${baseRoute}/characters/${id}`);
  
  if (!res.ok) {
    if (res.status === 404) {
        throw new Error(`Character with ID ${id} not found.`);
    }
    const errorBody = await res.text();
    throw new Error(`Failed to fetch character ${id}. Status: ${res.status}. Body: ${errorBody.substring(0, 100)}`);
  }
  
  return res.json();
}