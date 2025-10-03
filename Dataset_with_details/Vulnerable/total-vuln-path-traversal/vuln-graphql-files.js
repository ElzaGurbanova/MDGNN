// vuln-graphql-files.js
// VULNERABLE: resolvers accept raw path input, used directly with fs.

'use strict';
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'storage');

const schema = buildSchema(`
  type FileInfo { name: String!, size: Int! }
  type Query {
    list(dir: String!): [String!]!
    stat(p: String!): FileInfo
    read(p: String!): String
  }
`);

const root = {
  list: ({ dir }) => {
    const target = path.join(ROOT, dir); // absolute override & traversal
    return fs.readdirSync(target);
  },
  stat: ({ p }) => {
    const f = path.join(ROOT, p); // symlink follow
    const st = fs.statSync(f);
    return { name: path.basename(f), size: st.size };
  },
  read: ({ p }) => {
    const f = path.join(ROOT, p);
    return fs.readFileSync(f, 'utf8');
  }
};

app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.listen(5014, () => console.log('GraphQL file API (VULN) http://localhost:5014/graphql'));

