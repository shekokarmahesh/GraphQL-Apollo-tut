/**
 * GraphQL server (Apollo Server - standalone)
 *
 * This file bootstraps a minimal GraphQL API backed by an in-memory array of users.
 * It demonstrates a basic schema (typeDefs) and matching resolvers for queries
 * and a mutation. Data is NOT persisted and will reset on every server restart.
 *
 * How to run:
 *   - Install deps in `server/`: npm install
 *   - Start: node server.js (or via your chosen runner)
 *   - The server exposes a GraphQL endpoint with a built-in landing page.
 */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// In-memory data store used for demo purposes only
const users = [
  { id: "1", name: "John Doe", age: 30, isMarried: true },
  { id: "2", name: "Jane Smith", age: 25, isMarried: false },
  { id: "3", name: "Alice Johnson", age: 28, isMarried: false },
  // Additional sample users with Indian names
  { id: "4", name: "Aarav Sharma", age: 27, isMarried: false },
  { id: "5", name: "Priya Patel", age: 24, isMarried: false },
  { id: "6", name: "Rahul Verma", age: 32, isMarried: true },
  { id: "7", name: "Ananya Iyer", age: 29, isMarried: false },
  { id: "8", name: "Vikram Singh", age: 35, isMarried: true },
  { id: "9", name: "Neha Kapoor", age: 26, isMarried: false },
  { id: "10", name: "Aditi Nair", age: 31, isMarried: true },
  { id: "11", name: "Rohan Gupta", age: 23, isMarried: false },
  { id: "12", name: "Kavya Reddy", age: 28, isMarried: false },
  { id: "13", name: "Sanjay Mehta", age: 34, isMarried: true },
];

// GraphQL Schema Definition Language (SDL)
// Notes:
// - Comments starting with `#` are ignored by the GraphQL parser and serve as documentation.
const typeDefs = `
    # Root-level read-only operations
    type Query {
      # Returns all users
      getUsers: [User]

      # Returns a single user by unique identifier
      getUserById(id: ID!): User
    }

    # Root-level write operations
    type Mutation {
      # Creates a new user and returns it
      createUser(name: String!, age: Int!, isMarried: Boolean!): User
    }

    # User domain model
    type User {
      # Unique identifier
      id: ID

      # Full name of the user
      name: String

      # Age in years
      age: Int

      # Marital status flag
      isMarried: Boolean
    }
`;

const resolvers = {
  Query: {
    // Resolver to return all users
    getUsers: () => {
      return users;
    },
    // Resolver to return a single user by ID
    getUserById: (parent, args) => {
      const id = args.id;
      return users.find((user) => user.id === id);
    },
  },
  Mutation: {
    // Resolver to create and return a new user
    createUser: (parent, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      console.log(newUser);
      users.push(newUser);
      // Note: The schema specifies that this mutation returns a User.
      // Returning the created entity allows clients to receive the new record immediately.
      // Example:
      // return newUser;
    },
  },
};

// Create Apollo Server instance with the schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start a standalone HTTP server on the specified port.
// Top-level await is used here for brevity in a single-file example.
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

// Log the server URL so you can open the landing page in the browser
console.log(`Server Running at: ${url}`);
