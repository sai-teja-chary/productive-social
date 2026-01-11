import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { PostCard } from "../../components/feed/PostCard"
import { NewPostButton } from "../../components/feed/NewPostButton"
import { PageHeader } from "../../components/layout/PageHeader"
import "../../App.css"
import { useContext } from "react"
import { PostContext } from "../../context/PostContext"
import { PostCardSkeleton } from "../../components/feed/PotCardSkeleton"

export const Home = () => {
    const { globalPosts, loading, handleCommentAdded } = useContext(PostContext)

    if (loading) return <div>Loading.....</div>

    return (
        <PageContainer>
            <Navbar />
            <PageHeader title="Global Feed" description="Join challenge-based communities and stay accountable"
            ><NewPostButton /></PageHeader>
            <div className="main">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))
                    : globalPosts.map(post => (
                        <PostCard
                            key={post.postId}
                            post={post}
                            onCommentAdded={handleCommentAdded}
                        />
                    ))
                }

            </div>
        </PageContainer>
    )
}