var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");
var db = require('./restaurants.json');

var restaurants = db.data.restaurants

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant : (arg) => {
    let rest = restaurants.filter((item) => item.id === arg.id);
    return rest[0]
  },
  restaurants : () => {
    return restaurants
  },
  setrestaurant : ({input}) => {
    restaurants.push({name:input.name,email:input.email,age:input.age})
    return input
  },
  deleterestaurant : ({id})=>{
    const ok = Boolean(restaurants[id])
    let delc = restaurants[id];
    restaurants = restaurants.filter(item => item.id !== id)
    console.log(JSON.stringify(delc)) 
    return {ok}
  },
  editrestaurant: ({id, ...restaurant}) => {
    if(!restaurants[id]) {
      throw new Error("restaurant doesn't exist")
    }
    restaurants[id] = {
    ...restaurants[id],...restaurant
    }
    return restaurants[id]
  }
}
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

