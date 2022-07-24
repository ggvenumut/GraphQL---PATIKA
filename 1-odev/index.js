const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { events, users, locations, participants } = require("./data.json");
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Event {
    id: ID
    title: String
    desc: String
    date: String
    from: String
    to: String
    location: Int
    user_id: Int
    user: [User!]!
    participants: [Participant!]!
    locations: [Location!]!
  }

  type Location {
    id: ID!
    name: String
    desc: String
    lat: Int
    lng: Int
  }
  type Participant {
    id: ID!
    user_id: Int
    event_id: Int
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!

    events: [Event!]!
    event(id: ID!): Event!

    locations: [Location!]!
    location(id: ID!): Location!

    participants: [Participant!]!
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find((user) => Number(user.id) == args.id),

    events: () => events,
    event: (parent, args) =>
      users.find((event) => (event.id = Number(args.id))),

    locations: () => locations,
    location: (parent, args) =>
      users.find((location) => (Number(location.id) = args.id)),

    participants: () => participants,
    participant: (parent, args) =>
      users.find((participant) => (Number(participant.id) = args.id)),
  },
  Event: {
    user: (parent, args) => users.filter((user) => user.id === parent.user_id),
    participants: (parent, args) =>
      participants.filter((participant) => participant.id === parent.id),
    locations: (parent, args) =>
      locations.filter((location) => location.id === parent.location_id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen().then(({ url }) => {
  console.log(`graphQl server listening on ${url}`);
});
