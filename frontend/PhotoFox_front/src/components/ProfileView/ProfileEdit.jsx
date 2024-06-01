import {Link, Form, redirect, useNavigate} from "react-router-dom";
import './ProfileView.css'
import useProfileEditLoad from "../../hooks/useProfileEditLoad.js";
import {useState} from "react";
import {getToken} from "../../utils/auth.js";

export default function ProfileEdit({loading, setLoading, profileName}) {
    const { error, profileData} = useProfileEditLoad(setLoading, profileName);
    const { profileId, profileImage, description, login, isBlocked, email } = profileData;
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const [newProfileImage, setNewProfileImage] = useState(profileImage)
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
            setNewProfileImage(img.src);
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
        setNewProfileImage(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData(e.target);
        if (newProfileImage !== profileImage) {
            await fetch(`${import.meta.env.VITE_API_URL}/profile/picture`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: {
                    'image': newProfileImage
                }
            });
        }
        if (data.get('lo')) {
            await fetch(`${import.meta.env.VITE_API_URL}/profile/picture`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: {
                    'image': newProfileImage
                }
            });
        }
        if (data.get('email')) {
            await fetch(`${import.meta.env.VITE_API_URL}/profile/email`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: {
                    'email': data.get('email')
                }
            });
        }
        if (data.get('pass')) {
            await fetch(`${import.meta.env.VITE_API_URL}/profile/picture`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: {
                    'image': newProfileImage
                }
            });
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {!error &&
                (<>
                    <div>
                        <div id='left'>
                            {loading ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>) :
                                (<>
                                    <label htmlFor='image' id='image-wrapper'>
                                        <input type="file" accept="image/*" name='image' id='image' onChange={handleImageUpload} />
                                        <img src={(newProfileImage) ? newProfileImage : '/NavBarElements/profile_icon.svg'} alt='add image' id='image-preview'/>
                                    </label>
                                    <button type='button' onClick={handleDeleteProfilePicture} disabled={!newProfileImage}>Delete avatar</button>
                                </>)
                            }
                            <input defaultValue={login} required/>
                        </div>
                        <div id='right'>
                            <textarea name='description' defaultValue={description ?? ''} />
                            <div id='info-row'>
                                <div>
                                    <label htmlFor='email'>Email:</label>
                                    <input id='email' name='email' defaultValue={email} required/>
                                </div>
                                <div>
                                    <label htmlFor='pass'>New password</label>
                                    <input id='pass' name='new_password'/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type='submit'>Save</button>
                        <div></div>
                        <button type='button' onClick={() => {return navigate(`/${login}`, {replace: true});}}>Cancel</button>
                    </div>
                    <button type='button' onClick={handleDelete}>Delete account</button>
                </>)
                }
            </Form>
            {loading && !error && <div><div>Loading...</div></div>}
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </>
    )
}