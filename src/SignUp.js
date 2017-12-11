import React, { Component } from 'react'; //import React Component
import { Button, FormFeedback} from 'reactstrap';
import { FormGroup } from 'reactstrap';
import { Label } from 'reactstrap';
import { Input } from 'reactstrap';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import './SignUp.css'; //load module CSS


class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.genderOnChange = this.genderOnChange.bind(this);
        this.state = {
            email: undefined,
            password: undefined,
            petName: undefined,
            petImg: undefined,
            petGender: undefined,
            petAge: undefined,
            petBreed: undefined,
            ownerName: undefined,
            ownerImg: undefined,
            ownerAge: undefined,
            ownerOcc: undefined,
            
            userBio: undefined
        }; 
    }
  
    handleChange(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }
    genderOnChange(event) {
        this.setState({petGender: event.target.value});
    }

    handleSignUp(event) {
        event.preventDefault(); 
        this.props.signUpCallback(
            this.state.email, this.state.password,
            this.state.petName, this.state.petImg, this.state.petGender, this.state.petAge, this.state.petBreed,
            this.state.ownerName, this.state.ownerImg, this.state.ownerAge,
            this.state.ownerOcc, this.state.userBio);
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

            if (validations.integer) {
                var intValue = parseInt(value);
                if (!Number.isInteger(intValue)) {
                    errors.push('This is not a valid number, please input an integer.');
                } else if (intValue < 1) {
                    errors.push('Negative values cannot be accepted. Please input a postive value');
                }
            }
            if (validations.email) {
             
                let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
                if (!valid) {
                    errors.push('Not an email address.')
                }
            }

            if (validations.lettersOnly) {
                let valid = /^[a-zA-Z ]*$/.test(value);
                if (!valid) {
                    errors.push(`Nice try guy. This field can't contain whacky characters or numbers.`);
                }
            }
            return errors; 
        }
        return undefined; 
    }

    render() {

        let emailErrors = this.validate(this.state.email, { email: true, required: true });
        let passwordErrors = this.validate(this.state.password, { email: false, minLength: 6, required: true });
        let petNameErrors = this.validate(this.state.petName, { required: true, lettersOnly: true });
        let petImgErrors = this.validate(this.state.petImg, { required: true });
        let petGenderErrors = this.validate(this.state.petGender, { required: true });
        let petAgeErrors = this.validate(this.state.petAge, { required: true, integer: true });
        let petBreedErrors = this.validate(this.state.petBreed, { required: true, lettersOnly: true });
        let ownerNameErrors = this.validate(this.state.ownerName, { required: true, lettersOnly: true });
        let ownerImgErrors = this.validate(this.state.ownerImg, { required: true});
        let ownerAgeErrors = this.validate(this.state.ownerAge, { required: true, integer: true});
        let ownerOccErrors = this.validate(this.state.ownerOcc, { required: true, lettersOnly: true});
        

        let emailValid = undefined;
        let passwordValid = undefined;
        let petNameValid = undefined;
        let petImgValid = undefined;
        let petGenderValid = undefined;
        let petAgeValid = undefined;
        let petBreedValid = undefined;
        let ownerNameValid = undefined;
        let ownerImgValid = undefined;
        let ownerAgeValid = undefined;
        let ownerOccValid = undefined;
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
        if (petNameErrors !== undefined && petNameErrors.length === 0) {
            petNameValid = true;
        } else if (petNameErrors !== undefined && petNameErrors.length !== 0) {
            petNameValid = false;
        }
        if (petImgErrors !== undefined && petImgErrors.length === 0) {
            petImgValid = true;
        } else if (petImgErrors !== undefined && petImgErrors.length !== 0) {
            petImgValid = false;
        }
        if (petGenderErrors !== undefined && petGenderErrors.length === 0) {
            petGenderValid = true;
        } else if (petGenderErrors !== undefined && petGenderErrors.length !== 0) {
            petGenderValid = false;
        }
        if (petAgeErrors !== undefined && petAgeErrors.length === 0) {
            petAgeValid = true;
        } else if (petAgeErrors !== undefined && petAgeErrors.length !== 0) {
            petAgeValid = false;
        }
        if (petBreedErrors !== undefined && petBreedErrors.length === 0) {
            petBreedValid = true;
        } else if (petBreedErrors !== undefined && petBreedErrors.length !== 0) {
            petBreedValid = false;
        }
        if (ownerNameErrors !== undefined && ownerNameErrors.length === 0) {
            ownerNameValid = true;
        } else if (ownerNameErrors !== undefined && ownerNameErrors.length !== 0) {
            ownerNameValid = false;
        }
        if (ownerImgErrors !== undefined && ownerImgErrors.length === 0) {
            ownerImgValid = true;
        } else if (ownerImgErrors !== undefined && ownerImgErrors.length !== 0) {
            ownerImgValid = false;
        }
        if (ownerAgeErrors !== undefined && ownerAgeErrors.length === 0) {
            ownerAgeValid = true;
        } else if (ownerAgeErrors !== undefined && ownerAgeErrors.length !== 0) {
            ownerAgeValid = false;
        }
        if (ownerOccErrors !== undefined && ownerOccErrors.length === 0) {
            ownerOccValid = true;
        } else if (ownerOccErrors !== undefined && ownerOccErrors.length !== 0) {
            ownerOccValid = false;
        }

        let emailForm = false;
        if (emailValid === false && emailErrors !== undefined && emailErrors.length > 0) {
            emailForm = true;
        }

        let passwordForm = false;
        if (passwordValid === false && passwordErrors !== undefined && passwordErrors.length > 0) {
            passwordForm = true;
        }

        let petNameForm = false;
        if (petNameValid === false && petNameErrors !== undefined && petNameErrors.length > 0) {
            petNameForm = true;
        }

        let petImgForm = false;
        if (petImgValid === false && petImgErrors !== undefined && petImgErrors.length > 0) {
            petImgForm = true;
        }

        let petAgeForm = false;
        if (petAgeValid === false && petAgeErrors !== undefined && petAgeErrors.length > 0) {
            petAgeForm = true;
        }

        let petBreedForm = false;
        if (petBreedValid === false && petBreedErrors !== undefined && petBreedErrors.length > 0) {
            petBreedForm = true;
        }

        let ownerNameForm = false;
        if (ownerNameValid === false && ownerNameErrors !== undefined && ownerNameErrors.length > 0) {
            ownerNameForm = true;
        }
        let ownerImgForm = false;
        if (ownerImgValid === false && ownerImgErrors !== undefined && ownerImgErrors.length > 0) {
            emailForm = true;
        }

        let ownerAgeForm = false;
        if (ownerAgeValid === false && ownerAgeErrors !== undefined && ownerAgeErrors.length > 0) {
            ownerAgeForm = true;
        }

        let ownerOccForm = false;
        if (ownerOccValid === false && ownerOccErrors !== undefined && ownerOccErrors.length > 0) {
            ownerOccForm = true;
        }

        if (emailValid && passwordValid && petNameValid && petImgValid && petGenderValid && petAgeValid && petBreedValid && ownerNameValid && ownerAgeValid && ownerImgValid && ownerOccValid) {
            signUpButton = false;
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

                < FormGroup >
                    <Label for="petName">Pet Name</Label>
                    <Input valid={petNameValid} onChange={(event) => this.handleChange(event)} id="petName"
                        type="petName"
                        name="petName"
                    />
                    {petNameForm === true && petNameErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                < FormGroup >
                    <Label for="petImg">Pet Image URL</Label>
                    <Input valid={petImgValid} onChange={(event) => this.handleChange(event)} id="petImg"
                        type="petImg"
                        name="petImg"
                    />
                    {petImgForm === true && petImgErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>
                <FormGroup>
                    <Label for="petGender">Select your Dog's Gender</Label>
                    <Input type="select" name="select" id="genderSelect" onChange={this.genderOnChange} >
                        <option value="N/A">N/A</option>
                        <option value="Male">B O Y E Doggo</option>
                        <option value="Female">Good Girl Pupper</option>
                    </Input>
                </FormGroup>

                < FormGroup >
                    <Label for="petAge">Pet Age</Label>
                    <Input valid={petAgeValid} onChange={(event) => this.handleChange(event)} id="petAge"
                        type="petAge"
                        name="petAge"
                    />
                    {petAgeForm === true && petAgeErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                < FormGroup >
                    <Label for="petBreed">Pet Breed</Label>
                    <Input valid={petBreedValid} onChange={(event) => this.handleChange(event)} id="petBreed"
                        type="petBreed"
                        name="petBreed"
                    />
                    {petBreedForm === true && petBreedErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                < FormGroup >
                    <Label for="ownerName">Owner Name</Label>
                    <Input valid={ownerNameValid} onChange={(event) => this.handleChange(event)} id="ownerName"
                        type="ownerName"
                        name="ownerName"
                    />
                    {ownerNameForm === true && ownerNameErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                < FormGroup >
                    <Label for="ownerImg">Owner Image URL</Label>
                    <Input valid={petImgValid} onChange={(event) => this.handleChange(event)} id="ownerImg"
                        type="ownerImg"
                        name="ownerImg"
                    />
                    {ownerImgForm === true && ownerImgErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                < FormGroup >
                    <Label for="ownerAge">Owner Age</Label>
                    <Input valid={ownerAgeValid} onChange={(event) => this.handleChange(event)} id="ownerAge"
                        type="ownerAge"
                        name="ownerAge"
                    />
                    {ownerAgeForm === true && ownerAgeErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>


                < FormGroup >
                    <Label for="ownerOcc">Owner Occupation</Label>
                    <Input valid={ownerOccValid} onChange={(event) => this.handleChange(event)} id="ownerOcc"
                        type="ownerOcc"
                        name="ownerOcc"
                    />
                    {ownerOccForm === true && ownerOccErrors.map((error) => {
                        return <FormFeedback key={error}>{error}</FormFeedback>
                    })}
                </FormGroup>

                < FormGroup >
                    <Label for="userBio">Write a Bio!</Label>
                    <Input onChange={(event) => this.handleChange(event)} id="userBio"
                        type="userBio"
                        name="userBio"
                    />
                </FormGroup>

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

class SignUpApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSignUp(email, password, petName, petImg, petGender, petAge, petBreed, ownerName, ownerImg, ownerAge, ownerOcc, userBio) {
        this.setState({ alert: `Signing up: '${email}'. User's name is '${ownerName}' with pet '${petName}'.` });
    }

    render() {
        return (
            <div className="container">
                {this.state.alert !== undefined ?
                    <Alert color="success">{this.state.alert}</Alert> :
                    <SignUpForm
                        signUpCallback={(e, p, pN, pI, pG, pA, pB, oN, oI, oA, oO, uB) => this.handleSignUp(e, p, pN, pI, pG, pA, pB, oN, oI, oA, oO, uB)} 
                    />
                }
            </div>
        );
    }
}

export default SignUpForm; //the default
export { SignUpApp }; //for problemA
