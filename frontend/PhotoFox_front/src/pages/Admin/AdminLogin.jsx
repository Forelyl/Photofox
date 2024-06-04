import {json, Link, Form, redirect, useActionData, useNavigation} from "react-router-dom";
import {useEffect} from "react";
import {setBackground} from "../../utils/bannerChange.js";
import '../SignPage/SignPage.css'

export default function AdminLogin() {
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
                    <h1>Log in as admin</h1>
                </div>
                <div id='error-block'>
                    {errorData && errorData.detail.message && <span id='error-text'>{errorData.detail.message}</span>}
                </div>
                <div className='input'>
                    <span>Login</span>
                    <input name='username' type='text' required/>
                </div>

                <div className='input'>
                    <span>Password</span>
                    <input name='password' type='password' required/>
                </div>

                <div id='action'>
                    <button style={{'grid-column': '1 / 3'}}>
                        {(submitting) ? 'In proses...' : 'Log in'}
                    </button>
                </div>
            </Form>
        </div>
    );
}

export async function action({request}) {

    const data = await request.formData();
    let response;

    response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        body: data
    });

    if (response.status === 400) {
        return response;
    }

    if (!response.ok) {
        throw json({message: 'Could not authenticate user.'}, {status: 500});
    }

    const resData = await response.json();
    const token = resData.access_token;
    const is_admin = resData.is_admin;
    localStorage.setItem('token', "Bearer " + token);
    localStorage.setItem('login', data.get('username'));
    if (!is_admin){
        return redirect('/')
    }

    return redirect('/admin/checks');
}