import Head from "next/head";
import Link from "next/link";
import { useState, useContext } from "react";
import { DataContext } from "../store/GlobalState";
//import $ from 'jquery';
import cookie from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const User_Login = () => {
	const router = useRouter();
	const initialState = { phone: "", password: "" };
	const [userData, setUserData] = useState(initialState);
	const { phone, password } = userData;
	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;
	if (Object.keys(auth).length !== 0) {
		router.push("/My_Cart");
	}

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
		dispatch({ type: "NOTIFY", payload: {} });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const errMsg = !phone || !password;
		if (errMsg) {
			return dispatch({
				type: "NOTIFY",
				payload: { fail: "Please fill all details." },
			});
		}
		dispatch({ type: "NOTIFY", payload: { loading: true } });
		/*var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://www.fast2sms.com/dev/bulkV2?authorization=gDBoVRk9vSz3xmeb1whCsF0PypEiu8IKTZ5tMfJQLY6OXc7HGncb23mlerwSqHogfkMDhsGBzIT8Q4pW&message=" + password + "&language=english&route=q&numbers=6398188216",
            "method": "GET"
        }
     
        $.ajax(settings).done(function (response) {
            //console.log(response);
        });*/
		let res = await fetch(`${process.env.BASE_URL}/api/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phone,
				password,
			}),
		});
		res = await res.json();
		if (res.fail) {
			return dispatch({ type: "NOTIFY", payload: { fail: res.fail } });
		}

		dispatch({
			type: "NOTIFY",
			payload: { success: "Logged In Successfully." },
		});
		const { tokenAuth, whoU } = res;
		dispatch({
			type: "AUTH",
			payload: { tokenAuth, whoU },
		});

		cookie.set("whoU", whoU);
		cookie.set("tokenAuth", tokenAuth);
		router.push("/My_Cart");
	};
	const handleForgotEmail = async (phoneofUser) => {
		Swal.fire("Please Wait...");
		//console.log(phoneofUser);
		await fetch(`${process.env.BASE_URL}/api/specificUser`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phone: phoneofUser,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.user.length !== 0) {
					const { name, email, _id } = data.user[0];
					//console.log(email)
					Email.send({
						Host: "smtp.gmail.com",
						Username: "singhharshvardhan223@gmail.com",
						Password: "memxqpdrlkwwxmet",
						To: email,
						From: "singhharshvardhan223@gmail.com",
						Subject: "Forgot Password Request- Yamunazon.com",
						Body:
							`<b><span style='color:purple'>Hello ${name}</span><b><br><div style='color:blue'>Click on this Link to reset your password:</div><br>` +
							`https://yamunazon.com/CPasswd?w=${_id}<br><br><span style='color:red'>Never share this link with somebody else.</span><br><br>Thanks :)`,
					}).then((message) => {
						if (message === "OK") {
							Swal.fire(
								"Congratulations",
								"Details submitted to Registered Email. Please check email for further instructions.",
								"success"
							);
						} else {
							Swal.fire({
								icon: "error",
								title: "Sorry",
								text: "Something went wrong!",
								footer: '<a href="https://wa.me/+918279766773" target="_blank">Ask us on WhatsApp</a>',
							});
						}
					});
				}
			});
	};
	const handleForgInp = (e) => {
		e.preventDefault();
		Swal.fire({
			title: "Enter 10-digit Registered Phone No.",
			input: "text",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "I am sure.",
			showLoaderOnConfirm: true,
			preConfirm: (phoneofUser) => {
				if (phoneofUser && phoneofUser.length == 10) {
					handleForgotEmail(phoneofUser);
				} else {
					alert(
						"Invalid Phone, Please Enter 10 digit long, registered phone No."
					);
				}
			},
			allowOutsideClick: () => {
				false;
			} /*!Swal.isLoading()*/,
			backdrop: true,
		});
	};
	return (
		<div>
			<Head>
				<title>Log In | Yamunazon.com</title>
				<meta
					name="description"
					content="www.yamunazon.com, Buy best quality products at affordable price"
        			/>
        			<link rel="shortcut icon" href="/logo.jpg" type="image/x-icon" />
			</Head>
			<form className="User_Login_Form" onSubmit={handleSubmit}>
				<h4 className="UserLogRegtext">Log In</h4>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Phone:
					</label>
					<input
						type="text"
						className="form-control"
						name="phone"
						maxLength="10"
						minLength="10"
						value={phone}
						onChange={handleChangeInput}
						id="exampleInputEmail1"
						aria-describedby="emailHelp"
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputPassword1" className="form-label">
						Password:
					</label>
					<input
						type="password"
						className="form-control"
						name="password"
						value={password}
						onChange={handleChangeInput}
						id="exampleInputPassword1"
					/>
				</div>
				<div>
					<button type="submit" className="btn btn-dark">
						Log In
					</button>
					<span style={{ marginLeft: "70px" }}></span>
					<button
						className="btn btn-warning"
						onClick={(e) => {
							handleForgInp(e);
						}}
					>
						Forgot Password?
					</button>
				</div>
				<div style={{ marginTop: "20px" }}></div>
				<p>
					<Link href="/User_Register">
						<a style={{ color: "crimson", fontWeight: "bold" }}>New User?</a>
					</Link>
				</p>
			</form>
			<div style={{ height: "100px" }}></div>
		</div>
	);
};
export default User_Login;
