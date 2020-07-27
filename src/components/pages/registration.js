import React, { Component, createRef } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { showSnackbar } from '../../redux/actions/snackbar';

class Registration extends Component {
	idField = createRef();
	firstPassField = createRef();
	secondPassField = createRef();
	barField = createRef();
	inputField = createRef();
	

	submit = (e) => {
		const { showSnackbar } = this.props.actions;
		e.preventDefault();
		if (
			this.firstPassField.current.value !==
			this.secondPassField.current.value
		) {
			showSnackbar(true, "Passwords don't match");
		} else if (this.firstPassField.current.value.length < 6) {
			showSnackbar(true, 'Password: Minimum 6 symbols');
		} else if (!this.idField.current.value.trim()) {
			showSnackbar(true, 'Please, enter your username');
		} else {
			let userObject = {
				username: this.idField.current.value,
				password: this.firstPassField.current.value,
			};
			axios
				.post('http://localhost:8000/addUser', userObject)
				.then((res) => {
					if (res.data.name === 'MongoError') {
						showSnackbar(true, 'Username Taken');
					} else {
						console.log('Successfully registered', res);
						this.idField.current.value = '';
						this.firstPassField.current.value = '';
						this.secondPassField.current.value = '';
						showSnackbar(true, 'Successfully registered');
					}
				})
				.catch((err) => console.log(err));
		}
	};

	handleKeyPress = (e) => {
		const { showSnackbar } = this.props.actions;
		if (e.key === 'Enter') {
			e.preventDefault();
			this.submit(e);
			setTimeout(() => {
				showSnackbar(false, null);
			}, 2000);
		}
	};

	render() {
		const { snackbarState, snackbarMessage } = this.props;
		const { showSnackbar } = this.props.actions;

		return (
			<div className="login">
				<h1>Register</h1>
				<div className="registrationBody">
					<label className="ID">ID </label>
					<TextField
						inputRef={this.idField}
						className="regInputField"
						size="small"
						label="Enter your ID"
						variant="outlined"
						onKeyPress={this.handleKeyPress}
					/>
					<br />
					<label className="password">Password </label>
					<form className="passwords">
						<TextField
							inputRef={this.firstPassField}
							className="regInputField"
							size="small"
							label="Password"
							type="password"
							autoComplete="current-password"
							variant="outlined"
							onKeyPress={this.handleKeyPress}
						/>
						<br />
						<label className="password">Repeat Password </label>
						<TextField
							inputRef={this.secondPassField}
							className="regInputField"
							size="small"
							label="Repeat Password"
							type="password"
							autoComplete="current-password"
							variant="outlined"
							onKeyPress={this.handleKeyPress}
						/>
						<br />
					</form>
				</div>
				<Button
					variant="contained"
					size="large"
					color="primary"
					onClick={(e) => {
						this.submit(e);
						setTimeout(() => {
							showSnackbar(false, null);
						}, 2000);
					}}
				>
					Submit
				</Button>
				<br />

				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					open={snackbarState}
					message={snackbarMessage}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		snackbarState: state.snackbarState,
		snackbarMessage: state.snackbarMessage,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{
				showSnackbar,
			},
			dispatch
		),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
