import type { Character } from "./models/character";
import type { CharactersResponse, SingleCharacterResponse } from "./models/api_response";

const baseRoute = "https://dattebayo-api.onrender.com";

export async function fetchCharacters(): Promise<CharactersResponse> {
  const res = await fetch(`${baseRoute}/characters`);
  
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to fetch characters. Status: ${res.status}. Body: ${errorBody.substring(0, 100)}`);
  }
  
  return res.json();
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