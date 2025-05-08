import { gql, GraphQLClient } from 'graphql-request';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ADD_PATIENT = gql`
  mutation AddPatient($trial_id: Int!, $age: Int!, $gender: String!, $response: String!) {
    addPatient(trial_id: $trial_id, age: $age, gender: $gender, response: $response) {
      id
      age
      gender
      response
    }
  }
`;

export default function AddPatientForm() {
  const router = useRouter();
  const { id } = router.query;
  const trialId = Number(id);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [response, setResponse] = useState('Positive');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/api/graphql';
    const graphQLClient = new GraphQLClient(endpoint);

    await graphQLClient.request(ADD_PATIENT, {
      trial_id: trialId,
      age: parseInt(age),
      gender,
      response,
    });

    router.push(`/trials/${trialId}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Add Patient to Trial #{trialId}</h2>
      <form onSubmit={handleSubmit}>
        <label>Age: </label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />

        <br />

        <label>Gender: </label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <br />

        <label>Response: </label>
        <select value={response} onChange={(e) => setResponse(e.target.value)}>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>

        <br /><br />
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}
