import React, { useEffect } from 'react'
import { useUnit } from 'effector-react'
import {
    $repository,
    $isLoading,
    repositoryNameChanged,
    mounted,
} from 'features/repository-details/model'
import { useParams } from 'react-router-dom'

export const RepositoryPage: React.FC = () => {
    const { name } = useParams<{ name: string }>()
    const [repository, isLoading] = useUnit([$repository, $isLoading])
    const [handleRepositoryNameChange, handleMounted] = useUnit([repositoryNameChanged, mounted])

    useEffect(() => {
        if (name) {
            handleRepositoryNameChange(name)
            handleMounted()
        }
    }, [name, handleRepositoryNameChange, handleMounted])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!repository) {
        return <div>Repository not found.</div>;
    }

    return (
        <div>
            <h1>{repository.name}</h1>
            <p>⭐ {repository.stargazerCount}</p>
            <p>Last updated: {new Date(repository.updatedAt).toLocaleDateString()}</p>
            <img src={repository.owner.avatarUrl} alt={repository.owner.login} />
            <p>
                Owner: <a href={repository.owner.url}>{repository.owner.login}</a>
            </p>
            <p>Languages: {repository.languages.nodes.map((lang) => lang.name).join(', ')}</p>
            <p>{repository.description}</p>
        </div>
    )
}
