import { Avatar } from "../ui/Avatar"
import { Badge } from "../ui/Badge"
import "./PostHeader.css"
import fireicon from "../../assets/icons/fire.svg"
import { useNavigate } from "react-router-dom"

export const PostHeader = ({ user, createdAt, community, streak, clickable = true }) => {

    const navigate = useNavigate()
    return (
        <div className="post-header">
            <Avatar alt={user.name} size={60} />
            <div className="post-header-details">
                <div className="post-user-details">
                    <p className="post-user">{user.username}</p>
                    <p className="post-time"> • {createdAt}</p>
                </div>
                <div className="post-header-badges">
                    <Badge
                        onClick={clickable ? () => navigate(`/communities/${community.id}`) : undefined}
                        variant="community-badge"
                        label={community.name}
                    />
                    <Badge
                        variant="streak-badge"
                        label={streak} icon={fireicon}
                    />
                </div>
            </div>
        </div>

    )
}