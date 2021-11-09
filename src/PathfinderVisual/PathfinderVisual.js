import React, {useState} from 'react'
import Node from './Node/Node'
import './PathfinderVisual.css'
import { primGen } from './Algorithms/Prim'
import { dijkstra } from './Algorithms/Dijkstra'

let renderShortestPath = false;
let drawGrid = true;
let objTransition = 0;
let nodes = [];
let pathSoFar = [];

function genNodes() {
    const nodes = [];
    for (let row = 0; row < 25; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            const currentNode = { col, 
                row, 
                isStart: false, 
                isFinish: false,
                isVisited: false,
                isWall: true,
                isPassage: false,
                isDeadEnd: false,
                isPath: false,
                isSolution: false,
                };

            currentRow.push(currentNode);
        }
        nodes.push(currentRow);
    }
    return nodes;
}

const PathfinderVisual = () => {
    
    if (drawGrid) {
        nodes = genNodes();
        drawGrid = false;
    }

    let [values, setState] = useState(true);
    
    function genMaze() {
        nodes = genNodes();
        primGen(nodes);
        let firstDeadEnd = true;
        let farthestCell = 0;
        let magnitude = 0;
        let randStart = nodes[0][0];
        let endPoint = nodes[0][0];
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 50; col++) {
                if (nodes[row][col].isDeadEnd === true) {
                    if (firstDeadEnd === true) {
                        randStart = nodes[row][col];
                        firstDeadEnd = false;
                        continue;
                    }
                    magnitude = Math.sqrt((col-randStart.col)**2 + (row-randStart.row)**2);
                    if (magnitude > farthestCell)
                    {
                        farthestCell = magnitude;
                        endPoint = nodes[row][col];
                    }
                }
            }
        }
        
        
        nodes[randStart.row][randStart.col].isStart = true;
        nodes[endPoint.row][endPoint.col].isFinish = true;

        setState({nodes});

    }

    function visualizeDijsktra() {
        pathSoFar = dijkstra(nodes);
        let visualizeDrawPath = new Promise(function(resolve, reject) {
        for (let i = 0; i < pathSoFar[0].length; i++) {
            setTimeout(() => {
                const node = pathSoFar[0][i];
                let type = typeof document.getElementsByClassName(`node ${node.row}-${node.col}`)[0];
                if (type === 'object' && node.isFinish !== true && node.isStart !== true)
                    document.getElementsByClassName(`node ${node.row}-${node.col}`)[0].className = `node ${node.row}-${node.col} node-path`;
                if (node.isFinish === true) {
                    resolve("Finished");
                }
            }, 10*i);
        }
        });
        
        visualizeDrawPath.then(
            function(value) {
                pathSoFar[1] = pathSoFar[1].reverse();
                for (let i = 0; i < pathSoFar[1].length; i++) {
                    setTimeout(() => {
                        const node = pathSoFar[1][i];
                        let type = typeof document.getElementsByClassName(`node ${node.row}-${node.col}`)[0];
                        if (type === 'object' && node.isFinish !== true && node.isStart !== true)
                            document.getElementsByClassName(`node ${node.row}-${node.col} node-path`)[0].className = `node ${node.row}-${node.col} node-solution`;
                    }, 30*i);
                }
            });

        setState({nodes});
    }
    
    function handleMouseDown(row, col) {
        if (nodes[row][col].isStart === true) {
            objTransition = 1;
            nodes[row][col].isStart = false;
        }
        if (nodes[row][col].isFinish === true) {
            objTransition = 2;
            nodes[row][col].isFinish = false;
        }
    }

    function handleMouseUp(row, col) {
        if (objTransition === 1) {
            nodes[row][col].isStart = true;
        }
        if (objTransition === 2) {
            nodes[row][col].isFinish = true;
        }
        objTransition = 0;
        setState({nodes});
    }

    return (
        <>
        <button onClick={genMaze}>Generate Maze</button>
        <button onClick={visualizeDijsktra}>Visualize Dizkstra</button>
            <div className = "grid">
                {nodes.map((row, rowIdx) => {
                return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {           
                            return <Node 
                            key={nodeIdx} 
                            isStart={node.isStart} 
                            isFinish={node.isFinish} 
                            isVisited={node.isVisited} 
                            isWall={node.isWall} 
                            isPassage={node.isPassage} 
                            isDeadEnd={node.isDeadEnd} 
                            isPath={node.isPath} 
                            isSolution={node.isSolution} 
                            row={node.row} 
                            col={node.col} 
                            onMouseDown={(row, col) => handleMouseDown(row, col)} 
                            onMouseUp={(row, col) => handleMouseUp(row, col)}></Node>
                        })}
                    </div>
                );
                })}
            </div>
        </>
    )
    
}

export default PathfinderVisual
