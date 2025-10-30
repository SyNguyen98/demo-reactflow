import "./CustomNode.css"
import {Handle, Position} from "@xyflow/react";

function CustomNode() {
    const onConnect = (params) => console.log('handle onConnect', params);

    return (
        <>
            <Handle type="target" position={Position.Left} onConnect={onConnect} />
            <div className="custom-node">
                This is custom node
            </div>
            <Handle type="source" position={Position.Right} onConnect={onConnect} />
        </>

    );
}

export default CustomNode;