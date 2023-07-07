/* eslint-disable react/prop-types */

import {Handle} from 'reactflow';

// eslint-disable-next-line react/prop-types
function JsonVisNode({data, targetPosition, sourcePosition}){
    let str;
    if(typeof data.label !== 'object'){
      
        str = data.label;
    }
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
