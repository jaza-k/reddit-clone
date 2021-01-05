import { dedupExchange, fetchExchange } from "urql";
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generated/graphql";
import { cacheExchange } from '@urql/exchange-graphcache';
import { betterUpdateQuery } from "./betterUpdateQuery";

// create urql client
export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include',
    },
    exchanges: [dedupExchange, cacheExchange({
      // update the cache, specifically the MeQuery, every time the mutation is run
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null}) // set the me value to null
            );
          },
  
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache, 
              { query: MeDocument }, 
              _result,
              (result, query) => {
                if (result.login.errors) { // if the result is an error, return current query
                  return query
                }
                else {
                  return { // otherwise update the query
                    me: result.login.user,
                  };
                }
              }
            );
          },
  
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache, 
              { query: MeDocument }, 
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query
                }
                else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          }
  
        },
      },
    }), fetchExchange],
})