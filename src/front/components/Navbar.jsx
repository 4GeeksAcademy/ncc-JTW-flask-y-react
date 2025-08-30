import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();

	const logout = () => {
		sessionStorage.removeItem('token');
		navigate('/login');
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">JWT Authenticator</span>
				</Link>
				<div className="ml-auto">
					<Link to="/signup" className="me-2">Signup</Link>
					<Link to="/login" className="me-2">Login</Link>
					<Link to="/private" className="me-2">Private</Link>
					<button className="btn btn-outline-danger" onClick={logout}>Logout</button>
				</div>
			</div>
		</nav>
	);
};