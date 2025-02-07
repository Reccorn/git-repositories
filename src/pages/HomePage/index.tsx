import React from 'react';
import { useUnit } from 'effector-react';
import { RepositoryList } from 'features/repository/ui/RepositoryList';
import { Pagination } from 'shared/ui/Pagination';
import { SearchInput } from 'shared/ui/SearchInput';
import {
    $repositories,
    $searchQuery,
    $currentPage,
    $totalPages,
    $isLoading,
    searchQueryChanged,
    pageChanged,
    useSyncUrl,
} from 'features/repository/model/repositoryModel';

export const HomePage = () => {
    // Синхронизация с URL (включая mounted)
    useSyncUrl();

    // Подписка на сторы
    const [repositories, searchQuery, currentPage, totalPages, isLoading] = useUnit([
        $repositories,
        $searchQuery,
        $currentPage,
        $totalPages,
        $isLoading,
    ]);

    // Подписка на события
    const [handleSearchQueryChange, handlePageChange] = useUnit([searchQueryChanged, pageChanged]);

    return (
        <div>
            <SearchInput
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search repositories..."
            />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <RepositoryList repositories={repositories} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};
