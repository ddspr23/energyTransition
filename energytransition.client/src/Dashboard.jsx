import { Chart as ChartJS } from 'chart.js/auto';
import { useContext, useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faXmark, faPalette, faCircleInfo, faFloppyDisk, faRepeat } from "@fortawesome/free-solid-svg-icons";

import Login from "./Login";
import Header from "./Header";
import Signup from './Signup';
import { globalContext } from "./main";
import { overruled, removeNotification } from './common';

const GaugeValues = { ttLoad: [0, 0], Solar: [0, 0], Grid: [0, 0], Battery: [0, 0], BattCharge: [0, 0], Temperature: [0, 0] }; // default values for the gauge charts.

export default function Dashboard() {
/*    useEffect(() => {
        localStorage.setItem('chartvalues', JSON.stringify([
            [
                { id: 1, cname: 'Total Load', cval: 100, mmt: 'watts', ctcl: '#248c58', mvl: 500 },
                { id: 2, cname: 'Solar', cval: 300, mmt: 'watts', ctcl: '#ffa700', mvl: 1000 },
                { id: 3, cname: 'Grid', cval: 400, mmt: 'watts', ctcl: '#89bdd7', mvl: 4200 },
                { id: 4, cname: 'Battery', cval: 344, mmt: 'watts', ctcl: '#ff5459', mvl: 4000 },
                { id: 5, cname: 'Battery Charge', cval: 99, mmt: 'percent', ctcl: '#22aa61', mvl: 100 },
                { id: 6, cname: 'Temperature', cval: 100, mmt: 'degrees', ctcl: '#1d5545', mvl: 100 },
            ],
            {
                dname: '', dval: [{
                    label: 'Battery Performance',
                    data: [20, 35, 65, 40, 35, 55, 50, 80, 32, 55, 90, 55],
                    fill: false,
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgb(255, 255, 255)',
                    tension: 0
                },
                {
                    label: 'Solar Performance',
                    data: [50, 40, 56, 43, 90, 37, 66, 34, 55, 33, 77, 39],
                    fill: false,
                    borderColor: 'rgb(255, 0, 255)',
                    backgroundColor: 'rgb(255, 0, 255)',
                    tension: 0
                },
                {
                    label: 'Generator Performance',
                    data: [55, 33, 90, 30, 50, 60, 40, 60, 56, 76, 43, 67],
                    fill: false,
                    backgroundColor: 'rgb(255, 0, 90)',
                    borderColor: 'rgb(255, 0, 90)',
                    tension: 0
                }]
            },
            {
                isLine: true
            }
        ]));
    }, []);*/
    const [focused, setFocused] = useState(false);
    const [wiggling, setWiggling] = useState(false);
    const [lines, setLines] = useState({ line1: false, line2: true, line3: false });
    const [displayLine, setDisplayLine] = useState(JSON.parse(localStorage.getItem('chartvalues'))[2].isLine);
    const [gaugeValues, setGaugeValues] = useState(GaugeValues);
    const { headerState, setHeaderState } = useContext(globalContext);
    const [box, setBoxes] = useState(null);
    const [cards, setCards] = useState(!(JSON.parse(localStorage.getItem('chartvalues'))[0].length > 0) ? [{
        "id": 3,
        "cname": "Battery Charge",
        "cval": 99,
        "mmt": "percent",
        "ctcl": "#ffffff",
        "mvl": 100
    }, {
        "id": 6,
        "cname": "Solar",
        "cval": 300,
        "mmt": "watts",
        "ctcl": "#ffffff",
        "mvl": 1000
    }, {
        "id": 2,
        "cname": "Temperature",
        "cval": 100,
        "mmt": "degrees",
        "ctcl": "#ffffff",
        "mvl": 100
    }, {
        "id": 1,
        "cname": "Battery",
        "cval": 2544,
        "mmt": "watts",
        "ctcl": "#ffffff",
        "mvl": 4000
    }, {
        "id": 5,
        "cname": "Grid",
        "cval": 400,
        "mmt": "watts",
        "ctcl": "#ffffff",
        "mvl": 4200
    }, {
        "id": 4,
        "cname": "Total Load",
        "cval": 100,
        "mmt": "watts",
        "ctcl": "#ffffff",
        "mvl": 500
    }] : JSON.parse(localStorage.getItem('chartvalues'))[0]);
    const [mainDiagram, setMainDiagram] = useState({
        dname: '', dval: [{
            label: 'Battery Performance',
            data: [20, 35, 65, 40, 35, 55, 50, 80, 32, 55, 90, 55],
            fill: false,
            backgroundColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(255, 255, 255)',
            tension: 0
        },
        {
            label: 'Solar Performance',
            data: [50, 40, 56, 43, 90, 37, 66, 34, 55, 33, 77, 39],
            fill: false,
            borderColor: 'rgb(255, 0, 255)',
            backgroundColor: 'rgb(255, 0, 255)',
            tension: 0
        },
        {
            label: 'Generator Performance',
            data: [55, 33, 90, 30, 50, 60, 40, 60, 56, 76, 43, 67],
            fill: false,
            backgroundColor: 'rgb(255, 0, 90)',
            borderColor: 'rgb(255, 0, 90)',
            tension: 0
        }]
    });

    useEffect(() => {
        console.log(box);
        if (box !== null) {
            setCards(box);
        }
    }, [box]);

    function switchItem(to, from) {
        let list = cards.splice();
        let a = list[to];
        let b = list[from];

        list[to] = b;
        list[from] = a;
    }

    function setItems(str, data) {
        let boxes = cards;
        for (let i = 0; i < str.length; i++) {
            let idx = data.findIndex(c => c.realCardId === parseInt(str[i]));
            console.log(data[idx].color);
            boxes[boxes.findIndex(l => l.id === parseInt(str[i]))].ctcl = data[idx].color;

            switchItem(i, boxes.findIndex(l => l.id === parseInt(str[i])));
        }
        console.log(boxes);
        return boxes;
    }

    useEffect(() => {
        function getUserSettings() {
            fetch('api/settings', {
                headers: {
                    'Content-Type': 'Application/Json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                method: 'GET'
            }).then(response => {
                if (response.status !== 200) {
                    response.json().then(d => overruled(d['message']));
                    return;
                }

                return response.json();
            }).then(data => {
                console.log(data);
                let boxes = setItems(data['order'], data.cards);
                console.log(boxes);
                setDisplayLine(data['displayLine']);
                setBoxes(boxes);
            })
        }

        if (localStorage.getItem('token') !== null) {
            // fetch user settings.
            getUserSettings();
        }
    }, [])

    useEffect(() => {
        const ls = JSON.parse(localStorage.getItem('chartvalues'));
        ls[2].isLine = displayLine;

        localStorage.setItem('chartvalues', JSON.stringify(ls));
    }, [displayLine])

    const doSetCardState = () => {
        let order = "";


        let arr = [];
        cards.map((val, i) => {
            order = order.concat(val.id.toString())

            arr.push({
                "realCardId": val.id,
                "color": val.ctcl
            });
        })

        function setCardState() {
            fetch('api/state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/Json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    displayLine: JSON.parse(localStorage.getItem('chartvalues'))[2].isLine,
                    "cards": arr,
                    "order": order
                })
            }).then(response => {
                if (response.status !== 200) {
                    response.json().then(d => overruled(d['message']));
                    return;
                }
            })
        }

        setCardState();
    }

    const swapBoxes = (fromBox, toBox) => {

        if (!headerState.shouldEdit)
            return;

        let boxes = cards.slice();
        let fromIndex = boxes.findIndex((box) => box.id === fromBox.id) ?? -1;
        let toIndex = boxes.findIndex((box) => box.id === toBox.id) ?? -1;

        if (fromIndex != -1 && toIndex != -1) {
            let temp = boxes[fromIndex];
            let temp2 = boxes[toIndex];

            boxes[fromIndex] = temp2;
            boxes[toIndex] = temp;

            setCards(boxes);
            let v = JSON.parse(localStorage.getItem('chartvalues'));
            v[0] = boxes;
            localStorage.setItem('chartvalues', JSON.stringify(v));
        }
    };

    const handleDragStart = (data) => (event) => {
        if (!headerState.shouldEdit)
            return;

        let fromBox = JSON.stringify({ id: data.id });
        event.dataTransfer.setData("dragContent", fromBox);
        console.log('works');
    };

    const handleDragOver = (data) => (event) => {
        if (!headerState.shouldEdit)
            return;

        event.preventDefault();
        return false;
    };

    const handleDrop = (data) => (event) => {
        if (!headerState.shouldEdit)
            return;

        event.preventDefault();
        let fromBox = JSON.parse(event.dataTransfer.getData("dragContent"));
        let toBox = { id: data.id };
        swapBoxes(fromBox, toBox);
        return false;
    };

    const wiggleElements = () => {
        if (focused) {
            return;
        }

        const cards = document.querySelectorAll('.card');
        const animStyle = getComputedStyle(document.body).getPropertyValue('--animation');

        cards.forEach((el) => {
            el.setAttribute('draggable', 'true');
            el.style.animation = animStyle;
        })

        setWiggling(true);
        return;
    }

    const stopWiggle = () => {
        const cards = document.querySelectorAll('.card');

        cards.forEach((el) => {
            el.style.animation = '';
            el.setAttribute('draggable', 'false');
        })

        setWiggling(false);
    }

    const handleStopWiggle = () => {
        stopWiggle();
        setHeaderState({ shouldEdit: false, shouldShare: false, barColor: headerState.barColor });
    }

    const focusCard = (e) => {
        if (wiggling) {
            overruled('Cannot edit while changing cards!');
            return;
        } else if (document.documentElement.style.getPropertyValue('--blur-value') !== "") {
            overruled("Cannot edit while other card is focused!");
            return;
        }

        document.documentElement.style.setProperty('--blur-value', 'blur(40px)');
        e.currentTarget.parentNode.classList.remove('focusable');

        setFocused(true);
    }

    const unfocusCard = (e) => {
        document.documentElement.style.setProperty('--blur-value', '');
        e.currentTarget.parentNode.classList.add('focusable');

        doSetCardState();
        setFocused(false);
    }

    const focusDiagram = (e) => {
        document.documentElement.style.setProperty('--blur-value', 'blur(40px)');
        console.log(e.currentTarget.parentNode);
        e.currentTarget.parentNode.style.filter = 'blur(0px)';

        setFocused(true);
    }

    const unfocusDiagram = (e) => {
        document.documentElement.style.setProperty('--blur-value', '');
        e.currentTarget.parentNode.style.filter = 'var(--blur-value)';

        setFocused(false);
    }

    const setColor = (e) => {
        let box = cards.slice();
        let cardIndex = box.findIndex(c => c.id == e.currentTarget.parentNode.parentNode.dataset.boxId);
        box[cardIndex].ctcl = e.currentTarget.value;
 
        setCards(box);
        let v = JSON.parse(localStorage.getItem('chartvalues'));
        v[0] = box;
        localStorage.setItem('chartvalues', JSON.stringify(v));
    }

    const setHeader = (e) => {
        let box = cards.slice();
        const cardIndex = box.findIndex(c => c.id == e.currentTarget.parentNode.dataset.boxId);
        box[cardIndex].cname = e.currentTarget.value;

        setCards(box);
        let v = JSON.parse(localStorage.getItem('chartvalues'));
        v[0] = box;
        localStorage.setItem('chartvalues', JSON.stringify(v));
    }

    const setMeasurmentType = (e) => {
        let box = cards.slice();
        const cardIndex = box.findIndex(c => c.id == e.currentTarget.parentNode.parentNode.dataset.boxId);
        box[cardIndex].mmt = e.currentTarget.value;

        setCards(box);
        let v = JSON.parse(localStorage.getItem('chartvalues'));
        v[0] = box;
        localStorage.setItem('chartvalues', JSON.stringify(v));
    }

    const saveStateChanges = () => {
        
    }

    const changeLine = (e) => {
        //setDisplayLine(!displayLine);
        console.log(e.currentTarget.parentNode.dataset.chartId);
        if (e.currentTarget.parentNode.dataset.chartId === '1') {
            setLines({ line1: !lines.line1, line2: lines.line2, line3: lines.line3 });
            return;
        } else if (e.currentTarget.parentNode.dataset.chartId === '2') {
            setLines({ line1: lines.line1, line2: !lines.line2, line3: lines.line3 });
            return;
        } else if (e.currentTarget.parentNode.dataset.chartId === '3') {
            setLines({ line1: lines.line1, line2: lines.line2, line3: !lines.line3 });
            return;
        }

        const ls = JSON.parse(localStorage.getItem('chartvalues'));
        ls[2].isLine = !displayLine;

        localStorage.setItem('chartvalues', JSON.stringify(ls));
        doSetCardState();
    }

    console.log(cards);

    useEffect(() => {
        console.log(headerState.shouldEdit);
        if (headerState.shouldEdit) {
            wiggleElements();
            return;
        } else {
            handleStopWiggle();
            return;
        }
    }, [headerState.shouldEdit]) // 'listen' to any state changes.

    useEffect(() => {
        window.addEventListener('beforeunload', saveStateChanges);
    }, [])

    return (
        <div className="main">
            <div id='notification'>
                <FontAwesomeIcon icon={faCircleInfo} className='info' />
                <span id='nmessage'></span>
                <FontAwesomeIcon icon={faXmark} className='nclose' onClick={removeNotification} />
            </div>
            {
                (headerState.currentContainer === 1 || headerState.currentContainer === undefined) ? <Login /> : <Signup />
            }
            <Header />
            <div className="statistics">
                <div className="cards">
                    {
                        cards.map((val, i) => 
                        (
                            <div key={i} onDragStart={handleDragStart({ id: val.id })} onDragOver={handleDragOver({ id: val.id })} onDrop={handleDrop({ id: val.id })} data-box-id={val.id} className='card colorable focusable'>
                                    {
                                    focused && <label className='palette'>
                                        <i className='color'><FontAwesomeIcon icon={faPalette} className='color' /></i>
                                        <input type='color' style={{ display: 'none' }} onChange={setColor} />
                                    </label>
                                    }
                                    {
                                        focused ? <input type='text' className='chartheader' onChange={setHeader} defaultValue={val.cname}/> : <h5 className="chartheader color">{val.cname}</h5>
                                    }
                                    {
                                        focused ? <button onClick={unfocusCard}><FontAwesomeIcon className="color cardbtn closebtn" icon={faXmark} /></button> : <button onClick={focusCard}><FontAwesomeIcon className="color cardbtn" icon={faPencil} /></button>
                                    }
                                    <Doughnut data={{
                                        datasets: [
                                            {
                                                data: [val.cval, (val.cval - val.mvl)],
                                                backgroundColor: [`${val.ctcl}`, headerState.barColor]
                                            }
                                        ]
                                    }}
                                        options={{
                                            rotation: -90,
                                            circumference: 180,
                                            cutout: 52,
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },

                                                tooltip: {
                                                    enabled: false
                                                }
                                            },

                                            elements: {
                                                arc: {
                                                    borderWidth: 0
                                                }
                                            },
                                        }}
                                        id="doughnut"
                                    />
                                    <div className='chartValue color'>
                                        <h1>{val.cval + '/' + val.mvl}</h1>
                                        {
                                            focused ? <input type='text' onChange={setMeasurmentType} style={{ 'text-align': 'center', 'font-size': '1.1rem' }} defaultValue={val.mmt}/> : <h4>{val.mmt}</h4>
                                        }
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="graphs">
                    <div className="left_stat">
                        <div className="solar_stat colorable" data-chart-id="1">
                            {focused ? <button onClick={unfocusDiagram}><FontAwesomeIcon icon={faFloppyDisk} className='color' /></button> : <button onClick={focusDiagram}><FontAwesomeIcon icon={faPencil} className='color' /></button>}
                            {
                                lines.line1 ? <Line id="graph1" className="hidden" data={{
                                    labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                                    datasets: mainDiagram.dval
                                }}

                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true
                                    }}
                                /> : <Bar id="graph1" className="hidden" data={{
                                    labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                                    datasets: mainDiagram.dval
                                }}

                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true
                                    }}
                                />
                            }
                            {
                                focused && <button className='rpt' onClick={changeLine}><FontAwesomeIcon icon={faRepeat} className='color' /></button>
                            }
                        </div>
                    </div>
                    <div className="right_stat">
                        <div className="battery_stat_container">
                            <div className="battery_stat colorable" data-chart-id="2">
                                {focused ? <button onClick={unfocusDiagram}><FontAwesomeIcon icon={faFloppyDisk} className='color' /></button> : <button onClick={focusDiagram}><FontAwesomeIcon icon={faPencil} className='color' /></button>}
                                {
                                    lines.line2 ? <Line data={{
                                        labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                                        datasets: [
                                            {
                                                label: 'Batt1',
                                                data: [20, 35, 65, 40, 35, 55, 50, 80, 32, 55, 90, 55],
                                                fill: false,
                                                backgroundColor: 'rgb(8, 22, 99)',
                                                borderColor: 'rgb(8, 22, 99)',
                                            },
                                            {
                                                label: 'Batt2',
                                                data: [50, 40, 56, 43, 90, 77, 66, 34, 55, 33, 77, 39],
                                                fill: false,
                                                backgroundColor: 'rgb(255, 40, 70)',
                                                borderColor: 'rgb(255, 40, 70)',
                                            },
                                            {
                                                label: 'Batt3',
                                                data: [55, 33, 90, 30, 50, 60, 40, 60, 56, 76, 43, 67],
                                                fill: false,
                                                backgroundColor: 'rgb(255, 100, 0)',
                                                borderColor: 'rgb(255, 100, 0)',
                                                tension: 0
                                            }
                                        ]
                                    }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                        }}
                                    /> : <Bar data={{
                                        labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                                        datasets: [
                                            {
                                                label: 'Batt1',
                                                data: [20, 35, 65, 40, 35, 55, 50, 80, 32, 55, 90, 55],
                                                fill: false,
                                                backgroundColor: 'rgb(8, 22, 99)',
                                                borderColor: 'rgb(8, 22, 99)',
                                            },
                                            {
                                                label: 'Batt2',
                                                data: [50, 40, 56, 43, 90, 77, 66, 34, 55, 33, 77, 39],
                                                fill: false,
                                                backgroundColor: 'rgb(255, 40, 70)',
                                                borderColor: 'rgb(255, 40, 70)',
                                            },
                                            {
                                                label: 'Batt3',
                                                data: [55, 33, 90, 30, 50, 60, 40, 60, 56, 76, 43, 67],
                                                fill: false,
                                                backgroundColor: 'rgb(255, 100, 0)',
                                                borderColor: 'rgb(255, 100, 0)',
                                                tension: 0
                                            }
                                        ]
                                    }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                        }}
                                    />
                                }
                                {
                                    focused && <button className='rpt' onClick={changeLine}><FontAwesomeIcon icon={faRepeat} className='color' /></button>
                                }
                            </div>
                            <div className="charge_stat colorable" data-chart-id="3">
                                {focused ? <button onClick={unfocusDiagram}><FontAwesomeIcon icon={faFloppyDisk} className='color' /></button> : <button onClick={focusDiagram}><FontAwesomeIcon icon={faPencil} className='color' /></button>}
                                {
                                    lines.line3 ? <Line data={{
                                        labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                                        datasets: [
                                            {
                                                label: 'Batt1',
                                                data: [20, 35, 65, 40, 35, 55, 50, 80, 32, 55, 90, 55],
                                                fill: false,
                                                backgroundColor: '#9a63c8',
                                                borderColor: '#9a63c8',
                                            },
                                            {
                                                label: 'Batt2',
                                                data: [70, 20, 96, 43, 60, 40, 66, 34, 55, 53, 27, 79],
                                                fill: false,
                                                backgroundColor: '#698eb3',
                                                borderColor: '#698eb3',
                                            },
                                            {
                                                label: 'Batt3',
                                                data: [95, 73, 20, 50, 80, 30, 10, 90, 46, 76, 43, 67],
                                                fill: false,
                                                backgroundColor: '#302971',
                                                borderColor: '#302971',
                                            }
                                        ]
                                    }}

                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                        }}
                                    /> : <Bar data={{
                                        labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                                        datasets: [
                                            {
                                                label: 'Batt1',
                                                data: [20, 35, 65, 40, 35, 55, 50, 80, 32, 55, 90, 55],
                                                fill: false,
                                                backgroundColor: '#9a63c8',
                                                borderColor: '#9a63c8',
                                            },
                                            {
                                                label: 'Batt2',
                                                data: [70, 20, 96, 43, 60, 40, 66, 34, 55, 53, 27, 79],
                                                fill: false,
                                                backgroundColor: '#698eb3',
                                                borderColor: '#698eb3',
                                            },
                                            {
                                                label: 'Batt3',
                                                data: [95, 73, 20, 50, 80, 30, 10, 90, 46, 76, 43, 67],
                                                fill: false,
                                                backgroundColor: '#302971',
                                                borderColor: '#302971',
                                            }
                                        ]
                                    }}

                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                        }}
                                    />
                                }
                                {
                                    focused && <button className='rpt' onClick={changeLine}><FontAwesomeIcon icon={faRepeat} className='color' /></button>
                                }
                            </div>
                            <div className='sources colorable'>
                                <div className='scard'>
                                    <div className="wrapper">
                                        <div className="content">
                                            <span>Big text</span>
                                            <small>small text</small>
                                        </div>
                                    </div>
                                    <div className="wrapper">
                                        <div className="content">
                                            <span>Big text</span>
                                            <small>small text</small>
                                        </div>
                                    </div>
                                </div>
                                <div className='scard'>
                                    <div className="wrapper">
                                        <div className="content">
                                            <span>Big text</span>
                                            <small>small text</small>
                                        </div>
                                    </div>
                                    <div className="wrapper">
                                        <div className="content">
                                            <span>Big text</span>
                                            <small>small text</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}