import React, { useEffect, useState} from 'react';
import ReactJson from 'react-json-view';

export default function Document(props) {
    const [data, setData] = useState({});

    useEffect(() => {
        if (props && props.data) {
            setData(props.data);
        }
    }, [props]);

    if (data === null || Object.keys(data).length === 0) return null;

    return (
        <ReactJson name={null} src={data} onEdit={false} onAdd={false} onDelete={false} onSelect={false} displayDataTypes={false} displayObjectSize={false} theme="monokai"/>
    )
}