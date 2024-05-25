import { useSearchParams } from "react-router-dom";

export default function ProfileSubs() {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode")
    return (
        <>
            <h1>Hi</h1>
        </>
    );
}