// bring in the data from sampleData file to work with
const { projects, clients } = require("../sampleData.js"); // not using the sample data when you have the models and get data from DB

// Mongoose models
const Project = require("../models/Project");
const Client = require("../models/Client");

// could do this way but to save a line, we destructure it as below
/* 
const graphql = require('graphql')
const { GraphQLObjectType } = graphql 
*/

// get different types from GraphQL, for setting the our data types, might have
// many others as above, projects, clients, blogs, users...., could get quite long
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

// Project Type - the convention is to use upercase
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    // fields that returning an object
    id: { type: GraphQLID }, // field defining the graphql types
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      // to get even client in projects should define the client type and resolve it in projcet type
      // this is how you add relationships to different types or different resources
      type: ClientType,
      resolve(parent, args) {
        // geting the client where the its id matches the clientId of the parent which is the project here
        /* 
        return clients.find((client) => client.id === parent.clientId) // finding all the clients that have clientId that matches
        // with actual client id
        */
        return Client.findById(parent.clientId);
      },
    },
  }),
});

// Client Type - the convention is to use upercase
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    // fields that returning an object
    id: { type: GraphQLID }, // field defining the graphql types
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// to make a query you need to make a root query object
// start with a graphql object type just like above
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        /* return projects; // returning projects array from the sample data */
        return Project.find(); // get all projects via Project model and the find method
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        /* return projects.find((project) => project.id === args.id); // finding project by id from sample data */
        return Project.findById(args.id); // using Prject model to retrive data from database
      },
    },
    clients: {
      // to query all clients
      type: new GraphQLList(ClientType), // scince it's a list of clients, we set it to GraphQLList
      // and ClientType is the type of each client
      resolve(parent, args) {
        /* return clients; // returning all clients from sample data */
        return Client.find(); // returning all clients from databse
      },
    },
    // fields objects are the queries
    client: {
      // a query called client will fetch a client
      type: ClientType, // set the type which you created up above
      args: { id: { type: GraphQLID } }, // to get a client should to specify which client we want to fetch - setting the id
      resolve(parent, args) {
        /* return clients.find((client) => client.id === args.id); // returning a client by id from sample data */
        return Client.findById(args.id); // returning a client by id
      },
    },
  },
});

//* Mutations, set that to new graphql object type
//* in other word, the CRUD functionality down blow
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // ********** add a client to MongodDB
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    //* delete a client from MongoDB
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },
    //************ add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          //! an Enum allows us to specify only a certain range of values
          //! it allows the three values as below
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          // the default value
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },
    //* delete a projet
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id); //! point to Project model and find it by id
      },
    },
    //* update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }, // we want only NonNull on the id =>
        name: { type: GraphQLString }, // the name and description field don't have to be specified
        description: { type: GraphQLString }, // when updating a project
        status: {
          //! an Enum allows us to specify only a certain range of values
          //! it allows the three values as below
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate", //? should be unique - there is another EnumType of this above
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" }, 
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

// export the file as a schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation, // just mutation, if we called it myMutation then: mutation: myMutation,
});
