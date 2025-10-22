import type { Character } from "./character";

// La API devuelve esta estructura para listas con paginación
export interface PaginatedResponse<T> {
  results: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

// Respuesta para el endpoint /characters
export interface CharactersResponse extends PaginatedResponse<Character> {}

// Respuesta para un solo personaje, ya que puede estar envuelto
export interface SingleCharacterResponse {
  character: Character;
}