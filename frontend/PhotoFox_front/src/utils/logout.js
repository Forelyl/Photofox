
export function action(onLogOut, navigate) {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    onLogOut();
    navigate("/", { replace: true });
}