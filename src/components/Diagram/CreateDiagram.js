import {display, useForm} from "react-hook-form";
import UserService from "../../services/UserService";
import {useMutation} from "react-query";
import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import {DropdownButton, Dropdown} from "react-bootstrap";
import { v4 as uuid } from 'uuid';
import ChartApi from "../../api/ChartApi";




function CreateDiagram({setParentModalIsOpen, setCurrentChart}) {

    const possibleChartTypes = ['LINE', 'BAR', 'PIE', 'POLAR']
    const userService = UserService();
    const chartApi = ChartApi();


    const [chartData, setChartData] = useState([])

    const [labelInput, setLabelInput] = useState('')
    const [valueInput, setValueInput] = useState(0)

    function addLabelAndValue() {
        if (labelInput.length === 0) {
            return
        }
        let data = {
            id: uuid(),
            label: labelInput,
            value: valueInput
        }

        setChartData(prevState => [...prevState, data])
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    function TheData({data}) {
        return (
            <div>
                <div>{data.label}:{data.value}</div>
                <button onClick={() => removeDataEntry(data.id)}>Remove</button>
            </div>
        )
    }

    function removeDataEntry(id) {
        setChartData(prevState => prevState.filter(chart => chart.id !== id))
    }

    function saveData(res) {
        console.log(res)
        const chart = {
            labels : chartData.map(data => data.label),
            title: res.title,
            userId : userService.getUserId(),
            type : res.type,
            shared: false,
            datasets: [{
                data: chartData.map(data => Number(data.value)),
                label: 'Values',
                borderColor: 'green',
                backgroundColor: 'blue'
            }]
        }

        chartApi.postChart(chart)
            .then(idFromFetch => {
                chartApi.getChart(idFromFetch)
                    .then(chartFromFetch => {
                        setCurrentChart(chartFromFetch)
                    })
            })


        setParentModalIsOpen(false)
    }

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Create New Diagram</h1>
            <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <div>
                    <div>
                        <label>Label</label>
                        <input type="text" value={labelInput} onChange={(e) => setLabelInput(e.target.value)}/>
                    </div>

                    <div>
                        <label>Value</label>
                        <input type="number" value={valueInput} onChange={(e) => setValueInput(e.target.value)}/>
                    </div>

                    <button onClick={addLabelAndValue}>Add</button>

                    {
                        chartData.map((d) => <TheData key={d.id} data={d}/>)
                    }

                    <form onSubmit={handleSubmit(saveData)}>
                        <div>
                            <label htmlFor={"title"}>Title</label>
                            <input type="text" {...register("title", { required: true})}/>
                            <span className="errors">
                            {errors.label && "Title is required"}
                            </span>
                        </div>

                        <label htmlFor={"type"}>Select a type:</label>
                        <select name="type" {...register("type", {required: true})}>
                            {
                                possibleChartTypes.map(chartType => <option key={chartType} value={chartType}>{chartType}</option>)
                            }
                        </select>

                        <button type="submit">Save</button>

                    </form>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', padding: '10px'}}>
                <button onClick={() => setParentModalIsOpen(false)}>Close</button>
            </div>

        </div>
    )
}

export default CreateDiagram
