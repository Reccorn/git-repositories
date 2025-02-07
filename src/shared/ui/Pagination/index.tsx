import React from 'react'
import styles from './Pagination.module.scss'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={styles.paginator}>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                    {page}
                </button>
            ))}
        </div>
    )
}
