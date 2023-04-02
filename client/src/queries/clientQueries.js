import { gql } from "@apollo/client";

const GET_CLIENTS = gql`
  query getClients {
    clients {
      id
      name
      email
      phone
    }
  }
`;

//! export it in curly braces, not as default
//! cause we have/might more than one query
export { GET_CLIENTS }