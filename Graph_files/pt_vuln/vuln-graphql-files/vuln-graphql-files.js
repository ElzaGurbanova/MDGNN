'use strict';
const v18 = require('express-graphql');
const graphqlHTTP = v18.graphqlHTTP;
const v19 = require('graphql');
const buildSchema = v19.buildSchema;
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const ROOT = path.resolve(__dirname, 'storage');
const v20 = `
  type FileInfo { name: String!, size: Int! }
  type Query {
    list(dir: String!): [String!]!
    stat(p: String!): FileInfo
    read(p: String!): String
  }
`;
const schema = buildSchema(v20);
const v22 = ({dir}) => {
    const target = path.join(ROOT, dir);
    const v21 = fs.readdirSync(target);
    return v21;
};
const v26 = ({p}) => {
    const f = path.join(ROOT, p);
    const st = fs.statSync(f);
    const v23 = path.basename(f);
    const v24 = st.size;
    const v25 = {};
    v25.name = v23;
    v25.size = v24;
    return v25;
};
const v28 = ({p}) => {
    const f = path.join(ROOT, p);
    const v27 = fs.readFileSync(f, 'utf8');
    return v27;
};
const root = {};
root.list = v22;
root.stat = v26;
root.read = v28;
const v29 = {
    schema,
    rootValue: root,
    graphiql: true
};
const v30 = graphqlHTTP(v29);
const v31 = app.use('/graphql', v30);
v31;
const v33 = () => {
    const v32 = console.log('GraphQL file API (VULN) http://localhost:5014/graphql');
    return v32;
};
const v34 = app.listen(5014, v33);
v34;