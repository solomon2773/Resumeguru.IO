import { useMemo } from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import * as Realm from "realm-web";
import { concatPagination } from '@apollo/client/utilities'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

export const APOLLO_STATE_PROP_NAME_REALM = '__APOLLO_STATE_REALM__'
const RealmApp = new Realm.App(process.env.REALM_APP_ID);
let apolloClient

//import possibleTypes from './fragments/possibleTypes.json';
async function loginApiKey() {
    // Create an API Key credential
    const credentials = Realm.Credentials.apiKey(process.env.REALMAPP_API_KEY);
    // Authenticate the user
    const user = await RealmApp.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    // console.assert(user.id === RealmAppAPI.currentUser.id);
    return user;
}


async function getValidAccessToken() {
    // Guarantee that there's a logged in user with a valid access token
    if (!RealmApp.currentUser) {
        // If no user is logged in, log in an anonymous user. The logged in user will have a valid
        // access token.
        await loginApiKey();
    } else {
        // An already logged in user's access token might be stale. Tokens must be refreshed after
        // 30 minutes. To guarantee that the token is valid, we refresh the user's access token.
        await RealmApp.currentUser.refreshAccessToken();
    }
    return RealmApp.currentUser.accessToken;
}
async function loginCustomJwt(jwt) {
    // Create a Custom JWT credential
    const credentials = Realm.Credentials.jwt(jwt);
    try {
        // Authenticate the user
        const user = await app.logIn(credentials);
        // `App.currentUser` updates to match the logged in user
        console.assert(user.id === app.currentUser.id);
        return user;
    } catch (err) {
        console.error("Failed to log in", err);
    }
}

function createApolloClient() {
    return new ApolloClient({
        //ssrMode: true,//typeof window === 'undefined',
        link: new HttpLink({
            uri: process.env.MONGODB_APOLLO_CLIENT_URL,//process.env.GRAPHQL_API_URL, // Server URL
            //credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
            /////////////////////////////
            // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
            // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
            // access token before sending the request.
            fetch: async (uri, options) => {
                const accessToken = await getValidAccessToken();
                options.headers.Authorization = `Bearer ${accessToken}`;
                return fetch(uri, options);
            },
        }),
        cache: new InMemoryCache({
            //possibleTypes,
            // typePolicies: {
            //     Query: {
            //         fields: {
            //             allPosts: concatPagination(),
            //         },
            //     },
            // },
        }),
    })
}

export function initializeApolloRealm(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
        const data = merge(existingCache, initialState, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function addApolloStateRealm(client, pageProps) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME_REALM] = client.cache.extract()
    }

    return pageProps
}

export function useApolloRealm(pageProps) {
    const state = pageProps[APOLLO_STATE_PROP_NAME_REALM]
    const store = useMemo(() => initializeApolloRealm(state), [state])
    return store
}
