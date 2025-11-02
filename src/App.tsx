import './App.css'
import {useEffect, useState} from "react";
import {type Node, Position, ReactFlow} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import CustomNode from "./CustomNode.tsx";
import CustomMilestone from "./CustomMilestone.tsx";
import {PHASES} from "./constant/Phase.ts";
import {extractBranchedPaths, sortPhasesByLength} from "./service.ts";

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
        id: 'n3',
        position: {x: 400, y: 100},
        type: 'customMilestone',
        data: {label: ''},
        ...nodeDefaults
    },
];


/**
 * Removes common items between two lists and returns the unique items from each list.
 *
 * @template T - The type of elements in the lists.
 * @param {T[]} listA - The first list of items.
 * @param {T[]} listB - The second list of items.
 * @returns {[T[], T[]]} A tuple containing two arrays:
 *   - The first array contains items unique to `listA`.
 *   - The second array contains items unique to `listB`.
 */
function removeCommonItems<T>(listA: T[], listB: T[]): [T[], T[]] {
    const setA = new Set(listA); // Convert listA to a Set for efficient lookup.
    const setB = new Set(listB); // Convert listB to a Set for efficient lookup.

    const commonItems = new Set<T>(); // Set to store items common to both lists.
    for (const item of setA) {
        if (setB.has(item)) {
            commonItems.add(item); // Add item to commonItems if it exists in both sets.
        }
    }

    // Filter out common items from listA.
    const newA = listA.filter(item => !commonItems.has(item));
    // Filter out common items from listB.
    const newB = listB.filter(item => !commonItems.has(item));

    return [newA, newB]; // Return the unique items from both lists.
}

function App() {
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        /**
         * Processes the phases to generate and set nodes for a React Flow diagram.
         *
         * This function extracts branched paths from the `PHASES` constant, sorts them by length,
         * and calculates the size and position of nodes for each phase. It then updates the state
         * with the generated nodes.
         */
        const result = sortPhasesByLength(extractBranchedPaths(PHASES));
        const baseList = result[result.length - 1]; // The longest list of phases, used as a base for comparison.

        /**
         * Iterates through each list of phases, calculates unique items, and generates nodes.
         */
        result.forEach((phases, index) => {
            // Extracts unique items between the base list and the current list of phases.
            const [uniqueBase, uniquePhases] = removeCommonItems(baseList, phases);

            // Calculates the size of nodes based on the number of unique items.
            const size = (uniqueBase.length * 150 + (uniqueBase.length - uniquePhases.length) * 100) / uniquePhases.length;

            let offsetX = 0; // Tracks the horizontal position of nodes.

            /**
             * Maps each phase to a node with calculated position, size, and other properties.
             */
            const phaseNodes = phases.map(phase => {
                // Determines if the current phase extends the width based on unique phases.
                const extendWidth = uniquePhases.some(p => p.id === phase.id);

                // Creates a node object for the current phase.
                const node = {
                    id: phase.id, // Unique identifier for the node.
                    position: {x: offsetX, y: index * -200}, // Position of the node.
                    type: 'customNode', // Node type for rendering.
                    data: {
                        label: phase.name, // Label displayed on the node.
                        width: index === result.length - 1 ? 150 : (extendWidth ? size : 150), // Width of the node.
                    },
                };

                // Updates the horizontal offset for the next node.
                offsetX += extendWidth ? size + 100 : 250;
                return node;
            });

            // Updates the state with the newly generated nodes.
            setNodes(prevState => [...prevState, ...phaseNodes]);
        });
    }, []);

    return (
        <div style={{width: '98vw', height: '98vh'}}>
            <ReactFlow
                nodes={[...nodes]}
                nodeTypes={nodeTypes}
                edges={[]}
                nodesConnectable={false}
                draggable={false}
                fitView
            />
        </div>
    )
}

export default App
