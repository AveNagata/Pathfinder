import React from 'react'
import './Node.css'

const Node = (props) => {
    const {isStart, isFinish, isWall, isPassage, isPath, isSolution, row, col, onMouseDown, onMouseUp} = props
    const objPoint = 
    isFinish ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall 
    ? "node-wall"
    : isPassage
    ? "node-passage"
    : isPath
    ? "node-path"
    : isSolution
    ? "node-solution"
    : "";

    return (
        <div onMouseDown={() => onMouseDown(row, col)} onMouseUp={() => onMouseUp(row, col)} className={`node ${row}-${col} ${objPoint}`}>
            
        </div>
    )
}

export default Node
