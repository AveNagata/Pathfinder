import React, {useState} from 'react'
import styled from 'styled-components'
import Node from './Node/Node'
import './PathfinderVisual.css'
import { primGen } from './Algorithms/Prim'
import { dijkstra } from './Algorithms/Dijkstra'
import { generateWalls } from './Algorithms/Prim'

// Global flags/arrays for keeping track of nodes, animations, mouse positions, etc
let renderShortestPath = false;
let drawGrid = true;
let objTransition = 0;
let nodes = [];
let pathSoFar = [];
let beingDrawn = false;
let solved = false;
let mouseX = 0;
let mouseY = 0;

/* Generates the array of nodes for use in creating the drawGrid. 
-----------------------------------------------------------------
Walls = 0 creates nodes that start as passages, walls = 1 creates nodes that start as walls for use in dijkstras alg
isBorder = used to determine border to prevent array out of bounds
isSolution = not really used, product of trying different ways of tracking the solved path
isPath = is used for animations
isPassage = is flag for wall vs path
isWall = is used in prims to generate paths   
row/col if else check used to generate start and end points on page load/reset
-----------------------------------------------------------------*/
const ButtonContainer = styled.nav`
    height: 60px;
    width: 100%;
    display: flex;
    top: 0;
    z-index: 1;
    border-bottom: 1px solid palevioletred;
    margin-bottom: 0px;
    background: #f9f9f9;
`

const Button = styled.button`
    color: palevioletred;
    margin-left: 20px;
    margin-top: 12px;
    width: 180px;
    font-size: 1.1em;
    height: 60%;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 10px;
    
    :disabled {
        color: black;
        background-color: grey;
        border: 2px solid black;
    }

    :hover {
        transform: scale(1.05);
    }

    :active {
        color: black;
        border: 2px solid black;
    }
`
const ContainerHeader = styled.h1`
    color: palevioletred;
    margin-left: 24px;
    margin-right: 250px;
    justify-self: flex-start;
    text-decoration: none;
    display: flex;
    align-items: center;
`

function genNodes(walls) {
    const nodes = [];
    if (walls === 0) {
        for (let row = 0; row < 25; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                let currentNode = {};
                if (row === 12 && col === 15) {
                    currentNode = { col, 
                        row, 
                        isStart: true, 
                        isFinish: false,
                        isVisited: false,
                        isWall: false,
                        isPassage: true,
                        isDeadEnd: false,
                        isPath: false,
                        isSolution: false,
                        isBorder: false
                        };
                }
                else if (row === 12 && col === 35) {
                    currentNode = { col, 
                        row, 
                        isStart: false, 
                        isFinish: true,
                        isVisited: false,
                        isWall: false,
                        isPassage: true,
                        isDeadEnd: false,
                        isPath: false,
                        isSolution: false,
                        isBorder: false
                        };
                }
                else {
                    currentNode = { col, 
                        row, 
                        isStart: false, 
                        isFinish: false,
                        isVisited: false,
                        isWall: false,
                        isPassage: true,
                        isDeadEnd: false,
                        isPath: false,
                        isSolution: false,
                        isBorder: false
                        };
                }
                currentRow.push(currentNode); // Create node, push node onto row, creating columns
            }
            nodes.push(currentRow); // Push row onto node array to create grid
        }
        generateWalls(nodes, 0); // Generate boundary, prevent array out of bounds
    }
    else {
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
                    isBorder: false
                    };

                currentRow.push(currentNode);
            }
            nodes.push(currentRow);
        }
    }
    return nodes;
}


