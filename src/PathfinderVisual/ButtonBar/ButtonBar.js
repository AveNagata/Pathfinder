import React from 'react'
import { ButtonContainer } from './ButtonBarElements'

const ButtonBar = (props) => {
    const { genMaze, visualizeDijsktra, resetGrid } = props;
    return (
        <ButtonContainer>
            <button id="Generate" onClick={genMaze}>Generate Maze</button>
            <button id="Visualize" onClick={visualizeDijsktra}>Visualize Dizkstra</button>
            <button id="Reset" onClick={resetGrid}>Reset</button>
        </ButtonContainer>
    )
}

export default ButtonBar
