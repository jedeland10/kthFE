import {Bar, Line, Pie, PolarArea} from "react-chartjs-2";
import {useState} from "react";


function Chart({currentChart, size}) {
    const [currentChartOptions, setCurrentChartOptions] = useState({
        responsive:true,
        maintainAspectRatio: false,
    })


    return (
        <>
            {currentChart !== null && currentChart.type !== '' &&
                <div className={'inner-chart-container'} style={{height: size+'vh', minHeight: '20vh'}}>
                    {currentChart.type === 'LINE' &&
                        <Line data={currentChart} options={currentChartOptions}/>
                    }

                    {currentChart.type === 'BAR' &&
                        <Bar data={currentChart} options={currentChartOptions}/>
                    }

                    {currentChart.type === 'PIE' &&
                        <Pie data={currentChart} options={currentChartOptions}/>
                    }

                    {currentChart.type === 'POLAR' &&
                        <PolarArea data={currentChart} options={currentChartOptions}/>
                    }
                </div>
            }
        </>
    )
}

export default Chart
