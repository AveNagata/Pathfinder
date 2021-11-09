export function dijkstra(nodes) {

    let pathSoFar = [];
    let pathFound = false;

    for (let rows = 0; rows < nodes.length; rows++) {
        for (let cols = 0; cols < nodes[0].length; cols++) {
            nodes[rows][cols].isVisited = false;
            nodes[rows][cols].distance = 9999999999;
            if (nodes[rows][cols].isStart === true) {
                nodes[rows][cols].distance = 0;
                pathSoFar.push(nodes[rows][cols]);
                pathSoFar[0].distance = 0;
                
            }
        }
    }

    while (!pathFound) {
        for (let node = 0; node < pathSoFar.length; node++) {
            if (nodes[pathSoFar[node].row + 1][pathSoFar[node].col].isVisited === false && nodes[pathSoFar[node].row + 1][pathSoFar[node].col].isPassage === true) {
                nodes[pathSoFar[node].row + 1][pathSoFar[node].col].isVisited = true;
                pathSoFar.push(nodes[pathSoFar[node].row + 1][pathSoFar[node].col]);
                if (node === 0) {
                    pathSoFar[pathSoFar.length - 1].distance = 1
                }
                else {
                    pathSoFar[pathSoFar.length - 1].distance = pathSoFar[node].distance + 1;
                }
                if (pathSoFar[pathSoFar.length - 1].isFinish === true) {
                    pathFound = true;
                    break;
                }
            }
            if (nodes[pathSoFar[node].row - 1][pathSoFar[node].col].isVisited === false && nodes[pathSoFar[node].row - 1][pathSoFar[node].col].isPassage === true) {
                nodes[pathSoFar[node].row - 1][pathSoFar[node].col].isVisited= true;
                pathSoFar.push(nodes[pathSoFar[node].row - 1][pathSoFar[node].col]);
                if (node === 0) {
                    pathSoFar[pathSoFar.length - 1].distance = 1
                }
                else {
                    pathSoFar[pathSoFar.length - 1].distance = pathSoFar[node].distance + 1;
                }
                if (pathSoFar[pathSoFar.length - 1].isFinish === true) {
                    pathFound = true;
                    break;
                }
            }
            if (nodes[pathSoFar[node].row][pathSoFar[node].col + 1].isVisited === false && nodes[pathSoFar[node].row][pathSoFar[node].col + 1].isPassage === true) {
                nodes[pathSoFar[node].row][pathSoFar[node].col + 1].isVisited = true;
                pathSoFar.push(nodes[pathSoFar[node].row][pathSoFar[node].col + 1]);
                if (node === 0) {
                    pathSoFar[pathSoFar.length - 1].distance = 1
                }
                else {
                    pathSoFar[pathSoFar.length - 1].distance = pathSoFar[node].distance + 1;
                }
                if (pathSoFar[pathSoFar.length - 1].isFinish === true) {
                    pathFound = true;
                    break;
                }
            }
            if (nodes[pathSoFar[node].row][pathSoFar[node].col - 1].isVisited === false && nodes[pathSoFar[node].row][pathSoFar[node].col - 1].isPassage === true) {
                nodes[pathSoFar[node].row][pathSoFar[node].col - 1].isVisited = true;
                pathSoFar.push(nodes[pathSoFar[node].row][pathSoFar[node].col - 1]);
                if (node === 0) {
                    pathSoFar[pathSoFar.length - 1].distance = 1
                }
                else {
                    pathSoFar[pathSoFar.length - 1].distance = pathSoFar[node].distance + 1;
                }
                if (pathSoFar[pathSoFar.length - 1].isFinish === true) {
                    pathFound = true;
                    break;
                }
            }
        }

    }

    for (let node = 0; node < pathSoFar.length; node++) {
        nodes[pathSoFar[node].row][pathSoFar[node].col].isPassage = false;
    }

    pathFound = false;
    let shortestPath = [];
    let neighbors = [];
    let shortestDist = pathSoFar[pathSoFar.length - 1].distance;
    let currNeighbor = pathSoFar[pathSoFar.length - 1];
    shortestPath.push(pathSoFar[pathSoFar.length - 1]);

    while(!pathFound) {
        neighbors.push(pathSoFar.find( (obj, idx) => (obj.row === currNeighbor.row + 1 && obj.col === currNeighbor.col)));
        neighbors.push(pathSoFar.find( (obj, idx) => (obj.row === currNeighbor.row - 1 && obj.col === currNeighbor.col)));
        neighbors.push(pathSoFar.find( (obj, idx) => (obj.row === currNeighbor.row && obj.col === currNeighbor.col + 1)));
        neighbors.push(pathSoFar.find( (obj, idx) => (obj.row === currNeighbor.row && obj.col === currNeighbor.col - 1)));

        for (let neighbor = 0; neighbor < neighbors.length; neighbor++) {
            let varType = typeof neighbors[neighbor];
            if (varType === 'object') {
                if (neighbors[neighbor].isStart === true) {
                    currNeighbor = neighbors[neighbor];
                    pathFound = true;
                    break;
                }
                if (neighbors[neighbor].distance < shortestDist) {
                    shortestDist = neighbors[neighbor].distance
                    currNeighbor = neighbors[neighbor];
                }
            }
        }

        shortestPath.push(currNeighbor);
        neighbors = [];
        
    }

    for (let node = 0; node < shortestPath.length; node++) {
        nodes[shortestPath[node].row][shortestPath[node].col].isPath = false;
        nodes[shortestPath[node].row][shortestPath[node].col].isPassage = false;
        nodes[shortestPath[node].row][shortestPath[node].col].isSolution = false;
    }
    
    return [pathSoFar, shortestPath];
}