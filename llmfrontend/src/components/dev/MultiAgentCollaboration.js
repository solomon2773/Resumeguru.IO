// components/MultiAgentCollaboration.js

import { useEffect, useState } from 'react';
import { runGraph, state } from '../../helpers/dev/autoGenSystem';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';

const nodes = [
    { id: '1', type: 'input', data: { label: 'User' }, position: { x: 0, y: 0 } },
    { id: '2', data: { label: 'User Interface' }, position: { x: 200, y: 0 } },
    { id: '3', data: { label: 'Job Description Input' }, position: { x: 400, y: 0 } },
    { id: '4', data: { label: 'Job Description Analysis' }, position: { x: 600, y: 0 } },
    { id: '5', data: { label: 'Interviewer Agent' }, position: { x: 800, y: 0 } },
    { id: '6', data: { label: 'Candidate Proxy Agent' }, position: { x: 1000, y: 0 } },
    { id: '7', data: { label: 'Skill Evaluation Agent' }, position: { x: 1200, y: 0 } },
    { id: '8', data: { label: 'Behavioral Analysis Agent' }, position: { x: 1400, y: 0 } },
    { id: '9', data: { label: 'Feedback Agent' }, position: { x: 1600, y: 0 } },
    { id: '10', data: { label: 'Human Proxy Agent' }, position: { x: 1800, y: 0 } },
    { id: '11', data: { label: 'Web Research Agent' }, position: { x: 2000, y: 0 } },
    { id: '12', data: { label: 'Critique Agent' }, position: { x: 2200, y: 0 } },
    { id: '13', type: 'output', data: { label: 'Results' }, position: { x: 2400, y: 0 } }
];

const edges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
    { id: 'e6-7', source: '6', target: '7' },
    { id: 'e7-8', source: '7', target: '8' },
    { id: 'e8-9', source: '8', target: '9' },
    { id: 'e9-10', source: '9', target: '10' },
    { id: 'e10-11', source: '10', target: '11' },
    { id: 'e11-12', source: '11', target: '12' },
    { id: 'e12-13', source: '12', target: '13' }
];

const MultiAgentCollaboration = () => {
    const [result, setResult] = useState("");

    useEffect(() => {
        const executeGraph = async () => {
            await runGraph();
            setResult(state.critique);
        };

        executeGraph();
    }, []);

    return (
        <div style={{ height: 800 }}>
            <h1>Multi-Agent Collaboration for Mock Interview</h1>
            <p>Check the console for the collaboration process.</p>
            <h2>Final Critique:</h2>
            <p>{result}</p>
            <ReactFlow nodes={nodes} edges={edges}>
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default MultiAgentCollaboration;
