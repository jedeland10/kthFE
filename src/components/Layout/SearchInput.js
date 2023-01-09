import {useState} from "react";
import {Select} from "antd";
import UserApi from "../../api/UserApi";
import {useNavigate} from "react-router-dom";


function SearchInput(props) {
    const userApi = UserApi()
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const navigate = useNavigate();

    const handleSearch = (newValue) => {
        if (newValue) {
            userApi.searchUsers(newValue)
                .then(resp => {
                    setData(resp ?? [])
                })
        } else {
            setData([]);
        }
    }


    const handleChange = (newValue) => {
        setValue(newValue);
    }

    const handleSelect = (selected) => {
        navigate('/user/' + selected);
    }

    return (
        <Select
            showSearch
            value={value}
            placeholder={props.placeholder}
            style={props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={data.map(d => ({
                value: d.id,
                label: d.firstName + ' ' + d.lastName,
            }))}
            onSelect={handleSelect}
        />
    )
}

export default SearchInput
