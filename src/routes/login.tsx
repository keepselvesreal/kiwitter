import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
    Error, 
    Form,
    Input,
    Switcher,
    // Title,
    Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

import { Button } from '@mui/material';


export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {name, value},
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "") return;
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // if (!window.Kakao.isInitialized()) {
    //     window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    // }

    return (
        <Wrapper>
            <img src="dragon.png" alt="imgae of login page" style={{ maxWidth: '35%', height: 'auto' }} />
            <Form onSubmit={onSubmit}>
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
                    name="password"
                    value={password}
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
                    {isLoading ? "Loading" : "Log in"}
                </Button>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <GithubButton />
            <Switcher>
                Don't have an account?{" "}
                <Link to="/create-account">Create one</Link>
                <span>🤗</span>
            </Switcher> 
        </Wrapper>
    )
}