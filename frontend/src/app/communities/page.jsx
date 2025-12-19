import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { CommunityCard } from "../../components/community/CommunityCard"
import { useContext, useState } from "react"
import { CommunityContext } from "../../context/CommunityContext"
import { PageHeader } from "../../components/layout/PageHeader"
import { Grid, List } from "lucide-react"
import "./Communities.css"
import { CommunityCardSkeleton } from "../../components/community/CommunityCardSkeleton"


export const Communities = () => {
    const { communities, loading } = useContext(CommunityContext);
    const [view, setView] = useState("grid")
    return (
        <PageContainer>
            <Navbar />
            <PageHeader title={"Communities"} description={"Join challenge based communities and stay accountable"} />
            <div className="main">
                <div className="card-view">
                    <Grid size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => setView("grid")}
                        color={view === "grid" ? "#2563eb" : "#111113"}
                    />
                    <List size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => setView("list")}
                        color={view === "list" ? "#2563eb" : "#111113"}
                    />
                </div>
                <div className="community-grid">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <CommunityCardSkeleton key={i} />
                        ))
                        : communities.map(c => (
                            <CommunityCard
                                key={c.id}
                                id={c.id}
                                name={c.name}
                                description={c.description}
                                memberCount={c.memberCount}
                                joined={c.joined}
                                streak={c.streak}
                            />
                        ))}
                </div>
            </div>
        </PageContainer >
    )
}