import { useNavigate, NavLink } from "react-router-dom"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { CommunityBanner } from "./CommunityBanner"
import { CommunityHeader } from "./CommunityHeader"
import "./CommunityCard.css"

export const CommunityCard = ({ id, name, description, memberCount, joined, streak }) => {

    const navigate = useNavigate()
    const CATEGORY_COLORS = {
        1: "#2563eb",
        2: "#22c55e",
        3: "#9333ea",
        4: "#f97316",
        5: "#ef4444",
        6: "#14b8a6",
    };
    return (
        <Card variant="community-card"
            onClick={() => navigate(`/communities/${id}`)}
        >
            <CommunityBanner streak={streak} bannerColor={CATEGORY_COLORS[id]} />
            <CommunityHeader name={name} description={description} members={memberCount} />
            <div className="community-card-footer">
                <Button
                    variant={`community-join-button ${joined ? "joined" : ""}`}
                >
                    {joined ? "Joined" : "Join"}
                </Button>
            </div>
        </Card>
    )
}