import { apiClient } from 'shared/api/apiClient'
import { Repository } from 'entities/repository/types'

export const getRepositoryDetailsByName = async (name: string): Promise<Repository | null> => {
    const query = `
    query GetRepositoryDetailsByName($name: String!) {
      search(query: $name, type: REPOSITORY, first: 1) {
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
                url
              }
              languages(first: 10) {
                nodes {
                  name
                }
              }
              description
            }
          }
        }
      }
    }
  `

    const variables = { name: `in:name ${name}` }
    const data = await apiClient.request(query, variables)

    return data.search.edges.length > 0 ? data.search.edges[0].node : null
}
