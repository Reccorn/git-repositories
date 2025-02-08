import { createStore, createEvent, createEffect, sample } from 'effector'
import { useSearchParams } from 'react-router-dom'
import { searchRepositories } from '../api'
import { RepositoryEdge } from 'entities/repository/types'
import { useEffect } from 'react'

export const searchQueryChanged = createEvent<string>()
export const pageChanged = createEvent<number>()
export const mounted = createEvent()

export const fetchRepositoriesFx = createEffect<
    { query: string; first?: number; after?: string; last?: number; before?: string },
    { edges: RepositoryEdge[]; repositoryCount: number; pageInfo: { startCursor: string; endCursor: string; hasNextPage: boolean; hasPreviousPage: boolean } }
>(async ({ query, first, after, last, before }) => {
    const data = await searchRepositories(query || 'is:public', first, after, last, before)
    return {
        edges: data.edges,
        repositoryCount: data.repositoryCount,
        pageInfo: data.pageInfo,
    }
})

export const $repositories = createStore<RepositoryEdge[]>([])
export const $searchQuery = createStore<string>('')
export const $currentPage = createStore<number>(1)
export const $previousPage = createStore<number | null>(null)
export const $totalPages = createStore<number>(1)
export const $startCursor = createStore<string | null>(null)
export const $endCursor = createStore<string | null>(null)
export const $hasNextPage = createStore<boolean>(false)
export const $hasPreviousPage = createStore<boolean>(false)
export const $isLoading = fetchRepositoriesFx.pending

$searchQuery.on(searchQueryChanged, (_, query) => query)

$currentPage.on(pageChanged, (_, page) => page)

export const useSyncUrl = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const query = searchParams.get('search') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        searchQueryChanged(query)
        pageChanged(page)
        mounted()
    }, [searchParams])

    useEffect(() => {
        const params = new URLSearchParams();

        if ($searchQuery.getState()) {
            params.set('search', $searchQuery.getState());
        }

        if ($currentPage.getState() !== 1) {
            params.set('page', $currentPage.getState().toString());
        }

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params);
        }
    }, [$searchQuery.getState(), $currentPage.getState(), searchParams, setSearchParams])
};

sample({
    clock: [searchQueryChanged, pageChanged, mounted],
    source: { query: $searchQuery, currentPage: $currentPage, previousPage: $previousPage },
    fn: ({ query, currentPage, previousPage }) => {
        if (previousPage === null) {
            return {
                query,
                first: 10,
                after: undefined,
                last: undefined,
                before: undefined,
            };
        } else if (previousPage > currentPage) {
            return {
                query,
                last: 10,
                before: $startCursor.getState() || undefined,
                first: undefined,
                after: undefined,
            };
        } else if (previousPage < currentPage) {
            return {
                query,
                first: 10,
                after: $endCursor.getState() || undefined,
                last: undefined,
                before: undefined,
            };
        } else {
            return {
                query,
                first: 10,
                after: undefined,
                last: undefined,
                before: undefined,
            };
        }
    },
    target: fetchRepositoriesFx,
})

$repositories.on(fetchRepositoriesFx.doneData, (_, result) => result.edges)
$totalPages.on(fetchRepositoriesFx.doneData, (_, result) =>
    Math.min(Math.ceil(result.repositoryCount / 10), 10)
)

$previousPage.on(fetchRepositoriesFx.doneData, () => {
    return $currentPage.getState()
});

$startCursor.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.startCursor)

$endCursor.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.endCursor)

$hasNextPage.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.hasNextPage)

$hasPreviousPage.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.hasPreviousPage)
