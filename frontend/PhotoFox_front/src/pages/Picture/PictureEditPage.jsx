import NavBar from "../../components/Menu/NavBar.jsx";
import ImageEdit from "../../components/ImageView/ImageEdit.jsx";

export default function PictureEditPage() {
    return (
        <>
            <NavBar hideSearch={true} hideAdd={true}/>
            <ImageEdit />
        </>
    );
}