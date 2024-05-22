import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { globalContext } from './main';
import { useContext } from "react";
import { overruled } from "./common";
export default function Login() {
    const { headerState, setHeaderState } = useContext(globalContext);

    const handleLogin = (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === "" || password === "") {
            overruled("Pleae enter your email and/or password");
            return;
        }

        function doLogin() {
            fetch('api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/Json',
                    'Accept': '*/*'
                },
                body: JSON.stringify({ email: email, password: password })
            }).then(resp => {
                if (resp.status !== 200) {
                    console.log(resp.status)
                    resp.json().then(d => overruled(d['message']))
                    return;
                }

                return resp.json();
            }).then(data => {
                localStorage.setItem('token', data['token']);
                localStorage.setItem('uname', data['username']);
                document.querySelector('.login').click();
                window.location.reload();
            });
        }

        doLogin();
     //   window.location.reload();
    }

    return (
        <div className='container'>
            <div>
                <h2>Inloggen</h2>
                <FontAwesomeIcon icon={faXmark} onClick={() => { document.querySelector('.login').click() }} />
            </div>
            <form onSubmit={handleLogin}>
                <input type='email' placeholder='Emailadres' id='email' />
                <input type='password' placeholder='Wachtwoord' id='password' />
                <a href='#'>Wachtwoord vergeten</a>
                <button type='submit'>Inloggen</button>
                <small>Heb je nog geen account? <a onClick={() => { setHeaderState({ shouldEdit: false, shouldShare: false, barColor: "#282939", shouldLogin: false, currentContainer: 2 }); document.querySelector('.container').classList.toggle('show') }}>Registreren</a></small>
            </form>
        </div>
    )
}