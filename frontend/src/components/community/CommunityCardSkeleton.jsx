import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import "./CommunityCard.css";
import "./CommunityHeader.css";
import "./CommunityBanner.css";

export const CommunityCardSkeleton = () => {
    return (
        <Card variant="community-card">
            {/* Banner */}
            <div className="community-banner">
                <Skeleton width="40px" height="40px" circle />
                <Skeleton width="60px" height="20px" />
            </div>

            {/* Header */}
            <div className="community-header">
                <Skeleton width="60%" height="20px" />
                <Skeleton width="90%" height="14px" />

                <div className="community-stats">
                    <Skeleton width="70px" height="20px" />
                    <Skeleton width="70px" height="20px" />

                </div>

                <div className="community-details">
                    <Skeleton width="100px" height="16px" />
                </div>
            </div>

            {/* Footer */}
            <div className="community-card-footer">
                <Skeleton width="100%" height="44px" />
            </div>
        </Card>
    );
};
