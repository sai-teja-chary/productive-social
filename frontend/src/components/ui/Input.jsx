import "./Input.css"


export const Input = ({
    id,
    type = "text",
    placeholder = "",
    value,
    onChange,
    onClick,
    className,
    icon = "",
    ...rest
}) => {

    return (
        <div className="input-wrapper">

            <input id={id} className={`input ${className}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...rest}
            />
            {icon && <img className="input-icon" onClick={onClick} src={icon} alt="toggle-icon" />}
        </div>
    )
}