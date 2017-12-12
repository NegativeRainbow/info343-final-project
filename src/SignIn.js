import React, { Component } from 'react';
import { Button, FormFeedback } from 'reactstrap';
import { FormGroup } from 'reactstrap';
import { Label } from 'reactstrap';
import { Input } from 'reactstrap';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import './SignUp.css';

class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: undefined,
            password: undefined,
            handle: undefined,
            avatar: undefined,
        };
    }

    handleChange(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    handleSignIn(event) {
        event.preventDefault();
        this.props.signInCallback(this.state.email, this.state.password);

    }


    validate(value, validations) {
        let errors = [];

        if (value !== undefined) {
            if (validations.required && value === '') {
                errors.push('Required field.');
            }

            if (validations.minLength && value.length < validations.minLength) {
                errors.push(`Must be at least ${validations.minLength} characters.`);
            }

            if (validations.email) {
                let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
                if (!valid) {
                    errors.push('Not an email address.')
                }
            }
            return errors;
        }
        return undefined;
    }

    render() {
        let emailErrors = this.validate(this.state.email, { email: true, required: true });
        let passwordErrors = this.validate(this.state.password, { email: false, minLength: 6, required: true });
        let emailValid = undefined;
        let passwordValid = undefined;
        let signInButton = true;

        if (emailErrors !== undefined && emailErrors.length === 0) {
            emailValid = true;
        }
        else if (emailErrors !== undefined && emailErrors.length !== 0) {
            emailValid = false;
        }
        if (passwordErrors !== undefined && passwordErrors.length === 0) {
            passwordValid = true;
        }
        else if (passwordErrors !== undefined && passwordErrors.length !== 0) {
            passwordValid = false;
        }

        if (emailValid && passwordValid) {
            signInButton = false;
        }

        let emailForm = false;
        if (emailValid === false && emailErrors !== undefined && emailErrors.length > 0) {
            emailForm = true;
        }

        let passwordForm = false;
        if (passwordValid === false && passwordErrors !== undefined && passwordErrors.length > 0) {
            passwordForm = true;
        }
        return (
            <form>
                < FormGroup >
                    <Label for="email">Email</Label>
                    <Input valid={emailValid} onChange={(event) => this.handleChange(event)} id="email"
                        type="email"
                        name="email"
                    />
                    {emailForm === true && emailErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input valid={passwordValid} onChange={(event) => this.handleChange(event)} id="password"
                        type="password"
                        name="password"
                    />
                    {passwordForm === true && passwordErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>
                <FormGroup>
                    <Button disabled={signInButton} color="primary" onClick={(e) => this.handleSignIn(e)}>Sign-in</Button>
                    <Link to='/join'><Button color='warning'>Don't Have An Account? Sign-Up</Button></Link>
                </FormGroup>
            </form >)
    }
}

class SignInApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSignIn(email, password) {
        this.setState({ alert: `Signing in: '${email}'` });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Sign In!</h1>
                </header>
                {this.state.alert !== undefined ?
                    <Alert color="success">{this.state.alert}</Alert> :
                    <SignInForm signInCallback={(e, p) => this.handleSignIn(e, p)} />
                }
            </div>
        );
    }
}

export default SignInForm; //the default
export { SignInApp }; //for problemA
