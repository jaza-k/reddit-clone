import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import theme from '../theme'

// custom wrapper function to help cast the types
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

// create urql client
const client = createClient({ 
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [dedupExchange, cacheExchange({
    // update the cache, specifically the MeQuery, every time the mutation is run
    updates: {
      Mutation: {
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
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
          <CSSReset />
          <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
