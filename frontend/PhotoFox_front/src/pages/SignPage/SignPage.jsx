import {useSearchParams, json, Link, Form, redirect} from "react-router-dom";
import {useEffect} from "react";
import {setBackground} from "../../utils/bannerChange.js";
import './SignPage.css'
import {getToken} from "../../utils/auth.js";

export default function SignPage() {
    const [searchParams] = useSearchParams();
    const signMode = searchParams.get("mode") === 'in';

    useEffect(() => {
        setBackground();
        function handleResize() {
            setBackground();
        }
        window.addEventListener('resize', handleResize);
    });

    //TODO реалізувати скидання паролю
    return (
        <div id='background'>
            <Form method="post">
                <div id='top'>
                    <Link to='/'>
                        <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                    </Link>
                    <h1>{(signMode) ? 'Log in' : 'Register'}</h1>
                </div>
                <div className='input'>
                    <span>Login</span>
                    <input name='username' type='text' required/>
                </div>
                {!signMode && (<div className='input'>
                    <span>Email</span>
                    <input name='email' type='text' required/>
                </div>)}
                <div className='input'>
                    <span>Password</span>
                    <input name='password' type={(signMode) ? 'password' : 'text'} required/>
                </div>
                {signMode && (
                    <span id='recover-pass'>Recover password</span>
                )}
                <div id='action'> 
                    <div>
                        <Link to={`/sign?mode=${(signMode) ? 'up' : 'in'}`}>{(signMode) ? 'Go to register' : 'Go to log in'}</Link>
                    </div>
                    <button>{(signMode) ? 'Log in' : 'Register'}</button>
                </div>
            </Form>
        </div>
    );
}

export async function action({request}) {
    const searchParams = new URL(request.url).searchParams;
    const signMode = searchParams.get("mode");

    const data = await request.formData();
    let response;

    if (signMode === 'in') {
        response = await fetch('http://127.0.0.1:3000/profile/add/user', {
            method: 'POST',
            header: {
                'Content-Type': 'multipart/form-data'
            },
            body: data
        });
    }
    else if (signMode === 'up') {
        const authData = {
            login: data.get('username'),
            email: data.get('email'),
            password: data.get('password')
        }
        response = await fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });
    }
    else {
        throw json({message: 'Invalid sign mode'}, {status: 422});
    }

    if (response.status === 400 || response.status) {
        return response;
    }

    if (!response.ok) {
        throw json({message: 'Could not authenticate user.'}, {status: 500});
    }

    const resData = await response.json();
    const token = resData.token;

    localStorage.setItem('token', token);

    redirect('/')
}