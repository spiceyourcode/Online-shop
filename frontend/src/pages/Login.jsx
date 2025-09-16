import { useState } from "react";
import {useDispatch} from "react-redux";
import {loginUser} from "../features/authSlice";

export default function Login(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(loginUser({email, password}));
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
            <button type="submit">Login</button>
        </form>
    );

}

