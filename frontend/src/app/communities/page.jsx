import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { useContext, useState } from "react"
import { CommunityContext } from "../../context/CommunityContext"
import { PageHeader } from "../../components/layout/PageHeader"
import { CommunityViewToggle } from "../../components/community/CommunityViewToggle"
import { CommunityList } from "../../components/community/CommunityList"


export const Communities = () => {
    const { communities, loading } = useContext(CommunityContext);
    const [view, setView] = useState("grid")
    
    return (
        <PageContainer>
            <Navbar />
            <PageHeader title={"Communities"} description={"Join challenge based communities and stay accountable"} />
            <div className="main">
                <CommunityViewToggle 
                    view={view}
                    setView={setView}
                />

                <CommunityList 
                    communities={communities}
                    loading={loading}
                    view={view}
                />
            </div>
        </PageContainer >
    )
}