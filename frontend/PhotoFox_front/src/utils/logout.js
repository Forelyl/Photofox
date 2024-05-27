
export function action(onLogOut, navigate) {
    localStorage.removeItem('token');
    onLogOut();
    navigate("/", { replace: true });
}