/* This is the function component that is being rendered, the main functionality lies here */
const PathfinderVisual = () => {
    
    //let [moving, setMoving] = useState(false);
    
    // On first pass, generate nodes, mark them all as passages, and create the boundary, start, and end points
    if (drawGrid) {
        nodes = genNodes(0);
        drawGrid = false;
    }

    // Use state used to rerender components
    let [values, setState] = useState(true);
    
    // Generate maze is Prims Function, as of now,
    // The last part of this function loops through all nodes and finds their magnitude from the start point to get an estimated start and endpoint that are far away from each other
    function genMaze() {
        objTransition = 0;
        const visualizeButton = document.getElementById("Visualize");
        visualizeButton.disabled = false;
        solved = false;
        nodes = genNodes(1);
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


    // Visualize Dijkstras disables buttons, creates setTimeouts to extend the animation and make it look for fluid, then on resolve it draws the solution path using the same method
    // Buttons are disabled during animations to prevent bugs
    function visualizeDijsktra() {
        objTransition = 0;

        const genButton = document.getElementById("Generate");
        genButton.disabled = true;

        const visualizeButton = document.getElementById("Visualize");
        visualizeButton.disabled = true;
        
        const resetButton = document.getElementById("Reset");
        resetButton.disabled = true;

        const clearButton = document.getElementById("Clear");
        clearButton.disabled = true;

        beingDrawn = true;;
        pathSoFar = dijkstra(nodes);
        
        let visualizeDrawSearch = new Promise(function(resolve, reject) {
        for (let i = 0; i < pathSoFar[0].length; i++) {
            setTimeout(() => {
                const node = pathSoFar[0][i];
                let type = typeof document.getElementsByClassName(`node ${node.row}-${node.col}`)[0];
                if (type === 'object' && node.isFinish !== true && node.isStart !== true)
                    document.getElementsByClassName(`node ${node.row}-${node.col}`)[0].className = `node ${node.row}-${node.col} node-path`;
                if (node.isFinish === true || i === pathSoFar[0].length - 1) {
                    resolve("Finished");
                }
            }, 10*i);
        }
        });
        
        visualizeDrawSearch.then(
            function(value) {
                pathSoFar[1] = pathSoFar[1].reverse();
                let visualizeDrawPath = new Promise(function(resolve, reject) {
                for (let i = 0; i < pathSoFar[1].length; i++) {
                    setTimeout(() => {
                        const node = pathSoFar[1][i];
                        let type = typeof document.getElementsByClassName(`node ${node.row}-${node.col}`)[0];
                        if (type === 'object' && node.isFinish !== true && node.isStart !== true && pathSoFar[2])
                            document.getElementsByClassName(`node ${node.row}-${node.col} node-path`)[0].className = `node ${node.row}-${node.col} node-solution`;
                        if (node.isFinish === true || i === pathSoFar[1].length - 1) {
                            resolve("Drawn");
                        }
                    }, 30*i);
                }
            });
            visualizeDrawPath.then (
                function(value) {
                    const genButton = document.getElementById("Generate");
                    const resetButton = document.getElementById("Reset");
                    const clearButton = document.getElementById("Clear");
                    clearButton.disabled = false;
                    resetButton.disabled = false;
                    genButton.disabled = false;
                    beingDrawn = false;
                    solved = true;
                }
            );
        });

        setState({nodes});

    }
    
    // Handle moving start/end points and with drawing walls
    // objTransition = flag to determine what type of node is being clicked on. If its start/end point allow it to be moved, if its a wall, enable dragging functionality to create/destroy walls
    function handleMouseDown(row, col) {
        if (objTransition === 0) {
            if (nodes[row][col].isStart === true && !beingDrawn) {
                const genButton = document.getElementById("Generate");
                const visualizeButton = document.getElementById("Visualize");
                const resetButton = document.getElementById("Reset");
                const clearButton = document.getElementById("Clear");
                clearButton.disabled = true;
                resetButton.disabled = true;
                genButton.disabled = true;
                visualizeButton.disabled = true;
                objTransition = 1;
                nodes[row][col].isStart = false;
                document.getElementsByClassName("node-hidden")[0].className = "node-dragged-start";
                document.getElementsByClassName("node-dragged-start")[0].style.top = `${mouseY - 10}px`;
                document.getElementsByClassName("node-dragged-start")[0].style.left = `${mouseX - 10}px`;
            }
            else if (nodes[row][col].isFinish === true && !beingDrawn) {
                const genButton = document.getElementById("Generate");
                const visualizeButton = document.getElementById("Visualize");
                const resetButton = document.getElementById("Reset");
                const clearButton = document.getElementById("Clear");
                clearButton.disabled = true;
                resetButton.disabled = true;
                genButton.disabled = true;
                visualizeButton.disabled = true;
                objTransition = 2;
                nodes[row][col].isFinish = false;
                document.getElementsByClassName("node-hidden")[0].className = "node-dragged-finish";
                document.getElementsByClassName("node-dragged-finish")[0].style.top = `${mouseY - 10}px`;
                document.getElementsByClassName("node-dragged-finish")[0].style.left = `${mouseX - 10}px`
            }
            else if (nodes[row][col].isPassage && nodes[row][col].isBorder === false) {
                nodes[row][col].isPassage = false;
                nodes[row][col].isWall = true;
                objTransition = 3;
            }
            else if (nodes[row][col].isWall && nodes[row][col].isBorder === false) {
                nodes[row][col].isPassage = true;
                nodes[row][col].isWall = false;
                objTransition = 3;
            }
        }
        else {
            if (objTransition === 1) {
                if (nodes[row][col].isWall !== true) {

                    const genButton = document.getElementById("Generate");
                    const resetButton = document.getElementById("Reset");
                    const clearButton = document.getElementById("Clear");
                    clearButton.disabled = false;
                    resetButton.disabled = false;
                    genButton.disabled = false;

                    if (!solved) {
                        const visualizeButton = document.getElementById("Visualize");
                        visualizeButton.disabled = false;
                    }
                    nodes[row][col].isStart = true;
                    document.getElementsByClassName("node-dragged-start")[0].className = "node-hidden";
                    objTransition = 0;
                }
            }
            if (objTransition === 2) {
                if (nodes[row][col].isWall !== true) {

                    const genButton = document.getElementById("Generate");
                    const resetButton = document.getElementById("Reset");
                    const clearButton = document.getElementById("Clear");
                    clearButton.disabled = false;
                    resetButton.disabled = false;
                    genButton.disabled = false;

                    if (!solved) {
                        const visualizeButton = document.getElementById("Visualize");
                        visualizeButton.disabled = false;
                    }

                    nodes[row][col].isFinish = true;
                    document.getElementsByClassName("node-dragged-finish")[0].className = "node-hidden";
                    objTransition = 0;
                }
            }
        }
        setState({nodes});
    }

    // If mouse1 is released, disable drawing walls on hover
    function handleMouseUp(row, col) {
        if (objTransition === 3) {
            objTransition = 0;
        }
    }

    // On dragging start/end point, reposition "dragged node" to mouse cursor. Just a visual representation of the node being moved
    function handleMove(e) {
        if (objTransition === 1) {
            if (document.getElementsByClassName("node-dragged-start").length > 0) {
                document.getElementsByClassName("node-dragged-start")[0].style.top = `${e.clientY - 10}px`;
                document.getElementsByClassName("node-dragged-start")[0].style.left = `${e.clientX - 10}px`
            }
        }
        else if (objTransition === 2) {
            if (document.getElementsByClassName("node-dragged-finish").length > 0) {
                document.getElementsByClassName("node-dragged-finish")[0].style.top = `${e.clientY - 10}px`;
                document.getElementsByClassName("node-dragged-finish")[0].style.left = `${e.clientX - 10}px`
            }
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // Simple reset grid functionality. Reset certain flags, reenable visualize buttons, regenerate nodes and rerender
    function resetGrid () {
        objTransition = 0;
        nodes = genNodes(0);
        const visualizeButton = document.getElementById("Visualize");
        visualizeButton.disabled = false;
        solved = false;
        setState({nodes});
    }

    // Go through pat
    function clearGrid () {
        objTransition = 0;
        const visualizeButton = document.getElementById("Visualize");
        visualizeButton.disabled = false;
        solved = false;
        for (let i = 0; i < pathSoFar[0].length; i++) {
            nodes[pathSoFar[0][i].row][pathSoFar[0][i].col].isVisited = false;
            nodes[pathSoFar[0][i].row][pathSoFar[0][i].col].isPath = false;
            nodes[pathSoFar[0][i].row][pathSoFar[0][i].col].isPassage = true;
        }
        setState({nodes});
    }
    
    // Functionality to toggle walls on and off
    function toggleWalls(row, col) {
        if (objTransition === 3) {
            if (nodes[row][col].isPassage && nodes[row][col].isBorder === false) {
                nodes[row][col].isPassage = false;
                nodes[row][col].isWall = true;
            }
            else if (nodes[row][col].isWall && nodes[row][col].isBorder === false) {
                nodes[row][col].isPassage = true;
                nodes[row][col].isWall = false;
            }
            setState({nodes});
        }
    }

    // If mouse leaves grid area, turn off wall toggling otherwise it doesnt know if you let off mouse1 while out of grid area
    function mouseLeftGrid() {
        if (objTransition === 3) {
            objTransition = 0;
        }
    }

    return (
        <div onMouseMove={e => handleMove(e)}>
        <ButtonContainer>
            <ContainerHeader>Pathfinding Visualizer</ContainerHeader>
            <Button id="Generate" onClick={genMaze}>Generate Maze</Button>
            <Button id="Visualize" onClick={visualizeDijsktra}>Visualize Dijkstra</Button>
            <Button id="Reset" onClick={resetGrid}>Reset</Button>
            <Button id="Clear" onClick={clearGrid}>Clear</Button>
        <div className = "node-hidden" ></div>
        </ButtonContainer>
            <div onMouseLeave={mouseLeftGrid} className = "grid">
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
                            onMouseUp={(row, col) => handleMouseUp(row, col)}
                            onMouseOver={(row, col) => toggleWalls(row, col)}
                            ></Node>
                        })}
                    </div>

                );
                })}
            </div>
        </div>
    )
    
}

export default PathfinderVisual
