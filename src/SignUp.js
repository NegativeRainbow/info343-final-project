import React, { Component } from 'react'; //import React Component
import { Button, FormFeedback } from 'reactstrap';
import { FormGroup } from 'reactstrap';
import { Label } from 'reactstrap';
import { Input } from 'reactstrap';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import './SignUp.css'; //load module CSS
import noUserPic from './img/no-user-pic.png'; //placeholder image (as a data Uri)

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: undefined,
            password: undefined,
            handle: undefined,
            avatar: undefined,
        }; //initialize state
    }

    handleChange(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    //handle signUp button
    handleSignUp(event) {
        event.preventDefault(); //don't submit
        let avatar = this.state.avatar || noUserPic; //assign default if undefined
        this.props.signUpCallback(this.state.email, this.state.password, this.state.handle, avatar);
    }

    /**
     * A helper function to validate a value based on an object of validations
     * Second parameter has format e.g., 
     *    {required: true, minLength: 5, email: true}
     * (for required field, with min length of 5, and valid email)
     */
    validate(value, validations) {
        let errors = [];

        if (value !== undefined) { //check validations
            //handle required
            if (validations.required && value === '') {
                errors.push('Required field.');
            }

            //handle minLength
            if (validations.minLength && value.length < validations.minLength) {
                errors.push(`Must be at least ${validations.minLength} characters.`);
            }

            //handle email type
            if (validations.email) {
                //pattern comparison from w3c
                //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
                let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
                if (!valid) {
                    errors.push('Not an email address.')
                }
            }
            return errors; //report the errors
        }
        return undefined; //no errors defined (because no value defined!)
    }


    /* SignUpForm#render() */
    render() {

        let emailErrors = this.validate(this.state.email, { email: true, required: true });
        let passwordErrors = this.validate(this.state.password, { email: false, minLength: 6, required: true });
        let handleErrors = this.validate(this.state.handle, { required: true, email: false });

        let emailValid = undefined;
        let passwordValid = undefined;
        let handleValid = undefined;

        let signUpButton = true;

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
        if (handleErrors !== undefined && handleErrors.length === 0) {
            handleValid = true;
        }
        else if (handleErrors !== undefined && handleErrors.length !== 0) {
            handleValid = false;
        }

        if (emailValid && passwordValid && handleValid) {
            signUpButton = false;
        }

        let emailForm = false;
        if (emailValid === false && emailErrors !== undefined && emailErrors.length > 0) {
            emailForm = true;
        }

        let passwordForm = false;
        if (passwordValid === false && passwordErrors !== undefined && passwordErrors.length > 0) {
            passwordForm = true;
        }

        let handleForm = false;
        if (handleValid === false && handleErrors !== undefined && handleErrors.length > 0) {
            handleForm = true;
        }

        return (
            <form>
                {/* email */}
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

                {/* password */}
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

                {/* handle */}
                < FormGroup >
                    <Label htmlFor="handle">Handle</Label>
                    <Input valid={handleValid} onChange={(event) => this.handleChange(event)} id="handle"
                        name="handle"
                    />
                    {handleForm === true && handleErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                {/* buttons */}
                <FormGroup>
                    <Button disabled={signUpButton} className="mr-2" color="primary" onClick={(e) => this.handleSignUp(e)} >
                        Sign-up
          </Button>
                    <Link to='/login'><Button color='warning'>Already Have An Account? Sign-In</Button></Link>

                </FormGroup>
            </form >
        )
    }
}

//A simple component that displays the form, with alert callbacks
class SignUpApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSignUp(email, password, handle, avatar) {
        this.setState({ alert: `Signing up: '${email}' with handle '${handle}'` });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Sign Up!</h1>
                </header>
                {this.state.alert !== undefined ?
                    <Alert color="success">{this.state.alert}</Alert> :
                    <SignUpForm
                        signUpCallback={(e, p, h, a) => this.handleSignUp(e, p, h, a)} />}
            </div>
        );
    }
}

export default SignUpForm; //the default
export { SignUpApp }; //for problemA
