const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean
});

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type Todo{
      id: ID!
      text: String!
      complete: Boolean!
  }
  type Mutation{
      createTodo(text: String!): Todo
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, complete: False });
      await todo.save(function(err, todo) {
        if (err) return console.log(err);
        console.log("Document Saved");
      });
      return todo;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
