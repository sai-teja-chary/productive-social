import { Flame } from "lucide-react"
import robotIcon from "../../assets/icons/robot.svg"
import { Badge } from "../ui/Badge"
import "./CommunityBanner.css"

export const CommunityBanner = ({ streak, bannerColor, view }) => {
    return (
        view === "grid" ? <div style={{ backgroundColor: bannerColor }} className="community-banner">
            <img className="community-banner-icon" src={robotIcon} alt="banner-icon" />
            <Badge variant="white-badge" label={streak ? `${streak}d` : "0d"} icon={<Flame size={14} />} />
        </div>

            : <div style={{ backgroundColor: bannerColor }} className="community-banner-list">
                <img className="community-banner-icon" src={robotIcon} alt="banner-icon" />
            </div>
    )
}