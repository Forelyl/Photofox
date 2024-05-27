
export function action(onLogOut, navigate) {
    localStorage.removeItem('token');
    onLogOut();
    //TODO: переглянути поведінку коли буде більше сторінок
    navigate("/", { replace: true });
}