import { useSearchParams } from "react-router-dom";

export default function InfoPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'about';
    return (
        <>
            <h1>This is {type}</h1>
        </>
    );
}