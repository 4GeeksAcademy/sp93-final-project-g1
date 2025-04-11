import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const { actions } = useContext(Context);

	const navigate = useNavigate();

	const [user, setUser] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		const dataToSend = { user, email, password };
		const success = await actions.login(dataToSend);

		if (success) {
			navigate("/home");
		} else {
			setError("Incorrect username, password or email");
		}
	};


	return (
		<div className="container d-flex justify-content-center">
			<form onSubmit={handleSubmit}>
				<h2 className="text-center mb-3">Login</h2>
				<div className="text-center mt-4">
					<div className="input-group mb-3">
						<span>Email
							<input onChange={(e) => setEmail(e.target.value)} type="email" value={email} className="form-control" placeholder="Email" required />
						</span>
					</div>
					<div className="input-group mb-3">
						<span>Password
							<input onChange={(e) => setPassword(e.target.value)} type="password" value={password} className="form-control" placeholder="Password" required />
						</span>
					</div>
					<div>
						<button type="submit" className="btn btn-primary">Submit</button>
					</div>
				</div>
				{error && (<div className="container mt-2 alert alert-danger text-center custom-alert">{error}</div>)}
			</form>
		</div>
	);
};
