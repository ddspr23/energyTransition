import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { overruled } from './common'

import { globalContext } from './main';
import { useContext, useState } from "react";

export default function Signup() {
    const { headerState, setHeaderState } = useContext(globalContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const password2 = document.getElementById('password2').value;

        if (password !== password2) {
            overruled("Passwords do not match!");
            return;
        }

        function doSignup() {
            fetch('api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/Json',
                    'Accept': '*/*'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    displayLine: JSON.parse(localStorage.getItem('chartvalues'))[2].isLine
                })
            }).then(resp => {
                if (resp.status !== 200) {
                    console.log(resp.status)
                    resp.json().then(d => overruled(d['message']))
                    return;
                }

                return resp.json();
            }).then(data => {
                localStorage.setItem('uname', username);
                localStorage.setItem('token', data['token']);
                document.querySelector('.login').click();
                window.location.reload();
            })
        }

        doSignup();

        document.querySelector('.login').click();
    }

    return (
        <div className='container show'>
            <div>
                <h2>Registreren</h2>
                <FontAwesomeIcon icon={faXmark} onClick={() => { document.querySelector('.login').click() }} />
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Gebruikersnaam' id='username' required />
                <input type='email' placeholder='Emailadres' id="email" required />
                <input type='password' placeholder='Wachtwoord' id="password" required />
                <input type='password' placeholder='Wachtwoord herhalen' id="password2" required />
                <button type='submit' style={{ 'margin-top': '1em' }}>Registreren</button>
                <small>Heb je al een account? <a onClick={() => { setHeaderState({ shouldEdit: false, shouldShare: false, barColor: "#282939", shouldLogin: false, currentContainer: 1 }) }}>Inloggen</a></small>
            </form>
        </div>
    )
}