import { useParams } from 'react-router-dom';

export default function TenantProfile() {
  const { id } = useParams();
  return (
    <div>
      <h1>Tenant Profile</h1>
      <p>Profile for tenant #{id}</p>
    </div>
  );
}


