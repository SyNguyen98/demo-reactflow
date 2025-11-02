import "./CustomNode.css"

function CustomNode({data}: { data: { label: string, width: number } }) {
    const {label, width} = data;

    return (
        <>
            {/*<Handle type="target" position={Position.Left} onConnect={onConnect} />*/}
            <div className="custom-node" style={{width: width}}>
                {label}
            </div>
            {/*<Handle type="source" position={Position.Right} onConnect={onConnect} />*/}
        </>

    );
}

export default CustomNode;