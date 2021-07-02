import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { validateFields } from '../validation.js';
import { loginUser } from '../actions/userActions';

import '../styles/LoginForm.css';

const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  password: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  passwordConfirm: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  submitCalled: false,
}
class LoginForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  componentDidMount = () => {
    this.initData();
  }

  initData = () => {
    // load locally stored returning user info
  }
  
  handleBlur = (validationFunc, event) => {
    const { target: { name } } = event;

    if (
      this.state[name]['validateOnChange'] === false &&
      this.state.submitCalled === false
    ) {
      this.setState(state => ({
        [name]: {
          ...state[name],
          validateOnChange: true,
          error: validationFunc(state[name].value)
        }
      }));
    }
    return;
  }

  handleChange = (validationFunc, event) => {
    const { target: { name, value } } = event;
    
    if (validationFunc === null) { // handle fields without validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value
        }
      }));
    } else {  // handle fields with validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value,
          error: state[name]['validateOnChange'] ? validationFunc(value) : ''
        }
      }));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    const { username, password, passwordConfirm } = this.state;
    const usernameError = validateFields.validateUsername(username.value);
    const passwordError = validateFields.validatePassword(password.value);
    const passwordConfirmError = validateFields.validatePasswordConfirm(passwordConfirm.value, password.value);

    if ([usernameError, passwordError, passwordConfirmError].every(e => e === false)) {
      // no errors submit the form
      const data = {
        username: username.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value
      }
      this.props.loginUser(data).then(this.setState(initialState));
    } else {
      // update state with errors
      this.setState(state => ({
        username: {
          ...state.username,
          validateOnChange: true,
          error: usernameError
        },
        password: {
          ...state.password,
          validateOnChange: true,
          error: passwordError
        },
        passwordConfirm: {
          ...state.passwordConfirm,
          validateOnChange: true,
          error: passwordConfirmError
        }
      }));
    }
  }

  render() {
    return (
      <div>
        <Form id='login-form'>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name='username'
              placeholder='Enter username' 
              onChange={event => this.handleChange(validateFields.validateUsername, event)}
              onBlur={event => this.handleBlur(validateFields.validateUsername, event)}
              />
          </Form.Group>
          
          <div className="text-danger">
            <small>{this.state.username.error}</small>
          </div>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              placeholder='Enter password' 
              onChange={event => this.handleChange(validateFields.validatePassword, event)}
              onBlur={event => this.handleBlur(validateFields.validatePassword, event)}
              />
          </Form.Group>

          <div className="text-danger">
            <small>{this.state.password.error}</small>
          </div>

          <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              name='passwordConfirm'
              placeholder='Confirm password'
              onChange={event => this.handleChange(null, event)}
              />
          </Form.Group>

          <div className="text-danger">
            <small>{this.state.passwordConfirm.error}</small>
          </div>

          <Button 
            type='submit'
            name='login-form-btn'
            variant='primary'
            onClick={this.handleSubmit}>
            Login
          </Button>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.config.user
  };
};

const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(LoginForm);