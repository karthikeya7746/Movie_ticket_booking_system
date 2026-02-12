import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// In dev, use same origin so Vite proxy forwards /api to backend. In prod, use backend URL.
axios.defaults.baseURL = import.meta.env.DEV ? '' : (import.meta.env.VITE_BASE_URL || '')

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [showsFetchError, setShowsFetchError] = useState(null)
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async ()=>{
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchShows = async ()=>{
        setShowsFetchError(null)
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows || [])
            }else{
                setShowsFetchError(data.message || 'API returned no movies')
                toast.error(data.message)
            }
        } catch (error) {
            const backendMsg = error.response?.data?.message
            const msg = error.response?.status === 404
                ? 'Backend URL not found. Set VITE_BASE_URL to your backend URL and redeploy frontend.'
                : backendMsg || error.message || 'Could not reach backend. Check CORS and VITE_BASE_URL.'
            setShowsFetchError(msg)
            console.error('Fetch shows failed:', error?.config?.baseURL, error?.config?.url, error.message)
        }
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const { data } = await axios.get('/api/user/favorites', {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setFavoriteMovies(data.movies)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchShows()
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    },[user])

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, showsFetchError, fetchShows,
        favoriteMovies, fetchFavoriteMovies, image_base_url
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)