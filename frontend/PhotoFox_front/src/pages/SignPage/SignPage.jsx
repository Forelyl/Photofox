import {useSearchParams, json, Link, Form, redirect, useActionData, useNavigation} from "react-router-dom";
import {useEffect} from "react";
import {setBackground} from "../../utils/bannerChange.js";
import './SignPage.css'
import {getIntendedDestination} from "../../utils/independentDestination.js";

export default function SignPage() {
    const [searchParams] = useSearchParams();
    const signMode = (searchParams.get("mode") !== 'up');
    const errorData = useActionData();
    const navigation = useNavigation();

    const submitting = navigation.state === 'submitting';

    useEffect(() => {
        setBackground();
        function handleResize() {
            setBackground();
        }
        window.addEventListener('resize', handleResize);
    });

    //TODO реалізувати скидання паролю
    // TODO: на реєстрацію за неправильних даних (s, 1, 1) - логін, пошта й пароль відповідно кидається помилка 500
    return (
        <div id='background'>
            <Form method="post" disabled={submitting}>
                <div id='top'>
                    <Link to='/'>
                        <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                    </Link>
                    <h1>{(signMode) ? 'Log in' : 'Register'}</h1>
                </div>
                <div id='error-block'>
                    {errorData && errorData.detail.message && <span id='error-text'>{errorData.detail.message}</span>}
                    {errorData && errorData.detail.errors && <ul>
                       {Object.values(errorData.detail.errors).map((error, i) => <li key={i}>{error}</li>)}
                    </ul>}
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
                    <button>
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
        response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
        response = await fetch(`${import.meta.env.VITE_API_URL}/profile/add/user`, {
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
    localStorage.setItem('token', "Bearer " + token);
    localStorage.setItem('login', data.get('username'));
    const destination = getIntendedDestination();

    return redirect(destination);
}