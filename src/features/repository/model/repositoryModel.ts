import { createStore, createEvent, createEffect, sample } from 'effector'
import { useSearchParams } from 'react-router-dom'
import { searchRepositories } from '../api'
import { RepositoryEdge } from 'entities/repository/types'
import { useEffect } from 'react'

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
export const $prevCursor = createStore<string | null>(null)
export const $hasNextPage = createStore<boolean>(false)
export const $hasPreviousPage = createStore<boolean>(false)
export const $isLoading = fetchRepositoriesFx.pending
export const $isInitialized = createStore<boolean>(false)

export const searchQueryChanged = createEvent<string>()
export const pageChanged = createEvent<number>()
export const prevCursorChanged = createEvent<string | null>()
export const mounted = createEvent()
export const initialized = createEvent()

$searchQuery.on(searchQueryChanged, (_, query) => query)

$currentPage.on(pageChanged, (_, page) => page)

$prevCursor.on(prevCursorChanged, (_, cursor) => cursor)

$prevCursor.on(pageChanged, () => $endCursor.getState())

$hasPreviousPage.on(prevCursorChanged, (_, cursor) => cursor && cursor.length > 0)

$isInitialized.on(initialized, () => true)

export const useSyncUrl = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const query = searchParams.get('search') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const after = searchParams.get('after') || null

        searchQueryChanged(query)
        pageChanged(page)
        prevCursorChanged(after)
        mounted()
        initialized()
    }, [searchParams])

    useEffect(() => {
        const params = new URLSearchParams();

        if ($searchQuery.getState()) {
            params.set('search', $searchQuery.getState());
        }

        if ($currentPage.getState() !== 1) {
            params.set('page', $currentPage.getState().toString())
        }

        if ($prevCursor.getState() && $currentPage.getState() !== 1) {
            params.set('after', $prevCursor.getState())
        }

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params);
        }
    }, [$searchQuery.getState(), $currentPage.getState(), $prevCursor.getState(), searchParams, setSearchParams]);
};

sample({
    clock: [searchQueryChanged, pageChanged, mounted],
    source: { query: $searchQuery, currentPage: $currentPage, previousPage: $previousPage, isInitialized: $isInitialized },
    fn: ({ query, currentPage, previousPage, isInitialized }) => {
        if (!isInitialized) {
            return null
        }

        const baseQuery = {
            query,
            first: 10,
            after: $prevCursor.getState() || undefined,
            last: undefined,
            before: undefined,
        }

        if (previousPage === null) {
            return baseQuery
        } else if (previousPage > currentPage) {
            return {
                query,
                last: 10,
                before: $startCursor.getState() || undefined,
                first: undefined,
                after: undefined,
            }
        } else if (previousPage < currentPage) {
            return {
                query,
                first: 10,
                after: $endCursor.getState() || undefined,
                last: undefined,
                before: undefined,
            }
        } else {
            return baseQuery
        }
    },
    target: fetchRepositoriesFx,
})

$repositories.on(fetchRepositoriesFx.doneData, (_, result) => result.edges)
$totalPages.on(fetchRepositoriesFx.doneData, (_, result) =>
    Math.min(Math.ceil(result.repositoryCount / 10), 10)
)

$previousPage.on(fetchRepositoriesFx.doneData, () => $currentPage.getState())

$endCursor.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.endCursor)

$startCursor.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.startCursor)

$hasNextPage.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.hasNextPage)

$hasPreviousPage.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.hasPreviousPage)
