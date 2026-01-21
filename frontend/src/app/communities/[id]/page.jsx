import { useContext, useEffect, useState } from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { PageContainer } from "../../../components/layout/PageContainer";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Tabs } from "../../../components/ui/Tabs";
import "../Communities.css";
import { getCommunityPosts, likePosts, unlikePosts } from "../../../lib/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BackButton } from "../../../components/ui/BackButton";
import { PostCard } from "../../../components/feed/PostCard";
import { PostCardSkeleton } from "../../../components/feed/PotCardSkeleton";
import { CommunityContext } from "../../../context/CommunityContext";
import { TaskItem } from "../../../components/community/TaskItem";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CommunityBanner } from "../../../components/community/CommunityBanner";
import { CommunityHeader } from "../../../components/community/CommunityHeader";
import { JoinButton } from "../../../components/community/JoinButton";
import { CreatePostModal } from "../../../components/feed/CreatePostModal";
import { PostContext } from "../../../context/PostContext";
import { NewPostButton } from "../../../components/feed/NewPostButton";
import { Tooltip } from "../../../components/ui/Tooltip";

export const CommunityPage = () => {
  const { communities, loading, fetchCommunities, toggleJoinCommunity } =
    useContext(CommunityContext);
  const { addPost } = useContext(PostContext);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Feed";
  const [active, setActive] = useState(tabFromUrl);
  const tabs = ["Feed", "Syllabus", "Notes"];
  const navigate = useNavigate();
  const community = communities.find((c) => c.id === Number(id));
  const communityJoined = community?.joined;

  useEffect(() => {
    if (communities.length === 0 && !loading) {
      fetchCommunities();
    }
  }, [communities.length, loading]);

  useEffect(() => {
    if (active === "Feed" && !postsFetched) {
      fetchCommunityPosts();
    }

    // if (active === "Syllabus" && !syllabus) {
    //     fetchCommunitySyllabus()
    // }

    // if (active === "Notes" && notes.length === 0) {
    //     fetchCommunityNotes()
    // }
  }, [active, id]);

  const fetchCommunityPosts = async () => {
    try {
      setPostsLoading(true);
      setError(null);
      const response = await getCommunityPosts(id);
      setPosts(response.data);
      setPostsFetched(true);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.postId === postId
          ? {
              ...post,
              likedByCurrentUser: true,
              likesCount: post.likesCount + 1,
            }
          : post,
      ),
    );

    try {
      await likePosts(postId);
    } catch {
      fetchCommunityPosts();
    }
  };

  const handelTabChange = (tab) => {
    setActive(tab);
    setSearchParams({ tab });
  };

  const handleUnlike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.postId === postId
          ? {
              ...post,
              likedByCurrentUser: false,
              likesCount: post.likesCount - 1,
            }
          : post,
      ),
    );

    try {
      await unlikePosts(postId);
    } catch {
      fetchCommunityPosts();
    }
  };

  const handleCommentAdded = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p,
      ),
    );
  };

  if (loading || !community) {
    return (
      <PageContainer>
        <Navbar />
        <div style={{ padding: "16px" }}>Loading community...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      <PageHeader className="community-page-header">
        <div className="first-row">
          {communityJoined && (
            <Tooltip label={"leave"}>
              <LogOut
                size={30}
                className={"leave-button"}
                onClick={() => {
                  toggleJoinCommunity(community.id);
                }}
              />
            </Tooltip>
          )}
        </div>
        <div className="second-row">
          <CommunityBanner streak={community.streak} id={id} view={"list"} />
          <CommunityHeader
            name={community.name}
            description={community.description}
            members={community.memberCount}
            streak={community.streak}
            view={"list"}
          />
          <div className="join-button">
            {communityJoined ? (
              <NewPostButton onClick={() => setShowCreatePost(true)} />
            ) : (
              <JoinButton
                joined={false}
                onClick={() => {
                  toggleJoinCommunity(community.id);
                }}
              />
            )}
          </div>
        </div>
        <div className="community-tabs">
          <Tabs tabs={tabs} active={active} onChange={handelTabChange} />
        </div>
      </PageHeader>
      <div className="main">
        {active === "Feed" &&
          (postsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : posts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onCommentAdded={handleCommentAdded}
                />
              )))}
        {active === "Syllabus" && <TaskItem />}
      </div>
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        joinedCommunities={[community]}
        onPostCreated={addPost}
      />
    </PageContainer>
  );
};
