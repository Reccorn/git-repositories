export interface Repository {
    id: string
    name: string
    stargazerCount: number
    updatedAt: string
    url: string
    owner: {
        login: string
        avatarUrl: string
    }
}

export interface RepositoryEdge {
    node: Repository
}
