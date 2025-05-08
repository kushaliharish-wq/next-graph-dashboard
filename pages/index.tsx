// pages/index.tsx
import { gql, GraphQLClient } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';

const GET_TRIALS = gql`
  query GetTrials($phase:String) {
    trials(phase:$phase) {
      id
      title
      phase
      status
      location
    }
  }
`;

type Trial = {
  id: number;
  title: string;
  phase: string;
  status: string;
  location: string;
};
type Props={
  trials: Trial[];
};

export default function Home({ trials }: Props) {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');
  if (!trials) return <p>No data available.</p>;
  const filtered = trials
    .filter((trial) => phaseFilter === 'All' || trial.phase === phaseFilter)
    .filter((trial) =>
      trial.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Clinical Trials</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
        />
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="All">All Phases</option>
          <option value="Phase 1">Phase 1</option>
          <option value="Phase 2">Phase 2</option>
          <option value="Phase 3">Phase 3</option>
        </select>
      </div>

      <ul>
        {filtered.map((trial) => (
          <li key={trial.id} style={{ marginBottom: '1rem' }}>
            <Link href={`/trials/${trial.id}`}>
              <h3 style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                {trial.title}
              </h3>
            </Link>
            <p>Phase: {trial.phase}</p>
            <p>Status: {trial.status}</p>
            <p>Location: {trial.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/api/graphql';
  const graphQLClient = new GraphQLClient(endpoint);

  try {
    const data = await graphQLClient.request<{ trials: Trial[] }>(GET_TRIALS);

    return {
      props: {
        trials: data.trials || [], // <- important fallback
      },
    };
  } catch (error) {
    console.error('SSR trial fetch error:', error);
    return {
      props: {
        trials: [],
      },
    };
  }
};
