import React, {useEffect, useState} from "react";

interface User {
    _id: string,
    username: string,
}

interface SearchUserProps {
    onSelectUser: (user: User) => void
}

const SearchUsers: React.FC<SearchUserProps> = ({onSelectUser}) => {
    const [searchText, setSearchText] = useState<string>('')
    const [searchResults, setSearchResults] = useState<User[]>([])


    useEffect(() => {
        const fetchUsers = async (searchText: string) => {
            try {
                const response = await fetch(`http://localhost:3000/api/users?username=${searchText}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch users.')
                }
                const data = await response.json()
                if (data) {
                    setSearchResults(data)
                } else {
                    setSearchResults([])
                }
            } catch (err) {
                console.error('Error fetching users:', err)
            }
        };

        if (searchText !== '') {
            fetchUsers(searchText);
        }
    }, [searchText]);

    return (
        <div>
            <input
                type='text'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}/>
            <div>
                <h2>Search Results:</h2>
                {searchResults.map((user) => (
                    <div key={user._id} onClick={() => onSelectUser(user)}>
                        {user.username}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchUsers;