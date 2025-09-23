import { useParams } from 'react-router-dom';

export default function InvoiceDetail() {
  const { id } = useParams();
  return (
    <div>
      <h1>Invoice Detail</h1>
      <p>Invoice #{id}</p>
    </div>
  );
}


