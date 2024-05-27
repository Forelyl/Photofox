import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import SignPage, { action as authAction } from "./pages/SignPage/SignPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import ProfilePictures from "./pages/ProfilePictures.jsx";
import ProfileSubs from "./pages/ProfileSubs.jsx";
import PicturePage from "./pages/PicturePage.jsx";
import AddPicture from "./pages/AddPicture.jsx";
import { loaderCheckToken, tokenLoader } from "./utils/auth.js";
import InfoPage from "./pages/InfoPage.jsx";

const router = createBrowserRouter([
    { path: '/', id: 'root', element: <RootLayout/>, loader: tokenLoader,
        children: [
        { index: true, element: <HomePage /> },
        { path: 'sign', element: <SignPage />, action: authAction },
        { path: ':profileName', children: [ //TODO add loader that checks if logined and showes editing tools
            { index: true, element: <ProfilePage /> },
            { path: 'edit', element: <ProfileEdit />, loader: loaderCheckToken },
            { path: 'pictures/published', element: <ProfilePictures />, },
            { path: 'pictures/saved', element: <ProfilePictures />, },
            { path: 'subs', element: <ProfileSubs /> },
            { path: 'picture/:pictureId',  element: <PicturePage /> }
        ]},
        { path: 'add-picture', element: <AddPicture />, loader: loaderCheckToken },
        { path: 'picture/:pictureId', element: <PicturePage /> },
        { path: 'info', element: <InfoPage />}
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
