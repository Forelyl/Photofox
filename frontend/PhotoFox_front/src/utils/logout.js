
export function action(onLogOut = null, navigate) {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    if (onLogOut) {
        onLogOut();
    }
    navigate("/", { replace: true });
}