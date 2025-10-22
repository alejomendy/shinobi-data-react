// api/response.ts

import type { Character } from "../models/character";

// 🔹 Estructura base genérica para respuestas con paginación
export interface PaginatedResponse<T> {
  results: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
  status?: string;     // "success" | "error"
  message?: string;    // mensaje adicional del backend
  fetchedAt?: string;  // fecha/hora de la respuesta
}

// 🔹 Respuesta para el endpoint /characters
export interface CharactersResponse extends PaginatedResponse<Character> {}

// 🔹 Respuesta para un solo personaje
export interface SingleCharacterResponse {
  character: Character;
  status?: string;     // "success" | "error"
  message?: string;    // mensaje adicional
  fetchedAt?: string;  // fecha/hora de la respuesta
}
