import './App.css'
import {useCallback, useState} from "react";
import {addEdge, applyEdgeChanges, applyNodeChanges, Position, ReactFlow} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import CustomNode from "./CustomNode.tsx";
import CustomMilestone from "./CustomMilestone.tsx";

const nodeTypes = {
    customNode: CustomNode,
    customMilestone: CustomMilestone,
};

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    dragHandle: 'none',
};

const initialNodes = [
    {
        id: 'n1',
        position: {x: 0, y: 0},
        type: 'customNode',
        data: {label: ''},
        ...nodeDefaults
    },
    {
        id: 'n2',
        position: {x: 0, y: 300},
        data: {label: 'Node 2'},
        ...nodeDefaults
    },
    {
        id: 'n3',
        position: {x: 400, y: 100},
        type: 'customMilestone',
        data: {label: ''},
        ...nodeDefaults
    },
];
const initialEdges = [
    {
        id: 'n1-n3',
        source: 'n1',
        target: 'n3'
    },
    {
        id: 'n2-n3',
        source: 'n2',
        target: 'n3'
    }
];

function App() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            />
        </div>
    )
}

export default App
