// models/character.ts

// --- Modelos Anidados ---
export interface Debut {
  manga?: string;
  anime?: string;
  novel?: string;
  movie?: string;
  game?: string;
  ova?: string;
  appearsIn?: string;
}

export interface Family {
  father?: string;
  mother?: string;
  son?: string;
  daughter?: string;
  wife?: string;
  [key: string]: string | undefined;
}

export interface CharacterRank {
  ninjaRank: {
    "Part I"?: string;
    "Part II"?: string;
    "Gaiden"?: string;
    [key: string]: string | undefined;
  };
  ninjaRegistration?: string;
}

export interface PersonalDetails {
  birthdate?: string;
  sex?: string;
  age?: Record<string, string>;
  height?: Record<string, string>;
  weight?: Record<string, string>;
  bloodType?: string;
  kekkeiGenkai?: string[];
  classification?: string[];
  tailedBeast?: string;
  occupation?: string[];
  affiliation?: string[];
  team?: string[];
  clan?: string;
  titles?: string[];
}

export interface VoiceActors {
  japanese?: string[];
  english?: string[];
}

// --- Modelo Principal ---
export interface Character {
  id: number;
  name: string;
  images: string[];

  debut?: Debut;
  family?: Family;
  jutsu?: string[];
  natureType?: string[];
  tools?: string[];
  voiceActors?: VoiceActors;
  personal?: PersonalDetails;
  rank: CharacterRank;

  info?: string;
}

// --- Tipos de respuesta genéricos ---
export interface PaginatedResponse<T> {
  results: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

// --- Respuesta para un solo personaje ---
export interface SingleCharacterResponse {
  character: Character;
  status?: string;
  message?: string;
  fetchedAt?: string;
}

// --- Respuesta para lista de personajes ---
export interface CharactersResponse extends PaginatedResponse<Character> {
  status?: string;
  message?: string;
  fetchedAt?: string;
}
