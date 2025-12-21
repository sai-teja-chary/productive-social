import "./PageHeader.css"

export const PageHeader = ({ title, description, children, className }) => {
    return (
            <div className={`global-header ${className}`}>
                <div className="title">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                {children}
            </div>
    )

}