import { useSearchParams } from "react-router-dom";

export default function ProfilePictures() {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode")
    return (
        <>
            <h1>Hi5</h1>
        </>
    );
}