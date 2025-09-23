import { useParams } from 'react-router-dom';

export default function PropertyEdit() {
  const { id } = useParams();
  return (
    <div>
      <h1>Edit Property</h1>
      <p>Editing property #{id}</p>
    </div>
  );
}


