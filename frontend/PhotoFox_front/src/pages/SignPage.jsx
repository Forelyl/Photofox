import { useSearchParams } from "react-router-dom";
import { Form } from "react-router-dom";

export default function SignPage() {
    const [searchParams] = useSearchParams();
    const isSignIn = searchParams.get("mode");

    return (
        <>
            <Form method="post" >

            </Form>
        </>
    );
}

export async function action( { request } ) {
}