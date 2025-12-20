import { createContext, useContext, useEffect, useState } from "react";
import { getCommunities } from "../lib/api";
import { AuthContext } from "./AuthContext";
import { joinCommunity, leaveCommunity } from "../lib/api"

export const CommunityContext = createContext()

export const CommunityProvider = ({ children }) => {
    const {user} = useContext(AuthContext)
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!user){
            setCommunities([]);
            return;
        }
        fetchCommunities();
    }, [user]);

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

    const toggleJoinCommunity = async (communityId) =>{
        setCommunities(prev =>
            prev.map(c =>
                c.id === communityId
                ? { ...c, joined: !c.joined}
                : c
            )
        );

        try {
            const community = communities.find(c => c.id === communityId);
            if(!community.joined){
                await joinCommunity(communityId);
            }else{
                await leaveCommunity(communityId);
            }
        } catch (error) {
            setCommunities(prev =>
                prev.map(c=>
                    c.id === communityId
                    ? { ...c, joined: !c.joined}
                    : c
                )
            );
            console.error(error);
        }
    }

    return (
        <CommunityContext.Provider value={{ communities, loading, error, fetchCommunities, toggleJoinCommunity }}>
            {children}
        </CommunityContext.Provider>
    );
}