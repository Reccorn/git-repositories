import React from 'react'
import { RepositoryEdge } from 'entities/repository/types.ts'
import styles from './RepositoryList.module.scss'

interface RepositoryListProps {
    repositories: RepositoryEdge[]
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
    if (repositories.length === 0) {
        return <div>No repositories found.</div>
    }

    return (
        <ul className={styles.list}>
            {repositories.map(({ node }) => (
                <li key={node.id} className={styles.item}>
                    <div className={styles.name}>
                        <a href={'/repository/' + node.name} target="_blank" rel="noopener noreferrer">
                            {node.name}
                        </a>
                    </div>
                    <div className={styles.details}>
                        <span>⭐ {node.stargazerCount}</span>
                        <span>Last updated: {new Date(node.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.link}>
                        <a href={node.url} target="_blank" rel="noopener noreferrer">
                            Visit on GitHub
                        </a>
                    </div>
                    <div className={styles.owner}>
                        <img src={node.owner.avatarUrl} alt={node.owner.login} className={styles.avatar}/>
                        <a href={`https://github.com/${node.owner.login}`} target="_blank" rel="noopener noreferrer">
                            {node.owner.login}
                        </a>
                    </div>
                </li>
            ))}
        </ul>
    )
}
