import "./CustomMilestone.css"
import {Handle, Position} from "@xyflow/react";

function CustomMilestone() {
    const onConnect = (params) => console.log('handle onConnect', params);

    return (
        <>
            <Handle type="target" position={Position.Left} onConnect={onConnect} />
            <div className="custom-milestone"/>
            <Handle type="source" position={Position.Right} onConnect={onConnect} />
        </>

    );
}

export default CustomMilestone;