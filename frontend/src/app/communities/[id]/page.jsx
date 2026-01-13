import { useContext, useEffect, useState } from "react"
import { CommunityCard } from "../../../components/community/CommunityCard"
import { Navbar } from "../../../components/layout/Navbar"
import { PageContainer } from "../../../components/layout/PageContainer"
import { PageHeader } from "../../../components/layout/PageHeader"
import { Tabs } from "../../../components/ui/Tabs"
import "../Communities.css"
import { getCommunity, getCommunityPosts, joinCommunity, leaveCommunity, likePosts, unlikePosts } from "../../../lib/api"
import { useNavigate, useParams } from "react-router-dom"
import backIcon from "../../../assets/icons/backarrow.svg"
import { PostCard } from "../../../components/feed/PostCard"
import { PostCardSkeleton } from "../../../components/feed/PotCardSkeleton"
import { CommunityContext } from "../../../context/CommunityContext"

export const CommunityPage = () => {
    const { communities, loading, fetchCommunities, toggleJoinCommunity } = useContext(CommunityContext);
    const [posts, setPosts] = useState([])
    const { id } = useParams()
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsFetched, setPostsFetched] = useState(false);
    const [error, setError] = useState(null)
    const [active, setActive] = useState("Feed")
    const tabs = ["Feed", "Syllabus", "Notes"]
    const navigate = useNavigate()
    const community = communities.find(c => c.id === Number(id))


    useEffect(() => {
        if (communities.length === 0 && !loading) {
            fetchCommunities()
        }
    }, [communities.length, loading]);

    useEffect(() => {
        if (active === "Feed" && !postsFetched) {
            fetchCommunityPosts()
        }

        // if (active === "Syllabus" && !syllabus) {
        //     fetchCommunitySyllabus()
        // }

        // if (active === "Notes" && notes.length === 0) {
        //     fetchCommunityNotes()
        // }
    }, [active, id])

    const fetchCommunityPosts = async () => {
        try {
            setPostsLoading(true);
            setError(null);
            const response = await getCommunityPosts(id);
            setPosts(response.data);
            setPostsFetched(true)
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setPostsLoading(false);
        }
    };

    const handleLike = async (postId) => {
        setPosts(prev =>
            prev.map(post =>
                post.postId === postId
                    ? {
                        ...post,
                        likedByCurrentUser: true,
                        likesCount: post.likesCount + 1
                    }
                    : post
            )
        );

        try {
            await likePosts(postId);
        } catch {
            fetchCommunityPosts();
        }
    };

    const handleUnlike = async (postId) => {
        setPosts(prev =>
            prev.map(post =>
                post.postId === postId
                    ? {
                        ...post,
                        likedByCurrentUser: false,
                        likesCount: post.likesCount - 1
                    }
                    : post
            )
        );

        try {
            await unlikePosts(postId);
        } catch {
            fetchCommunityPosts();
        }
    };

    const handleCommentAdded = (postId) => {
        setPosts(prev =>
            prev.map(p =>
                p.postId === postId
                    ? { ...p, commentsCount: p.commentsCount + 1 }
                    : p
            )
        );
    };


    return (
        <PageContainer>
            <Navbar />
            <PageHeader className="community-page-header">
                <img className="backarrow" onClick={() => navigate(-1)} src={backIcon} alt="back" />
                <CommunityCard
                    className="community-details"
                    id={community.id}
                    view="list"
                    name={community.name}
                    description={community.description}
                    memberCount={community.memberCount}
                    joined={community.joined}
                    clickable={false}
                    onToggleJoin={toggleJoinCommunity}

                />
                <div className="community-tabs">
                    <Tabs
                        tabs={tabs}
                        active={active}
                        onChange={setActive}
                    />
                </div>
            </PageHeader>
            <div className="main">
                {active === "Feed" && (
                    postsLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))
                        : posts.map(post => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                onLike={handleLike}
                                onUnlike={handleUnlike}
                                onCommentAdded={handleCommentAdded}
                                clickable={false}
                            />
                        ))
                )}
            </div>
        </PageContainer>
    )
}