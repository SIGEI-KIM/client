import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState({});
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
		setValidationErrors({ ...validationErrors, [input.name]: "" }); 
	};

	const validate = () => {
		const errors = {};
		if (!data.firstname) {
			errors.firstname = "First name is required";
		}
		if (!data.lastname) {
			errors.lastname = "Last name is required";
		}
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
			const url = "http://localhost:8080/api/v1/auth/register";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sign In
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="First Name"
							name="firstname"
							onChange={handleChange}
							value={data.firstname}
							required
							className={styles.input}
						/>
						{validationErrors.firstname && (
							<div className={styles.error_msg}>{validationErrors.firstname}</div>
						)}
						<input
							type="text"
							placeholder="Last Name"
							name="lastname"
							onChange={handleChange}
							value={data.lastname}
							required
							className={styles.input}
						/>
						{validationErrors.lastname && (
							<div className={styles.error_msg}>{validationErrors.lastname}</div>
						)}
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						{validationErrors.email && (
							<div className={styles.error_msg}>{validationErrors.email}</div>
						)}
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{validationErrors.password && (
							<div className={styles.error_msg}>{validationErrors.password}</div>
						)}
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;