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

// El campo 'family' ahora es un objeto, no un array de Members.
export interface Family {
  father?: string;
  mother?: string;
  son?: string;
  daughter?: string;
  wife?: string;
  // Puede contener otros roles
  [key: string]: string | undefined; 
}

// El campo 'rank' ahora es un objeto con el rango y el registro.
export interface CharacterRank {
  ninjaRank?: {
    "Part I"?: string;
    "Part II"?: string;
    "Gaiden"?: string;
    [key: string]: string | undefined; // Para otros períodos
  };
  ninjaRegistration?: string;
}

// El campo 'personal' contiene la mayoría de los detalles básicos
export interface PersonalDetails {
  birthdate?: string;
  sex?: string;
  age?: { [key: string]: string };
  height?: { [key: string]: string };
  weight?: { [key: string]: string };
  bloodType?: string;
  kekkeiGenkai?: string[];
  classification?: string[];
  tailedBeast?: string;
  occupation?: string[];
  affiliation?: string[]; // Ahora es un array de strings
  team?: string[];       // Ahora es un array de strings
  clan?: string;
  titles?: string[];
}

export interface VoiceActors {
    japanese?: string[];
    english?: string[];
}

// --- Modelo Principal del Personaje ---
export interface Character {
  id: number;
  name: string;
  images: string[];

  // Nuevos campos de nivel superior
  debut?: Debut;
  family?: Family;
  jutsu?: string[];       // Array de strings (OK)
  natureType?: string[];  // Equivalente a chakraNatures
  tools?: string[];
  voiceActors?: VoiceActors;
  
  // Campos anidados
  personal?: PersonalDetails;
  rank: CharacterRank;
  
  // Propiedades que faltan en el ejemplo pero que pueden estar presentes en otros (ej: info)
  info?: string;
}