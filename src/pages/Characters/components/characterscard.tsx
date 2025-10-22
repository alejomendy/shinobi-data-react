import { Link } from "react-router-dom";

type Props = {
  id: string | number;
  image: string;
  name: string;
  team?: string;
};

export default function CharacterCard({ id, image, name, team }: Props) {
  return (
    <Link to={`/personajes/${id}`} className="card-link">
      <div className="cardcharacter">
        <img src={image} alt={name} />
        <div className="card-info">
          <h3>{name}</h3>
          <p>{team ?? "Sin equipo"}</p>
        </div>
      </div>
    </Link>
  );
}
