import { gql } from "@apollo/client";

/*
? "ProjectStatus" name is an enum that we refer it to the mutation
? in the schema.js file for the "add a project".  
*/
const ADD_PROJECT = gql`
  mutation addProject($name: String!, $description: String!, $status: ProjectStatus!, $clientId: ID!) {
    addProject(name: $name, description: $description, status: $status, clientId: $clientId ){
      id 
      name 
      description 
      status 
      client {
        id
        name 
        email 
        phone
      }
    }
  } 

`;

export { ADD_PROJECT }
