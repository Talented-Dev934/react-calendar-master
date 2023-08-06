import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { validateFields } from 'client/validation.js';
import { registerUser } from 'client/store/userSlice';

import './RegisterForm.css';

const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: null
  },
  password: {
    value: '',
    validateOnChange: false,
    error: null
  },
  passwordConfirm: {
    value: '',
    error: null
  }
};
const RegisterForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(initialState.username);
  const [password, setPassword] = useState(initialState.password);
  const [passwordConfirm, setPasswordConfirm] = useState(initialState.passwordConfirm);

  const handleBlur = (validationFunc, event) => {
    const {
      target: { name }
    } = event;

    switch (name) {
      case 'username':
        if (username.validateOnChange === false) {
          setUsername((data) => {
            return {
              ...data,
              validateOnChange: true,
              error: validationFunc(data.value)
            };
          });
        }
        break;
      case 'password':
        if (password.validateOnChange === false) {
          setPassword((data) => {
            return {
              ...data,
              validateOnChange: true,
              error: validationFunc(data.value)
            };
          });
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (validationFunc, event) => {
    const {
      target: { name, value }
    } = event;

    switch (name) {
      case 'username':
        setUsername((data) => {
          return {
            ...data,
            value,
            error: data.validateOnChange ? validationFunc(value) : null
          };
        });
        break;
      case 'password':
        setPassword((data) => {
          return {
            ...data,
            value,
            error: data.validateOnChange ? validationFunc(value) : null
          };
        });
        break;
      case 'passwordConfirm':
        setPasswordConfirm((data) => {
          return {
            ...data,
            value
          };
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const usernameError = validateFields.validateUsername(username.value);
    const passwordError = validateFields.validatePassword(password.value);
    const passwordConfirmError = validateFields.validatePasswordConfirm(password.value, passwordConfirm.value);

    if ([usernameError, passwordError, passwordConfirmError].every((e) => e === false)) {
      // no input errors, submit the form
      const data = {
        username: username.value,
        password: password.value
      };

      dispatch(registerUser(data)).catch((e) => {
        const error = e.response?.data ?? e;
        const errorCode = error?.errorCode ?? null;
        alert(`Registration error: ${error.message ?? error.statusText}`);

        // Update state to reflect response errors
        if (errorCode) {
          switch (errorCode) {
            case 'username':
              setUsername((data) => {
                return {
                  ...data,
                  error: error.message
                };
              });
              break;
            case 'password':
              setPassword((data) => {
                return {
                  ...data,
                  error: error.message
                };
              });
              break;
            default:
              break;
          }
        }
      });
    } else {
      // update state with input errors
      if (usernameError) {
        setUsername((data) => {
          return {
            ...data,
            validateOnChange: true,
            error: usernameError
          };
        });
      }

      if (passwordError) {
        setPassword((data) => {
          return {
            ...data,
            validateOnChange: true,
            error: passwordError
          };
        });
      }

      if (passwordConfirmError) {
        setPasswordConfirm((data) => {
          return {
            ...data,
            error: passwordConfirmError
          };
        });
      }
    }
  };

  return (
    <Form className="RegisterForm">
      <div className="text-primary">
        <h4>New User Registration</h4>
      </div>

      <Form.Group controlId="username">
        <Form.Label className="text-primary">Username</Form.Label>
        <Form.Control
          name="username"
          placeholder="Enter username"
          onChange={(event) => handleChange(validateFields.validateUsername, event)}
          onBlur={(event) => handleBlur(validateFields.validateUsername, event)}
        />
      </Form.Group>

      <div className="text-danger">
        <small>{username.error}</small>
      </div>

      <Form.Group controlId="password">
        <Form.Label className="text-primary">Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={(event) => handleChange(validateFields.validatePassword, event)}
          onBlur={(event) => handleBlur(validateFields.validatePassword, event)}
        />
      </Form.Group>

      <div className="text-danger">
        <small>{password.error}</small>
      </div>

      <Form.Group controlId="passwordConfirm">
        <Form.Label className="text-primary">Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="passwordConfirm"
          placeholder="Confirm password"
          onChange={(event) => handleChange(null, event)}
        />
      </Form.Group>

      <div className="text-danger">
        <small>{passwordConfirm.error}</small>
      </div>

      <Button type="submit" name="register-form-btn" variant="primary" onClick={handleSubmit}>
        Register
      </Button>

      <div>
        Already registered? Please <Link to="/login">login</Link>.
      </div>
    </Form>
  );
};

export default RegisterForm;
