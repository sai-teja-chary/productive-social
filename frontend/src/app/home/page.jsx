import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { PostCard } from "../../components/feed/PostCard"
import { NewPostButton } from "../../components/feed/NewPostButton"
import { PageHeader } from "../../components/layout/PageHeader"
import "../../App.css"
import { useContext, useState } from "react"
import { PostContext } from "../../context/PostContext"
import { PostCardSkeleton } from "../../components/feed/PotCardSkeleton"
import { CommunityContext } from "../../context/CommunityContext"
import { CreatePostModal } from "../../components/feed/CreatePostModal"

export const Home = () => {
    const { globalPosts, loading, handleCommentAdded } = useContext(PostContext)
    const { communities } = useContext(CommunityContext)
    const [showCreatePost, setShowCreatePost] = useState(false)

    if (loading) return <div>Loading.....</div>

    const joinedCommunitiesMap = new Map(
        communities
            .filter(c => c.joined)
            .map(c => [c.id, c])
    );


    const joinedPosts = globalPosts.filter(
        post => joinedCommunitiesMap.has(post.community.id)
    );


    const joinedCommunityOptions = Array.from(
        joinedCommunitiesMap.values()
    )

    return (
        <PageContainer>
            <Navbar />
            <PageHeader title="Global Feed" description="Join challenge-based communities and stay accountable"
            ><NewPostButton onClick={() => setShowCreatePost(true)} /></PageHeader>
            <div className="main">
                {joinedPosts.length === 0
                    ? <div>No posts yet from your communities</div>
                    :
                    loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))
                        : joinedPosts.map(post => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                onCommentAdded={handleCommentAdded}
                            />
                        ))
                }

            </div>
            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
                joinedCommunities={joinedCommunityOptions}
            />
        </PageContainer>
    )
}