import { Chart as ChartJS } from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Doughnut } from "react-chartjs-2";
import { useDrag } from 'react-dnd';

export default function GaugeChart({ ChartName, ChartValues, MeasurmentType, chartColor, maxValue }) {
    const [cardPos, setCardPos] = useState(0);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'card',
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
    }));

    const handleMouse = (e) => {
        console.log(e.dataTransfer);
    }

    return (
        <div className='card' onMouseEnter={handleMouse} ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <h3 className="chartheader">{ChartName}</h3>
            <Doughnut data={{
                datasets: [
                    {
                        data: ChartValues,
                        backgroundColor: [`${chartColor}`, '#27293d']
                    }
                ]
            }}
                options={{
                    rotation: -90,
                    circumference: 180,
                    cutout: 27,
                    responsive: true,
                    maintainAspectRatio: false,
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
            <div className='chartValue'>
                <h1>{(parseInt(ChartValues[1]) == 0) ? (ChartValues[0] + '/' + ChartValues[0]) : (ChartValues[0] + '/' + ChartValues[1])}</h1>
                <h4>{MeasurmentType}</h4>
            </div>
        </div>
    )
}