import { apiClient } from 'shared/api/apiClient'

export const searchRepositories = async (
    query: string,
    first?: number,
    after?: string, // Тип string | undefined
    last?: number,
    before?: string // Тип string | undefined
) => {
    const searchQuery = `
    query SearchRepositories($query: String!, $first: Int, $after: String, $last: Int, $before: String) {
      search(query: $query, type: REPOSITORY, first: $first, after: $after, last: $last, before: $before) {
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
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

    const variables = { query, first, after, last, before }
    const data = await apiClient.request(searchQuery, variables)
    return data.search
}
