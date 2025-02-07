import React from 'react'
import styles from './SearchInput.module.scss'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({value, onChange, placeholder}) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={styles.input}
        />
    )
}
