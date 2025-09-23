import { useParams } from 'react-router-dom';

export default function PropertyDetail() {
  const { id } = useParams();
  return (
    <div>
      <h1>Property Detail</h1>
      <p>Details for property #{id}</p>
    </div>
  );
}


