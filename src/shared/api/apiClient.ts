import { GraphQLClient } from 'graphql-request'

export const apiClient = new GraphQLClient(import.meta.env.VITE_GITHUB_API_URL, {
    headers: {
        authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
})
