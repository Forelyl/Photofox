
export function action(onLogOut, navigate) {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    onLogOut();
    //TODO: переглянути поведінку коли буде більше сторінок
    navigate("/", { replace: true });
}