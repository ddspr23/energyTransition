import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPencil, faShare, faBars, faBolt, faFloppyDisk, faUser } from '@fortawesome/free-solid-svg-icons';

import { globalContext } from './main';
import { useContext, useState } from 'react';

export default function Header() {
    const { headerState, setHeaderState } = useContext(globalContext);
    const [lightmode, setlightMode] = useState(true);

    const handleClick = () => {
        setlightMode(!lightmode);
        setHeaderState({ shouldEdit: headerState.shouldEdit, shouldShare: headerState.shouldShare, barColor: (headerState.barColor === '#000' ? '#282939' : '#000'), shouldLogin: false });

        const icon_c = document.querySelector('.themebtn').querySelector('.icon_container');
        const r = document.querySelector(':root');
        const b = document.querySelectorAll('button');

        if (lightmode) {
            //icon_c.style.left = '0';

            document.querySelector('.themeico').style.transform = 'rotate(360deg)';
            icon_c.style.transform = "translateX(110%)";
            r.style.setProperty('--card-color', '#ffcf82');
            r.style.setProperty('--global-color', '#000');
            r.style.backgroundColor = '#fff';
            document.body.style.backgroundColor = "#fff";

            document.querySelectorAll('.color').forEach((el) => {
                el.style.color = '#000';
            })

            document.querySelector('.themebtn').style.backgroundColor = '#ffcf82';
            document.querySelector('.icon_container').style.backgroundColor = '#000';

            b.forEach((el) => {
                el.style.backgroundColor = "#000";
                el.style.color = "#fff";
            });

            return;
        }

        document.querySelector('.themeico').style.transform = 'rotate(-360deg)';
        icon_c.style.transform = 'translateX(0%)';
        r.style.setProperty('--card-color', '#0a0c20');
        r.style.setProperty('--global-color', '#fff');
        r.style.backgroundColor = '#060715';
        document.body.style.backgroundColor = "#060715";

        document.querySelectorAll('.color').forEach((el) => {
            el.style.color = '#fff';
        })

        document.querySelector('.themebtn').style.backgroundColor = '#282939';
        document.querySelector('.icon_container').style.backgroundColor = '#2b5498';

        b.forEach((el) => {
            el.style.backgroundColor = "#282939";
            el.style.color = "#fff";
        });
    }
    // #0a0c20
    const handleEdit = (e) => {
        e.preventDefault();

        setHeaderState({
            shouldEdit: !headerState.shouldEdit, shouldShare: !headerState.shouldShare, barColor: headerState.barColor
        });
    }

    const handleLoginClick = () => {
        document.querySelector('.container').classList.toggle('show');
        console.log(document.documentElement.style.getPropertyValue('--blur-value'))
        if (document.documentElement.style.getPropertyValue('--blur-value') === "") {
            document.documentElement.style.setProperty('--blur-value', 'blur(40px)');
            return;
        }

        document.documentElement.style.setProperty('--blur-value', '');
    }

    const logout = () => {
        localStorage.removeItem('uname');
        localStorage.removeItem('token');

        window.location.reload();
    }

    const toggleDropdown = (e) => {
        e.preventDefault();
        document.querySelector('.dropdown').classList.toggle('on');
    }

    return (
        <header>
            <nav>
                <ul>
                    <li className="banner"><a className="color" href="#"><FontAwesomeIcon className='bolt' icon={faBolt} />Project Energy Transition</a></li>
                    <div className="buttons">
                        <li>
                            <div className="themebtn" onClick={handleClick}>
                                <div className="icon_container">
                                    {lightmode ? <FontAwesomeIcon className='themeico' icon={faSun} /> : <FontAwesomeIcon className='themeico' icon={faMoon} />}
                                </div>
                            </div>
                        </li>
                        <li>
                            {
                                (localStorage.getItem('uname') !== null) ? <button onClick={logout} title='Uitloggen'>{localStorage.getItem('uname')}</button> : <button className='login' onClick={handleLoginClick}><FontAwesomeIcon icon={faUser} />Inloggen</button>
                            }
                        </li>
                        <li>
                            <button className="share"><FontAwesomeIcon id="sharebtn" icon={faShare} />Share</button>
                        </li>
                        <li>
                            {headerState.shouldEdit ? <button className='savebtn' onClick={handleEdit}><FontAwesomeIcon className='save' icon={faFloppyDisk} />Opslaan</button> : <button id="editbtn" onClick={handleEdit}><FontAwesomeIcon className='pencil' icon={faPencil} />Edit</button>}
                        </li>
                    </div>
                    <div className='dropdown-menu'>
                        <li style={{ display: 'inline-block' }}>
                            <button className='ddmenu' onClick={toggleDropdown}><FontAwesomeIcon className='ellipsis' icon={faBars} /></button>
                            <div className='dropdown'>
                                {
                                    (localStorage.getItem('uname') !== null) ? <button onClick={logout} title='Uitloggen'>{localStorage.getItem('uname')}</button> : <button className='login' onClick={handleLoginClick}><FontAwesomeIcon icon={faUser} />Inloggen</button>
                                }
                                <button className="share"><FontAwesomeIcon id="sharebtn" icon={faShare} />Share</button>
                                {headerState.shouldEdit ? <button className='savebtn' onClick={handleEdit}><FontAwesomeIcon className='save' icon={faFloppyDisk} />Opslaan</button> : <button id="editbtn" onClick={handleEdit}><FontAwesomeIcon className='pencil' icon={faPencil} />Edit</button>}
                                <button onClick={handleClick} className='theme'>{lightmode ? <FontAwesomeIcon className='themeico' icon={faSun} /> : <FontAwesomeIcon className='themeico' icon={faMoon} />}Theme</button>
                            </div>
                        </li>
                    </div>
                </ul>
            </nav>
        </header>
    )
}