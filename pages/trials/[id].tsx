import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { gql, GraphQLClient } from 'graphql-request';

const GET_PATIENTS_BY_TRIAL = gql`
  query GetPatientsByTrial($trial_id: Int!) {
    patientsByTrial(trial_id: $trial_id) {
      id
      age
      gender
      response
    }
  }
`;

type Patient = {
  id: number;
  age: number;
  gender: string;
  response: string;
};

type Props = {
  trialId: number;
  patients: Patient[];
};

export default function TrialDetailPage({ trialId, patients }: Props) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Patients for Trial #{trialId}</h1>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              {patient.age} y/o {patient.gender} — Response: {patient.response}
            </li>
          ))}
        </ul>
        
      )}

      <Link href={`/trials/${trialId}/add-patient`}>
    <button style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
      ➕ Add Patient
    </button>
    </Link>

    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const trialId = Number(id);

  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/api/graphql';

  const graphQLClient = new GraphQLClient(endpoint);

  try {
    const data = await graphQLClient.request<{ patientsByTrial: Patient[] }>(
      GET_PATIENTS_BY_TRIAL,
      { trial_id: trialId }
    );

    return {
      props: {
        trialId,
        patients: data.patientsByTrial,
      },
    };
  } catch (error) {
    console.error('Error fetching patients:', error);
    return {
      props: {
        trialId,
        patients: [],
      },
    };
  }
};
