import { createStore, createEvent, createEffect, sample } from 'effector'
import { getRepositoryDetailsByName } from '../api'
import { Repository } from 'entities/repository/types'

export const repositoryNameChanged = createEvent<string>()
export const mounted = createEvent()

export const fetchRepositoryDetailsFx = createEffect<string, Repository>(async (name) => {
    return getRepositoryDetailsByName(name)
})

export const $repository = createStore<Repository | null>(null)
export const $isLoading = fetchRepositoryDetailsFx.pending

$repository.on(fetchRepositoryDetailsFx.doneData, (_, repository) => repository)

sample({
    clock: [repositoryNameChanged, mounted],
    source: $repository,
    fn: (_, name) => name,
    target: fetchRepositoryDetailsFx,
})
