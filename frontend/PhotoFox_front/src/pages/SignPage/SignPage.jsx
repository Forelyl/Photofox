import { useSearchParams, json} from "react-router-dom";
import { Form } from "react-router-dom";
import "./SignPage.css";

export default function SignPage() {
    const [searchParams] = useSearchParams();
    const signMode = searchParams.get("mode") === 'in';

    return (
        <>
            <Form method="post">
                <div className='input'>
                    <span>Login</span>
                    <input name='login' type='email'/>
                </div>
                {signMode && (<div className='input'>
                    <span>Email</span>
                    <input name='email' type='email'/>
                </div>)}
                <div className='input'>
                    <span>Password</span>
                    <input name='pass' type={(signMode) ? 'password' : 'text'}/>
                </div>
            </Form>
        </>
    );
}

export async function action({request}) {
    const searchParams = new URL(request.url).searchParams;
    const signMode = searchParams.get("mode");

    const data = await request.formData();
    let authData = {};
    if (signMode === 'in') {
        authData = {
            email: data.get('email'),
            password: data.get('password')
        }
    }
    else if (signMode === 'up') {
        authData = {
            login: data.get('login'),
            email: data.get('email'),
            password: data.get('password')
        }
    }
    else {
        throw json({message: 'Invalid sign mode'});
    }
}