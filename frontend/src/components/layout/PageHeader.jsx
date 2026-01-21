import { BackButton } from "../ui/BackButton"
import "./PageHeader.css"

export const PageHeader = ({ title, description, children, className }) => {
    return (
        <div className={`page-header ${className}`}>
            <BackButton/>
            <div className="global-header">
                <div className="title">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>       
            </div>
            {children}
        </div>
    )

}