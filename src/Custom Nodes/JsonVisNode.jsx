/* eslint-disable react/prop-types */

import {Handle} from 'reactflow';

// eslint-disable-next-line react/prop-types
function JsonVisNode({data, targetPosition, sourcePosition}){

    // console.log
    // console.log(data.label);
    let str;
    if(typeof data.label === 'object'){
        str = Object.entries(data.label);
    }else{
        str = data.label;
    }

    // console.log(str);

    // const strArr = (typeof data.label === 'object' ) ? data.label?.split(',') 
    // console.log(strArr)
    return (
        <>
            <Handle type="target" position={targetPosition} ></Handle>
            <div className='jsonVisNode__label'>
                <ul>
                { 
                (typeof data.label === 'object') ? 
                Object.entries(data.label).map(([key, value], index) =>(
                     <li key={index}>
                        <span className="jsonVisNode__label__key">{key} : </span>
                        <span>{String(value)}</span>
                     </li>                    
                )) : str
                }
                </ul>
                </div>
            <Handle type="source" position={sourcePosition} ></Handle>
        </>

    )
}


export default JsonVisNode;
