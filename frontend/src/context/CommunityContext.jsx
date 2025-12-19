import { createContext, useEffect, useState } from "react";
import { getCommunities } from "../lib/api";


export const CommunityContext = createContext()

export const CommunityProvider = ({ children }) => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCommunities()
    }, [])

    const fetchCommunities = async () => {
        try {
            setLoading(true)
            const res = await getCommunities()
            const sorted = [...res.data].sort((a, b) => {
                if (a.joined !== b.joined) {
                    return Number(b.joined) - Number(a.joined);
                }
                return b.memberCount - a.memberCount;
            });
            setCommunities(sorted)

        } catch (error) {
            console.error(error)
            setError(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <CommunityContext.Provider value={{ communities, loading, error, fetchCommunities }}>
            {children}
        </CommunityContext.Provider>
    );
}