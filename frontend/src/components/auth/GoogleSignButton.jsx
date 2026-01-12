import { Button } from "../../components/ui/Button"
import "./GoogleSignButton.css"

export const GoogleSignButton = ({type}) =>{
    return(
        <div className="button-container">
            <Button className="sso-button">
            <img src="src\assets\icons\googleiconsvg.svg" alt="" />
            {type === "login"? "Sign in with Google" : "Sign up with Google"}
            </Button>
        </div>
    )
}