import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../../context/PostContext";
import { CommunityContext } from "../../../context/CommunityContext";
import { useParams, useSearchParams } from "react-router-dom";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Navbar } from "../../../components/layout/Navbar";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Tooltip } from "../../../components/ui/Tooltip";
import { LogOut } from "lucide-react";
import { NewPostButton } from "../../../components/feed/NewPostButton";
import { Tabs } from "../../../components/ui/Tabs";
import { PostCardSkeleton } from "../../../components/feed/PotCardSkeleton";
import { PostCard } from "../../../components/feed/PostCard";
import { CreatePostModal } from "../../../components/feed/CreatePostModal";
import { CommunityBanner } from "../../../components/community/CommunityBanner";
import { CommunityHeader } from "../../../components/community/CommunityHeader";
import "../Communities.css";

export const CommunityPage = () => {
  const { communities, loading, fetchCommunities, toggleJoinCommunity } =
    useContext(CommunityContext);

  const {
    posts,
    loading: postsLoading,
    likePost,
    unlikePost,
    handleCommentAdded,
    addPost,
  } = useContext(PostContext);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Feed";
  const [active, setActive] = useState(tabFromUrl);

  const tabs = ["Feed", "Syllabus", "Notes"];
  const community = communities.find((c) => c.id === Number(id));
  const communityJoined = community?.joined;

  const communityPosts = posts.filter(
    (post) => post.community.id === Number(id),
  );

  useEffect(() => {
    if (communities.length === 0 && !loading) {
      fetchCommunities();
    }
  }, [communities.length, loading]);

  const handelTabChange = (tab) => {
    setActive(tab);
    setSearchParams({ tab });
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
                className="leave-button"
                onClick={() => toggleJoinCommunity(community.id)}
              />
            </Tooltip>
          )}
        </div>

        <div className="second-row">
          <CommunityBanner streak={community.streak} id={id} view="list" />
          <CommunityHeader
            name={community.name}
            description={community.description}
            members={community.memberCount}
            streak={community.streak}
            view="list"
          />

          <div className="join-button">
            {communityJoined ? (
              <NewPostButton onClick={() => setShowCreatePost(true)} />
            ) : (
              <JoinButton
                joined={false}
                onClick={() => toggleJoinCommunity(community.id)}
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
            : communityPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  onLike={() => likePost(post.postId)}
                  onUnlike={() => unlikePost(post.postId)}
                  onCommentAdded={() => handleCommentAdded(post.postId)}
                />
              )))}

        {active === "Syllabus" && <TaskItem />}
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        joinedCommunities={[community]}
        defaultCommunityId={community.id}
        onPostCreated={addPost}
      />
    </PageContainer>
  );
};
