// pages/api/graphql.ts
import { createSchema, createYoga } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

//PostgreSQL connection using environment variables
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
  ssl: { rejectUnauthorized: false },
});

// type definitions
const typeDefs = /* GraphQL */ `
  type Trial {
    id: ID!
    title: String!
    phase: String!
    start_date: String
    end_date: String
    status: String
    location: String
  }

  type Patient {
    id: ID!
    trial_id: Int!
    age: Int
    gender: String
    response: String
  }

  type Query {
    trials(phase:String): [Trial]
    patientsByTrial(trial_id: Int!): [Patient]
  }
    type Mutation{
    addPatient(trial_id: Int!, age: Int!, gender: String!, response: String!): Patient
    }
`;

//resolvers
const resolvers = {
  Query: {
    trials: async (_: unknown, args: { phase?: string }) => {
    if (args.phase) {
      const result = await pool.query('SELECT * FROM trials WHERE phase = $1', [args.phase]);
      return result.rows;
    }
    const result = await pool.query('SELECT * FROM trials');
    return result.rows;
  },

    patientsByTrial: async (_: unknown, args: { trial_id: number }) => {
      const result = await pool.query('SELECT * FROM patients WHERE trial_id = $1', [args.trial_id]);
      return result.rows;
    },
  },
  Mutation: {
  addPatient: async (_: unknown, args: { trial_id: number; age: number; gender: string; response: string }) => {
    const result = await pool.query(
      'INSERT INTO patients (trial_id, age, gender, response) VALUES ($1, $2, $3, $4) RETURNING *',
      [args.trial_id, args.age, args.gender, args.response]
    );
    return result.rows[0];
  },
}
};

//yoga server instance
const yoga = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export default yoga;

export const config = {
  api: {
    bodyParser: false,
  },
};
