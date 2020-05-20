import logo200Image from '../assets/img/logo/house.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { toast } from "react-toastify";
import { Redirect } from 'react-router';
import AuthContext from '../components/Context/authContext'



class AuthForm extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      usernameInput: '',
      emailInput: '',
      passwordInput: '',
      confirmPasswordInput: '',
      remeberMe: false,
      agreeTerms: false,
      toDashboard: false
    };
  }
  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  componentDidMount() {
    if (localStorage.token) {
      this.setState(() => (
        {
          toDashboard: true
        }
      ))
    }
  }
  componentDidUpdate() {
    if (localStorage.token) {
      this.context.setAuth(true)
      this.setState(() => (
        {
          toDashboard: true
        }
      ))
    }
  }

  changeAuthState = authState => event => {
    event.preventDefault();
    this.props.onChangeAuthState(authState);
  };

  handleChange = event => {
    let tarName = event.target.name;
    let tarValue = event.target.value;
    this.setState({ [tarName]: tarValue });
  }

  handleSubmit = async event => {
    event.preventDefault();
    try {
      if (this.props.authState === STATE_LOGIN) {

        if (this.state.emailInput && this.state.passwordInput) {
          const response = await fetch(
            "http://localhost:4000/api/login",
            {
              method: "POST",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify(this.state)
            }
          );

          const parseRes = await response.json();

          if (parseRes.jwtToken) {
            localStorage.setItem("token", parseRes.jwtToken);
            toast.success("Logged in Successfully");
            setTimeout(() => {
              this.setState(() => (
                {
                  toDashboard: true
                }
              ))
            }, 1000);

          } else {
            toast.error(parseRes);
          }

        } else {
          alert("Please Fill all the information");
        }
      } else if (this.props.authState === STATE_SIGNUP) {
        if (this.state.usernameInput && this.state.emailInput && this.state.passwordInput === this.state.confirmPasswordInput) {
          try {
            const response = await fetch(
              "http://localhost:4000/api/register",
              {
                method: "POST",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify(this.state)
              }
            );
            const parseRes = await response.json();

            if (parseRes.jwtToken) {
              localStorage.setItem("token", parseRes.jwtToken);
              toast.success("Registered Successfully");
              setTimeout(() => {
                this.setState(() => (
                  {
                    toDashboard: true
                  }
                ))
              }, 1000);
            } else {
              toast.error(parseRes);
            }

          } catch (err) {
            console.error(err.message);
          }
        } else {
          alert("Password does not match");
        }

      }
    } catch (err) {
      console.error(err)
    }
  };

  renderButtonText() {
    const { buttonText } = this.props;
    if (!buttonText && this.isLogin) {
      return 'Login';
    }
    if (!buttonText && this.isSignup) {
      return 'Signup';
    }
    return buttonText;
  }

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      emailLabel,
      emailInputProps,
      emailNameLabel,
      emailNameInputProps,
      passwordLabel,
      passwordInputProps,
      confirmPasswordLabel,
      confirmPasswordInputProps,
      children,
      onLogoClick,
    } = this.props;

    if (this.state.toDashboard === true) {
      return <Redirect to='/' />
    }

    return (
        <Form onSubmit={this.handleSubmit}>
          {showLogo && (
            <div className="text-center pb-4">
              <img
                src={logo200Image}
                className="rounded"
                style={{ width: 60, height: 60, cursor: 'pointer' }}
                alt="logo"
                onClick={onLogoClick}
              />
            </div>
          )}
          {this.isSignup && (
            <>
              <FormGroup>
                <Label for={usernameLabel}>{usernameLabel}</Label>
                <Input {...usernameInputProps} name="usernameInput"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for={emailLabel}>{emailLabel}</Label>
                <Input {...emailInputProps} name="emailInput"
                  onChange={this.handleChange}
                />
              </FormGroup>
            </>
          )}
          {this.isLogin && (
            <FormGroup>
              <Label for={emailNameLabel}>{emailNameLabel}</Label>
              <Input {...emailNameInputProps} name="emailInput"
                onChange={this.handleChange}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for={passwordLabel}>{passwordLabel}</Label>
            <Input {...passwordInputProps} name="passwordInput"
              onChange={this.handleChange}
            />
          </FormGroup>
          {this.isSignup && (
            <FormGroup>
              <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>
              <Input {...confirmPasswordInputProps} name="confirmPasswordInput"
                onChange={this.handleChange}
              />
            </FormGroup>
          )}
          <FormGroup check>
            <Label check>
              {this.isSignup ? (
                <Input type="checkbox" />
              ) : (
                  <Input type="checkbox" />
                )}
              {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}
            </Label>
          </FormGroup>
          <hr />
          {this.state.errormessage && (
            <span>{this.state.errormessage}</span>
          )}
          <Button
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            onClick={this.handleSubmit}>
            {this.renderButtonText()}
          </Button>

          <div className="text-center pt-1">
            <h6>or</h6>
            <h6>
              {this.isSignup ? (
                <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                  Login
                </a>
              ) : (
                  <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                    Signup
                  </a>
                )}
            </h6>
          </div>

          {children}
        </Form>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  emailLabel: PropTypes.string,
  emailInputProps: PropTypes.object,
  emailNameLabel: PropTypes.string,
  emailNameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Username',
  usernameInputProps: {
    type: 'text',
    placeholder: 'Please enter your username',
  },
  emailLabel: 'Email',
  emailInputProps: {
    type: 'email',
    placeholder: 'your@email.com',
  },
  emailNameLabel: 'Username / Email',
  emailNameInputProps: {
    type: 'email',
    placeholder: 'username/ your@email.com',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
  },
  onLogoClick: () => { },
};

export default AuthForm;
