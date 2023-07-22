import React from 'react';

export default function Text(props) {
    return(
        <span style={{fontSize: 14, color: 'red'}}>
            {props.data}
        </span>
    )
}