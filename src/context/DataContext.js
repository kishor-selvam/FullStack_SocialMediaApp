import { createContext, useState, useEffect } from "react";
import useWindowSize from '../hooks/useWindowSize'
import useAxiosFetch from '../hooks/useAxiosFetch'
import Axios from '../Api/Axios'
import { format } from 'date-fns'
import { useNavigate } from "react-router-dom";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [postTitle, setPostTitle] = useState('')
    const [postBody, setPostBody] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [editBody, setEditBody] = useState('')
    const navigate = useNavigate()
    const { width } = useWindowSize();
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts')

    useEffect(() => {
        const filterResults = posts.filter((post) =>
            ((post.body).toLowerCase()).includes(search.toLowerCase())
            || ((post.title).toLowerCase()).includes(search.toLowerCase()));

        setSearchResult(filterResults.reverse());
    }, [posts, search])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try {
            const response = await Axios.post('/posts', newPost)
            const allPosts = [...posts, response.data]
            setPosts(allPosts)
            setPostTitle('')
            setPostBody('')
            navigate('/')
        } catch (err) {
            if (err.response) {
                console.log(err.response.data)
                console.log(err.response.status)
                console.log(err.response.header)
            }
            else {
                console.log(`Error : ${err.message}`)
            }
        }
    }

    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPosts = { id, title: editTitle, datetime, body: editBody };
        try {
            const response = await Axios.put(`posts/${id}`, updatedPosts)
            setPosts(posts.map(post => post.id === id ? (
                { ...response.data }
            ) : post))
            setEditTitle('')
            setEditBody('')
            navigate('/')
        }
        catch (err) {
            console.log(err.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            await Axios.delete(`posts/${id}`)
            const postsList = posts.filter(post => post.id !== id);
            setPosts(postsList);
            navigate('/')

        }
        catch (err) {
            console.log(`Error : ${err.message}`)
        }

    }
    useEffect(() => {
        setPosts(data);
    }, [data])
    return (
        <DataContext.Provider value={{
            width, search, setSearch, fetchError, isLoading, searchResult, handleSubmit, postTitle, setPostTitle, postBody, setPostBody, posts, handleEdit, editTitle, setEditTitle, editBody, setEditBody, handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}


export default DataContext