import React, { useEffect, useState  } from "react";
import Keyword from './keyword';
import Data from './data';
import User from './user';

export default function Result(props) {
    const [ list, setList ] = useState([]);

    useEffect(() => {
        if ( props && props.list ) {
            setList(props.list);
        }
    }, [ props ]);

    return (
        <React.Fragment>
            {
                list.map((item, index) => {
                    if ( item.profileType === 'keywordProfile' ) {
                        return <Keyword key={index} item={item}/>
                    } else if ( item.profileType === 'dataProfile' ) {
                        return <Data key={index} item={item}/>
                    } else {
                        return <User key={index} item={item}/>
                    }
                })
            }
        </React.Fragment>
    )
}