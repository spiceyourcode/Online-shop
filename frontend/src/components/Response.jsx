import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
function Response() {

    const [message, setMessage] = useState("");

    async function getMessage() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/hello/');            
            const data = response.data.message;            
            setMessage(data);            

        } catch (error) {
            console.log(`You have encountered ${error}`);
        }
    }

    useEffect(() => {
        getMessage();
    }, []);

    return (
        <>
            <h2>Your message is {message} </h2>
        </>
    );

}

export default Response;