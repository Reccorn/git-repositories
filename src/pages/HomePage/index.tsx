import React from 'react'
import { useUnit } from 'effector-react'
import { RepositoryList } from 'features/repository/ui/RepositoryList'
import { SearchInput, Pagination } from 'shared/ui'
import {
    $repositories,
    $searchQuery,
    $currentPage,
    $totalPages,
    $hasPreviousPage,
    $isLoading,
    searchQueryChanged,
    pageChanged,
    useSyncUrl,
} from 'features/repository/model/repositoryModel'

export const HomePage: React.FC = () => {
    useSyncUrl()

    const [repositories, searchQuery, currentPage, totalPages, hasPreviousPage, isLoading] = useUnit([
        $repositories,
        $searchQuery,
        $currentPage,
        $totalPages,
        $hasPreviousPage,
        $isLoading,
    ])

    const [handleSearchQueryChange, handlePageChange] = useUnit([searchQueryChanged, pageChanged])

    return (
        <div>
            <SearchInput
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search"
            />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <RepositoryList repositories={repositories} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        hasPreviousPage={hasPreviousPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    )
}
