import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import SignPage, { action as authAction } from "./pages/SignPage/SignPage.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import ProfileEditPage from "./pages/Profile/ProfileEditPage.jsx";
import UsersPictures from "./pages/UsersPictures/UsersPictures.jsx";
import ProfileSubs from "./pages/ProfileSubs/ProfileSubs.jsx";
import PicturePage from "./pages/Picture/PicturePage.jsx";
import AddPicturePage from "./pages/AddPicture/AddPicturePage.jsx";
import { loader as loadEdit } from "./pages/Profile/ProfileEditPage.jsx";
import {loaderCheckToken} from "./utils/auth.js";
import InfoPage from "./pages/InfoPage.jsx";
import PictureEditPage from "./pages/Picture/PictureEditPage.jsx";

const router = createBrowserRouter([
    { path: '/', element: <RootLayout/>,
        children: [
        { index: true, element: <HomePage /> },
        { path: 'sign', element: <SignPage />, action: authAction },
        { path: ':profileName', children: [
            { index: true, element: <ProfilePage /> },
            { path: 'edit', element: <ProfileEditPage />, loader: loadEdit },
            { path: 'pictures', element: <UsersPictures />, loader: loaderCheckToken },
            { path: 'subs', element: <ProfileSubs /> }
        ]},
        { path: 'add-picture', element: <AddPicturePage />, loader: loaderCheckToken },
        { path: 'picture/:pictureId', children: [
            { index: true, element: <PicturePage /> },
            { path: 'edit',  element: <PictureEditPage /> }
        ]},
        { path: 'info', element: <InfoPage /> }
    ], }
]);

function App() {

    return (
        <>
            <RouterProvider router={router} />
        </>
    );

}

export default App
