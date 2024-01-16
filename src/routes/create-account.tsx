import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
// import { styled} from 'styled-components';
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
    Form,
    Error,
    Input,
    Switcher,
    // Title,
    Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";
import { Button } from '@mui/material';

// const Wrapper = styled.div`
//   height: 100%
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 420px;
//   padding: 50px 0px;
//   `;

// const Title = styled.h1`
// font-size: 42px
// `;

// const Form = styled.form`
// margin-top: 50px;
// display: flex;
// flex-direction: column;
// gap: 10px
// width: 100%;
// `;

// const Input = styled.input`
// padding: 10px 20px;
// border-radius: 50px;
// border: none;
// width: 100%
// font-size: 16px;
// &[type="submit"] {
//     cursor: pointer;
//     &:hover {
//         opacity: 0.8;
//     }
// }
// `;

// const Error = styled.span`
//     font-weight: 600;
//     color: tamato;
//     `;

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, SetError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
          target: { name, value },
        } = e;
        if (name === "name") {
          setName(value);
        } else if (name === "email") {
          setEmail(value);
        } else if (name === "password") {
          setPassword(value);
        }
      };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        SetError("");
        try {
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(credentials.user, { 
                displayName: name 
            });
            navigate("/")
        } catch (e) {
            //setError
            if (e instanceof FirebaseError) {
                SetError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Wrapper>
            <img src="dragon.png" alt="imgae of login page" style={{ maxWidth: '35%', height: 'auto' }} />
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="name"
                    value={name}
                    placeholder="Name"
                    type="text"
                    required
                />
                <Input
                    onChange={onChange}
                    name="email"
                    value={email}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    onChange={onChange}
                    value={password}
                    name="password"
                    placeholder="Password"
                    type="password"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: 50,
                        backgroundColor: '#ffffff', 
                        color: 'black', 
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        }
                      }}
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? "Loading" : "Create Account"}
                </Button>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <GithubButton />
            <Switcher>
                Already have an account?{" "} 
                <Link to="/login">Log in</Link>
                <span>🤗</span>
            </Switcher>
        </Wrapper>
    );
}