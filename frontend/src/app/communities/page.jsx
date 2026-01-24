import { PageContainer } from "../../components/layout/PageContainer";
import { Navbar } from "../../components/layout/Navbar";
import { useContext, useEffect, useState } from "react";
import { CommunityContext } from "../../context/CommunityContext";
import { PageHeader } from "../../components/layout/PageHeader";
import { CommunityViewToggle } from "../../components/community/CommunityViewToggle";
import { CommunityList } from "../../components/community/CommunityList";
import { CommunityLeaveModal } from "../../components/community/CommunityLeaveModal";
import { useLeaveCommunity } from "../../hooks/useLeaveCommunity";

export const Communities = () => {
  const { communities, loading, toggleJoinCommunity } =
    useContext(CommunityContext);
  const leaveModal = useLeaveCommunity(toggleJoinCommunity);
  const [view, setView] = useState(
    () => localStorage.getItem("communityView") || "grid",
  );

  useEffect(() => {
    localStorage.setItem("communityView", view);
  }, [view]);

  // 🔑 called when user clicks "Leave"
  const handleLeaveClick = (community) => {
    leaveModal.open(community)
  };


  return (
    <PageContainer>
      <Navbar />

      <PageHeader
        title="Communities"
        description="Join challenge based communities and stay accountable"
      />

      <div className="main">
        <CommunityViewToggle view={view} setView={setView} />

        <CommunityList
          communities={communities}
          loading={loading}
          view={view}
          onLeave={handleLeaveClick}
          onJoin={toggleJoinCommunity}
        />
      </div>

      {/* ✅ Leave modal */}
      <CommunityLeaveModal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        onClick={leaveModal.confirm}
      />
    </PageContainer>
  );
};
