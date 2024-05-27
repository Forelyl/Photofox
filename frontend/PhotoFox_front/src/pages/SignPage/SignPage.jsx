import {useSearchParams, json, Link, Form, redirect, useActionData, useNavigation} from "react-router-dom";
import {useEffect} from "react";
import {setBackground} from "../../utils/bannerChange.js";
import './SignPage.css'

export default function SignPage() {
    const [searchParams] = useSearchParams();
    const signMode = (searchParams.get("mode") !== 'up');
    const errorData = useActionData();
    const navigation = useNavigation();

    const submitting = navigation.state === 'submitting'

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
                <div id='error-block'>
                    {/*{errorData && errorData.detail.message && <span id='error-text'>{errorData.detail.message}</span>}*/}
                    {/*{errorData && errorData.detail.errors && <ul>*/}
                    {/*    {Object.values(errorData.detail.errors).map((error, i) => <li key={i}>{error}</li>)}*/}
                    {/*</ul>}*/}
                    <span id='error-text'> some message </span>
                    <ul>
                        <li>first err</li>
                        <li>second errr</li>
                    </ul>
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
                    <input name='password' type='password' required/>
                </div>
                {signMode && (
                    <span id='recover-pass'>Recover password</span>
                )}
                <div id='action'> 
                    <div>
                        <Link to={`/sign?mode=${(signMode) ? 'up' : 'in'}`}>{(signMode) ? 'Go to register' : 'Go to log in'}</Link>
                    </div>
                    <button disabled={submitting}>
                        {(submitting) ? 'In proses...' : ((signMode) ? 'Log in' : 'Register')}
                    </button>
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
        response = await fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            body: data
        });
    }
    else if (signMode === 'up') {
        const authData = {
            login: data.get('username'),
            email: data.get('email'),
            password: data.get('password')
        }
        response = await fetch('http://127.0.0.1:3000/profile/add/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });
    }
    else {
        throw json({message: 'Invalid sign mode'}, {status: 422});
    }

    if (response.status === 400) {
        return response;
    }

    if (!response.ok) {
        throw json({message: 'Could not authenticate user.'}, {status: 500});
    }

    const resData = await response.json();
    const token = resData.access_token;

    localStorage.setItem('token', token);

    return redirect('/');
}