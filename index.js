const { GraphQLServer } = require("graphql-yoga");

const typeDefs = `
  type Query {
    viewer: User
  }

  type User {
    id: ID!
    email: String!
    messages: [Message]!
  }

  type Message {
    id: ID!,
    author: User
    text: String!
  }
`;

const db = {
  messages: [{ id: "message.1", text: "hello", author: "user.1" }],
  users: [
    {
      id: "user.1",
      email: "didierfranc@me.com",
      messages: [{ id: "message.1" }]
    }
  ]
};

const resolvers = {
  Query: {
    viewer: () => {
      return db.users.find(user => user.id === "user.1");
    }
  },
  User: {
    messages: ({ messages }) => {
      const ids = messages.map(message => message.id);
      return db.messages.filter(message => ids.includes(message.id));
    }
  },
  Message: {
    author: ({ author: id }) => {
      return db.users.find(user => user.id === id);
    }
  }
};

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({ typeDefs, resolvers });
server.start({ playground: "/", port: PORT, endpoint: "/graphql" }, () =>
  console.log(`Server is running on localhost:${PORT}`)
);
