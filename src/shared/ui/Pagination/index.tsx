import React from 'react'
import styles from './Pagination.module.scss'

interface PaginationProps {
    currentPage: number
    totalPages: number
    hasPreviousPage: boolean
    onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, hasPreviousPage, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className={styles.paginator}>
            {hasPreviousPage && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Back
                </button>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Forward
            </button>
        </div>
    )
}
