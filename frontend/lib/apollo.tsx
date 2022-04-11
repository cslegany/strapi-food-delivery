import { ApolloClient, InMemoryCache } from "@apollo/client";
import { withApollo } from "next-apollo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"

const apolloClient = new ApolloClient({
    uri: `${API_URL}/graphql`, // Server URL (must be absolute)
    cache: new InMemoryCache(),
  });
  
export default withApollo(apolloClient);