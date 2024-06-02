import {Form, useNavigate, useParams} from "react-router-dom";
import './ProfileView.css'
import useProfileEditLoad from "../../hooks/useProfileEditLoad.js";
import {useState} from "react";
import {getToken} from "../../utils/auth.js";
import './ProfileEdit.css'

export default function ProfileEdit() {
    const {profileName} = useParams();
    const [loading, setLoading] = useState(true);

    const { error, profileData} = useProfileEditLoad(setLoading, profileName);
    const { profileId, profileImage, description, login, isBlocked, email } = profileData;

    const [ submitting, setSubmitting ] = useState(false);
    const [ loginUsed, setLoginUsed ] = useState(false);
    const [ emailUsed, setEmailUsed ] = useState(false);
    const [ newProfileImage, setNewProfileImage ] = useState(['/NavBarElements/profile_icon.svg', false]);

    const [ editLogin, setEditLogin ] = useState(false);
    const [ editEmail, setEditEmail ] = useState(false);
    const [ editPass, setEditPass ] = useState(false);

    const navigate = useNavigate();
    if (isBlocked) throw new Error('User is blocked');
    function handleImageUpload(e) {
        const file = e.target.files[0];

        if (!file) {
            setNewProfileImage(oldValue => oldValue);
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            setNewProfileImage([img.src, true]);
        };

        reader.readAsDataURL(file);
    }

    async function handleDelete() {
        await fetch(`${import.meta.env.VITE_API_URL}/profile/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        return navigate('/', {replace: true});
    }

    async function handleDeleteProfilePicture() {
        await fetch(`${import.meta.env.VITE_API_URL}/profile/picture/delete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            }
        });
        setNewProfileImage([null, false]);

    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData(e.target);
        if (data.get('description')) {
            console.log(3);
            await fetch(`${import.meta.env.VITE_API_URL}/profile/description`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken(),
                    'new-description': data.get('description')
                }
            });
        }
        if (data.get('email')) {
            console.log(4);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/email`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken(),
                    'new-email': data.get('email')
                }
            });
            if (response.status === 400) {
                setEmailUsed(true);
            }
            if (!response.ok) {
                return null;
            }
        }
        if (data.get('newPassword')) {
            console.log(5);
            await fetch(`${import.meta.env.VITE_API_URL}/profile/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken(),
                    'new-password': data.get('newPassword')
                }
            });
            const newCredentials = new FormData();
            newCredentials.append('password', data.get('newPassword'));
            newCredentials.append('username', localStorage.getItem('login'));
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                body: newCredentials
            });
            const resData = await response.json();
            const token = resData.access_token;
            localStorage.setItem('token', "Bearer " + token);
        }
        if (newProfileImage !== profileImage && newProfileImage !== '') {
            let image = new FormData()
            image.append('image', data.get('image'));
            await fetch(`${import.meta.env.VITE_API_URL}/profile/picture`, {
                method: 'PATCH',
                headers: {
                    'Authorization': getToken()
                },
                body: image
            });
        }

        if (data.get('newLogin')) {
            console.log(2)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/login`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken(),
                    'new-login': data.get('newLogin')
                }
            });
            if (response.status === 400) {
                setLoginUsed(true);
            }
            if (!response.ok) {
                return null;
            }
            localStorage.setItem('login', data.get('newLogin'));
        }
        setSubmitting(false);
        return navigate(`/${localStorage.getItem('login')}`, {replace: true});
    }
    return (
        <>
            <Form onSubmit={handleSubmit} disabled={submitting} id='profile-edit'>
                {!error &&
                    (<>
                        <div id='info'>
                            <div id='left'>
                                {loading ? (<div className="lds-ellipsis">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>) :
                                    (<>
                                        <label htmlFor='image' id='image-wrapper'>
                                            <input type="file" accept="image/*" name='image' id='image'
                                                   onChange={handleImageUpload}/>
                                            <img
                                                src={(newProfileImage[1] || !profileImage) ? newProfileImage[0] : profileImage}
                                                alt='add image' id='image-preview'/>
                                        </label>
                                        <button type='button' onClick={handleDeleteProfilePicture}
                                                disabled={profileImage === ''}>Delete avatar
                                        </button>
                                    </>)
                                }
                                <div>
                                    {loginUsed && <span>Login is already</span>}
                                    <input defaultValue={login} name='newLogin' disabled={!editLogin} required/>
                                    <button onClick={() => setEditLogin(value => !value)} type='button'>
                                        <img src={(!editLogin) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                             alt={(!editLogin) ? 'edit title' : 'submit new title'}/>
                                    </button>
                                </div>
                            </div>
                            <div id='right'>
                                <div id='description-wrapper'>
                                    <textarea name='description' defaultValue={description ?? ''}/>
                                </div>
                                <div id='info-row'>
                                    <div>
                                        {emailUsed && <span>Email is already</span>}
                                        <label htmlFor='email'>Email:</label>
                                        <input id='email' name='email' defaultValue={email} disabled={!editEmail}
                                               required/>
                                        <button onClick={() => setEditEmail(value => !value)} type='button'>
                                            <img src={(!editEmail) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                                 alt={(!editEmail) ? 'edit title' : 'submit new title'}/>
                                        </button>
                                    </div>
                                    <div>
                                        <label htmlFor='pass'>New password</label>
                                        <input id='pass' type='password' name='newPassword' disabled={!editPass}/>
                                        <button onClick={() => setEditPass(value => !value)} type='button'>
                                            <img src={(!editPass) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                                 alt={(!editPass) ? 'edit title' : 'submit new title'}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type='submit'>{!submitting ? 'Save' : 'Saving'}</button>
                            <div></div>
                            <button type='button' onClick={() => {
                                return navigate(`/${login}`, {replace: true});
                            }}>Cancel
                            </button>
                        </div>
                    </>)
                }
            </Form>
            <button type='button' onClick={handleDelete}>Delete account</button>
            {loading && !error &&
                <div>
                    <div>Loading...</div>
                </div>
            }
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </>
    )
}