import React, { useContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './Dashboard'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './style.css';

export const globalContext = React.createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * 1 : LOGIN
 * 2 : SIGNUP
 * 
 * For currentContainer value.
 */
export function App() {
    const [headerState, setHeaderState] = useState({ shouldEdit: false, shouldShare: false, barColor: "#282939", shouldLogin: false, currentContainer: 1, username: (localStorage.getItem('token') !== null) ? localStorage.getItem('token') : null });

    return (
        <div>
            <globalContext.Provider value={{ headerState: headerState, setHeaderState: setHeaderState }}>
                <DndProvider backend={HTML5Backend}>
                    <Dashboard />
                </DndProvider>
            </globalContext.Provider>
        </div>
    );
}

root.render(<App/>);