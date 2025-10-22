import React from "react";

interface CharacterCardProps {
  image: string;
  name: string;
  description: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  image,
  name,
  description,
}) => {
  return (
    <div className="character-card">
      <img src={image} alt={name} className="character-card__image" />
      <h3 className="character-card__name">{name}</h3>
      <p className="character-card__description">{description}</p>
    </div>
  );
};

export default CharacterCard;
