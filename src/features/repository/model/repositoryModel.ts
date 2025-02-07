import { createStore, createEvent, createEffect, sample } from 'effector';
import { useSearchParams } from 'react-router-dom';
import { searchRepositories } from '../api';
import { RepositoryEdge } from 'entities/repository/types';
import { useEffect } from 'react';

// События
export const searchQueryChanged = createEvent<string>();
export const pageChanged = createEvent<number>();
export const mounted = createEvent();

// Эффект для запроса репозиториев
export const fetchRepositoriesFx = createEffect<
    { query: string; cursor: string | null },
    { edges: RepositoryEdge[]; repositoryCount: number; pageInfo: { endCursor: string | null } }
>(async ({ query, cursor }) => {
    const data = await searchRepositories(query || 'is:public', 10, cursor || undefined);
    return {
        edges: data.search.edges,
        repositoryCount: data.search.repositoryCount,
        pageInfo: data.search.pageInfo,
    };
});

// Сторы
export const $repositories = createStore<RepositoryEdge[]>([]);
export const $searchQuery = createStore<string>('');
export const $currentPage = createStore<number>(1);
export const $totalPages = createStore<number>(1);
export const $endCursor = createStore<string | null>(null);
export const $isLoading = fetchRepositoriesFx.pending;

// Обновление состояния
$searchQuery.on(searchQueryChanged, (_, query) => query);
$currentPage.on(pageChanged, (_, page) => page);

// Логика синхронизации с URL
export const useSyncUrl = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Восстановление состояния из URL
    useEffect(() => {
        const query = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        searchQueryChanged(query);
        pageChanged(page);
        mounted();
    }, [searchParams]);

    // Обновление URL при изменении состояния
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
    }, [$searchQuery.getState(), $currentPage.getState(), searchParams, setSearchParams]);
};

// Логика для запроса данных
sample({
    clock: [searchQueryChanged, pageChanged, mounted], // Запуск при изменении поиска, страницы или монтировании
    source: { query: $searchQuery, page: $currentPage, cursor: $endCursor },
    fn: ({ query, page, cursor }) => {
        // Если страница изменилась, используем текущий курсор
        return {
            query,
            cursor: page === 1 ? null : cursor, // Сброс курсора для первой страницы
        };
    },
    target: fetchRepositoriesFx,
});

// Обновление данных после запроса
$repositories.on(fetchRepositoriesFx.doneData, (_, result) => result.edges);
$totalPages.on(fetchRepositoriesFx.doneData, (_, result) =>
    Math.min(Math.ceil(result.repositoryCount / 10), 10)
);
$endCursor.on(fetchRepositoriesFx.doneData, (_, result) => result.pageInfo.endCursor);
