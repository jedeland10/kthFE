
import Chart from "./Chart"
import {useQuery} from "react-query";
import {useEffect, useState} from "react";
import Modal from 'react-modal';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    ArcElement,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import {Bar, Line, Pie, PolarArea} from "react-chartjs-2";
import CreateDiagram from "./CreateDiagram";
import userService from "../../services/UserService";
import UserService from "../../services/UserService";
import ChartApi from "../../api/ChartApi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    ArcElement,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)



function Diagram() {
    let chartApi = ChartApi();
    let userService = UserService();

    const [allDiagramsModalIsOpen, setAllDiagramsModalIsOpen] = useState(false);
    const [newDiagramModalIsOpen, setNewDiagramModalIsOpen] = useState(false);

    const [allDiagrams, setAllDiagrams] = useState([]);

    const [currentChart, setCurrentChart] = useState({});


    // const [theData, error, status] = useQuery(["fetchData"], () => chartApi.fetchData());


    async function openAllDiagramsModal() {
        let data = await chartApi.getChartsForUser(userService.getUserId())
        setAllDiagrams(data)

        console.log('All diagrams: ')
        console.log(allDiagrams)
        setAllDiagramsModalIsOpen(true);
    }


    function closeAllDiagramsModal() {
        setAllDiagramsModalIsOpen(false);
    }

    function openNewDiagramModal() {
        setNewDiagramModalIsOpen(true)
    }


    function closeNewDiagramModal() {
        setNewDiagramModalIsOpen(false);
    }

    async function setNewChart(newChartId) {
        let newChart = await chartApi.getChart(newChartId)

        await setCurrentChart(newChart)
        console.log('Current chart: ')
        console.log(currentChart)
        closeAllDiagramsModal()
    }



    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <div style={{width: '100%', height: '100%'}}>
            <div>
                <button onClick={openAllDiagramsModal}>Diagrams</button>
                <button onClick={openNewDiagramModal}>Create new diagram</button>

                {
                    <button onClick={() => chartApi.shareChart(currentChart)}>Share Diagram To Wall</button>
                }
                <Modal
                    isOpen={allDiagramsModalIsOpen}
                    onRequestClose={closeAllDiagramsModal}
                    contentLabel="Diagrams"
                    style={modalStyles}
                    ariaHideApp={false}
                >
                    <h2>Your Diagrams</h2>
                    <div>
                        {allDiagrams.length > 0 &&
                            allDiagrams.map((diagram) =>
                                <button style={{display: "block"}} key={diagram._id} onClick={() => setNewChart(diagram._id)}>{diagram.title}</button>
                            )
                        }

                        {allDiagrams.length === 0 &&
                            <div>No saved diagrams</div>
                        }
                    </div>

                    <br/>
                    <button onClick={closeAllDiagramsModal}>close</button>
                </Modal>

                <Modal
                    isOpen={newDiagramModalIsOpen}
                    onRequestClose={closeNewDiagramModal}
                    contentLabel="New Diagram"
                    style={modalStyles}
                    ariaHideApp={false}
                >
                    <CreateDiagram setParentModalIsOpen={setNewDiagramModalIsOpen} setCurrentChart={setCurrentChart}/>
                </Modal>

            </div>

            <div>
                <Chart currentChart={currentChart} size={50}/>
            </div>

        </div>
    )
}

export default Diagram
