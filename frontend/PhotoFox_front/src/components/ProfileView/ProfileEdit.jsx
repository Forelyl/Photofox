import {Form, useNavigate, useParams} from "react-router-dom";
import './ProfileView.css'
import useProfileEditLoad from "../../hooks/useProfileEditLoad.js";
import {useEffect, useRef, useState} from "react";
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
    const [ deleteProfileImage, setDeleteProfileImage ] = useState(false);
    

    const [ editLogin, setEditLogin ] = useState(false);
    const [ editEmail, setEditEmail ] = useState(false);
    const [ editPass, setEditPass ] = useState(false);

    const navigate = useNavigate();
    const ref = useRef();

    if (isBlocked) throw new Error('User is blocked');

    useEffect(() => {
        console.log(typeof profileImage)
        console.log(!!profileImage)
        if (!!profileImage){
            setNewProfileImage([profileImage, true]);
        }
    }, [profileImage]);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        //TODO: передивитися поведінку при скасуванні аплоада картинки
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            setNewProfileImage([img.src, true]);
            setDeleteProfileImage(false)
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

    async function handleDeleteProfilePicture(e) {
        setNewProfileImage(['/NavBarElements/profile_icon.svg', false]);
        setDeleteProfileImage(true)
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
        if (newProfileImage[1] && newProfileImage[0] !== profileImage) {
            let image = new FormData()
            image.append('image', data.get('image'));
            await fetch(`${import.meta.env.VITE_API_URL}/profile/picture`, {
                method: 'PATCH',
                headers: {
                    'Authorization': getToken()
                },
                body: image
            });
        } else if (deleteProfileImage) {
            await fetch(`${import.meta.env.VITE_API_URL}/profile/picture/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                }
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
            const value = await response.json();
            const newToken = value.access_token;
            localStorage.setItem('login', data.get('newLogin'));
            localStorage.setItem('token', "Bearer " + newToken);

        }
        setSubmitting(false);
        return navigate(`/${localStorage.getItem('login')}`, {replace: true});
    }

    return (
        <div id='profile-edit'>
            <Form onSubmit={handleSubmit} disabled={submitting} id='profile-edit-form'>
                {!error &&
                    (<>
                        <div id='info'>
                            <div id='left'>
                                {loading ? 
                                    <div id='loading'>
                                      <img src="/loading.io_Ellipsis.svg" alt="" />
                                    </div> 
                                    :
                                    <>
                                        <label htmlFor='image' id='image-wrapper'>
                                            <input type="file" accept="image/*" name='image' id='image'
                                                   onChange={handleImageUpload} ref={ref}/>
                                            <img
                                                src={ newProfileImage[0] }
                                                alt='add image' id='image-preview'/>
                                        </label>
                                        <button type='button' onClick={handleDeleteProfilePicture}
                                                disabled={ !newProfileImage[1] }>Delete avatar
                                        </button>
                                    </>
                                }
                            </div>
                            <div id='right'>
                                <div id='description-wrapper'>
                                        <textarea maxLength={500} defaultValue={description ?? ''} name='description'/>
                                </div>
                                <div id='info-row'>
                                    <div>
                                        <span hidden={!loginUsed} id='text-area-error'>Login is already used</span>
                                        <label htmlFor='login'>Login:</label>
                                        <input id='login' maxLength={100} defaultValue={login} name='newLogin'
                                               readonly={!editLogin} required/>
                                        <button onClick={() => setEditLogin(value => !value)} type='button'>
                                            <img src={(!editLogin) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                                 alt={(!editLogin) ? 'edit title' : 'submit new title'}/>
                                        </button>
                                    </div>
                                    <div>
                                        {emailUsed && <span>Email is already used</span>}
                                        <label htmlFor='email'>Email:</label>
                                        <input id='email' name='email' defaultValue={email} readonly={!editEmail}
                                               required/>
                                        <button onClick={() => setEditEmail(value => !value)} type='button'>
                                            <img src={(!editEmail) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                                 alt={(!editEmail) ? 'edit title' : 'submit new title'}/>
                                        </button>
                                    </div>
                                    <div>
                                        <label htmlFor='pass'>New password:</label>
                                        <input id='pass' type='password' name='newPassword' readonly={!editPass}
                                               placeholder='*^*^*^*^*^*'/>
                                        <button onClick={() => setEditPass(value => !value)} type='button'>
                                            <img src={(!editPass) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                                 alt={(!editPass) ? 'edit title' : 'submit new title'}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='control-buttons'>
                            <button type='submit'>{!submitting ? 'Save' : 'Saving'}</button>
                            <hr/>
                            <button type='button' onClick={() => {
                                return navigate(`/${login}`, {replace: true});
                            }}>Cancel
                            </button>
                        </div>
                    </>)
                }
            </Form>
            <button type='button' id='delete-button' onClick={handleDelete}>Delete account</button>
            {loading && !error &&
                <div>
                    <div>Loading...</div>
                </div>
            }
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </div>
    )
}