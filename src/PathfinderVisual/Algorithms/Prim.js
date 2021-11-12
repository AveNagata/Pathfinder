var neighborFound = false;

export function primGen(nodes) {

    generateWalls(nodes, 1);
    let startRowIdx = 0;
    let startColIdx = 0;
    while (startRowIdx < 3 || startRowIdx > nodes.length - 1) {
        startRowIdx = Math.floor(Math.random() * nodes.length);
    }
    while (startColIdx < 3 || startColIdx > nodes[0].length - 1) {
        startColIdx = Math.floor(Math.random() * nodes[startRowIdx].length);
    }
    
    nodes[startRowIdx][startColIdx].isVisited = true;
    nodes[startRowIdx][startColIdx].isPassage = true;
    nodes[startRowIdx][startColIdx].isWall = false;

    const neighbors = new Array;
    const passageNodes = new Array;

    passageNodes.push(nodes[startRowIdx][startColIdx])

    do {
        while (neighbors.length > 0) {
            neighbors.pop()
        }
        getVisitedNeighbors(nodes, neighbors, passageNodes);
    }
    while (neighborFound === true)

    findDeadEnds(nodes);
    var fg= 1;
}

function findDeadEnds(nodes) {
    let counter = 0;
    for (let numRows = 0; numRows < nodes.length; numRows++) {
        for (let numCols = 0; numCols < nodes[0].length; numCols++) {
            counter = 0;
            if (nodes[numRows][numCols].isPassage === true) {
                if (numRows + 1 < nodes.length && numRows - 1 > 0)
                {
                    if (numCols + 1 < nodes[0].length && numCols - 1 > 0) {
                        if (nodes[numRows + 1][numCols].isWall === true)
                            counter++
                        if (nodes[numRows - 1][numCols].isWall === true)
                            counter++
                        if (nodes[numRows][numCols + 1].isWall === true)
                            counter++
                        if (nodes[numRows][numCols - 1].isWall === true)
                            counter++
                    }
                    if (counter === 3) {
                        nodes[numRows][numCols].isDeadEnd = true;
                    }
                }
            }
        }
    }

}
function getVisitedNeighbors(nodes, neighbors, passageNodes) {

    let passageNodeLength = passageNodes.length;
    neighborFound = false;

    for (let randPassageNode = 0; randPassageNode < passageNodeLength; randPassageNode++) {
        if (passageNodes[randPassageNode].row + 1 < nodes.length) {
            if (nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col].isVisited === false && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col].isPassage === false)
            {
                if (nodes[passageNodes[randPassageNode].row + 2][passageNodes[randPassageNode].col].isVisited === false && nodes[passageNodes[randPassageNode].row + 2][passageNodes[randPassageNode].col].isPassage === false
                    && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col + 1].isVisited === false  && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col + 1].isPassage === false
                    && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col - 1].isVisited === false  && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col - 1].isPassage === false) {

                    neighbors.push(nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col])
                    neighborFound = true;

                }
            }
        }
        if (passageNodes[randPassageNode].row - 1 >= 0) {
            if (nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col].isVisited === false && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col].isPassage === false)
            {
                if (nodes[passageNodes[randPassageNode].row - 2][passageNodes[randPassageNode].col].isVisited === false && nodes[passageNodes[randPassageNode].row - 2][passageNodes[randPassageNode].col].isPassage === false
                    && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col + 1].isVisited === false  && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col + 1].isPassage === false
                    && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col - 1].isVisited === false  && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col - 1].isPassage === false) {

                    neighbors.push(nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col])
                    neighborFound = true;
                }
            }
        }
        if (passageNodes[randPassageNode].col + 1 < nodes[0].length) {
            if (nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col + 1].isVisited === false && nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col + 1].isPassage === false)
            {
                if (nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col + 2].isVisited === false && nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col + 2].isPassage === false
                    && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col + 1].isVisited === false  && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col + 1].isPassage === false
                    && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col + 1].isVisited === false  && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col + 1].isPassage === false) {

                    neighbors.push(nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col + 1])
                    neighborFound = true;
                }
            }
        }
        if (passageNodes[randPassageNode].col - 1 >= 0) {
            if (nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col - 1].isVisited === false && nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col - 1].isPassage === false)
            {
                if (nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col - 2].isVisited === false && nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col - 2].isPassage === false
                    && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col - 1].isVisited === false  && nodes[passageNodes[randPassageNode].row + 1][passageNodes[randPassageNode].col - 1].isPassage === false
                    && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col - 1].isVisited === false  && nodes[passageNodes[randPassageNode].row - 1][passageNodes[randPassageNode].col - 1].isPassage === false) {

                    neighbors.push(nodes[passageNodes[randPassageNode].row][passageNodes[randPassageNode].col - 1])
                    neighborFound = true;
                }
            }
        }
    }
    if (neighborFound === true)
        {
            const randNeighborIdx = Math.floor(Math.random() * neighbors.length);
            
            nodes[neighbors[randNeighborIdx].row][neighbors[randNeighborIdx].col].isPassage = true;
            nodes[neighbors[randNeighborIdx].row][neighbors[randNeighborIdx].col].isWall = false;
            nodes[neighbors[randNeighborIdx].row][neighbors[randNeighborIdx].col].isVisited = true;
            
            passageNodes.push(nodes[neighbors[randNeighborIdx].row][neighbors[randNeighborIdx].col]);
        }
}



export function generateWalls(nodes, single) {
    if (single == 0) {
        for (let rows = 0; rows < nodes.length; rows++) {
            for (let cols = 0; cols < nodes[0].length; cols++) {
                if (cols === 0 || rows === 0 || cols === 1 || rows === 1 || rows === nodes.length - 1 || cols === nodes[0].length - 1 || rows === nodes.length - 2 || cols === nodes[0].length - 2) {
                    nodes[rows][cols].isVisited = true;
                    nodes[rows][cols].isPassage= false;
                    nodes[rows][cols].isBorder = true;
                    nodes[rows][cols].isPath= false;
                    nodes[rows][cols].isWall = true;
                }
            }
        }
    }
    else {
        for (let rows = 0; rows < nodes.length; rows++) {
            for (let cols = 0; cols < nodes[0].length; cols++) {
                if (cols === 0 || rows === 0 || rows === nodes.length - 1 || cols === nodes[0].length - 1) {
                    nodes[rows][cols].isVisited = true;
                    nodes[rows][cols].isWall = true;
                }
            }
        }
    }
}