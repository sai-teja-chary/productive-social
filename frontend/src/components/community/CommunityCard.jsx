import { useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { CommunityBanner } from "./CommunityBanner";
import { CommunityHeader } from "./CommunityHeader";
import "./CommunityCard.css";
import { JoinButton } from "./JoinButton";

export const CommunityCard = ({
  id,
  name,
  description,
  memberCount,
  joined,
  streak,
  view,
  className,
  clickable = true,
  onJoin,
  onLeave,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      className={`community-card ${view === "list" ? "list" : ""} ${className}`}
      onClick={clickable ? () => navigate(`/communities/${id}`) : undefined}
    >
      <CommunityBanner streak={streak} id={id} view={view} />

      <CommunityHeader
        name={name}
        description={description}
        members={memberCount}
        streak={streak}
        view={view}
      />

      <div className={`community-card-footer ${view === "list" ? "list" : ""}`}>
        {(onJoin || onLeave) && (
          <JoinButton
            id={id}
            joined={joined}
            onClick={(e) => {
              e.stopPropagation();

              if (joined) {
                onLeave();
              } else {
                onJoin();
              }
            }}
          />
        )}
      </div>
    </Card>
  );
};
