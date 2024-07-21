import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState({});

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
		setValidationErrors({ ...validationErrors, [input.name]: '' }); 
	};

	const validate = () => {
		const errors = {};
		if (!data.email) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(data.email)) {
			errors.email = "Email address is invalid";
		}
		if (!data.password) {
			errors.password = "Password is required";
		} else if (data.password.length < 6) {
			errors.password = "Password must be at least 6 characters";
		}
		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			return;
		}
		try {
			const url = "http://localhost:8080/api/v1/auth/authenticate";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					setError("Incorrect email or password");
				} else if (
					error.response.status >= 400 &&
					error.response.status <= 500
				) {
					setError(error.response.data.message);
				} else {
					setError("An unexpected error occurred");
				}
			} else {
				setError("An unexpected error occurred");
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						{validationErrors.email && <div className={styles.error_msg}>{validationErrors.email}</div>}
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{validationErrors.password && <div className={styles.error_msg}>{validationErrors.password}</div>}
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;