import { Link } from "react-router-dom";
import {testAuthor} from "../utils/auth.js";
import CustomSubscribeButton from "./CustomButtons/CustomSubscribeButton.jsx";

export default function MiniProfile({ profile, className= undefined, subState = false, key}) {
    const isAuthor = testAuthor(profile.login);

    return (
        <div className={className} key={key}>

            <CustomSubscribeButton intendedDestination={`/`} authorId={profile.id} isAuthor={isAuthor} initialState={subState}/>
        </div>
    )
}