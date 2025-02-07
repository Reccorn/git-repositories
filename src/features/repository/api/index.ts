import { apiClient } from 'shared/api/apiClient'

export const searchRepositories = async (query: string, first: number, after?: string) => {
    const searchQuery = `
    query SearchRepositories($query: String!, $first: Int!, $after: String) {
      search(query: $query, type: REPOSITORY, first: $first, after: $after) {
        repositoryCount
        edges {
          node {
            ... on Repository {
              id
              name
              stargazerCount
              updatedAt
              url
              owner {
                login
                avatarUrl
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `

    const variables = { query, first, after }
    return apiClient.request(searchQuery, variables)
}
