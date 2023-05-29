class Node {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.gScore = Infinity; // cost from start node to this node
      this.fScore = Infinity; // gScore + estimated cost to end node
      this.isWall = false;
      this.isVisited = false;
      this.previousNode = null;
    }
  }
  
  const container = document.getElementById("grid-container");
  const rows = 20;
  const cols = 20;
  let startNode,endNode;
  let grid=[];

  
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      const node = new Node(row, col);
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      if (row===2 && col===2) {
        startNode = node;
        cell.style.backgroundColor = "#00ff00"; // Color for the start node
      } else if (row===7 && col===15) {
        endNode = node;
        cell.style.backgroundColor = "#ff0000"; // Color for the end node
      }else{
      cell.addEventListener("mousedown",()=> toggleWall(node, cell));
      }
      container.appendChild(cell);
      currentRow.push(node);
    }
    grid.push(currentRow);
  }

  
  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", startVisualization);
  
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", resetGrid);
  
  function toggleWall(node, cell) {
    node.isWall = !node.isWall;
    cell.style.backgroundColor = node.isWall ? "#000000" : "#fff";
  }
  
  async function startVisualization() {
    //resetGrid();
    const path = aStarSearch();
    visualizePath(path);
  }
  
  function resetGrid() {
    //startNode = null;
    //endNode = null;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const node = grid[row][col];
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        node.isWall = false;
        const cell = container.children[row * cols + col];
        if (row===2 && col===2 || row===7 && col===15) {
            continue;
        } 
        cell.style.backgroundColor = "#fff";
      }
    }
  }
  

  
 async function aStarSearch() {
    startNode.gScore = 0;
    startNode.fScore = calculateDistance(startNode, endNode);
  
    const openSet = [startNode];
  
    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fScore - b.fScore);
      const currentNode = openSet.shift();
  
      currentNode.isVisited = true;
  
      if (currentNode === endNode) {
        const cell = container.children[currentNode.row * cols + currentNode.col];
        cell.style.backgroundColor = "red";
        const path = reconstructPath(endNode);
        visualizePath(path);
        return path;
      }
  
      const neighbors = getNeighbors(currentNode);
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
  
        if (neighbor.isWall || neighbor.isVisited) {
          continue;
        }
  
        const tentativeGScore = currentNode.gScore + 1;
  
        if (tentativeGScore < neighbor.gScore) {
          neighbor.previousNode = currentNode;
          neighbor.gScore = tentativeGScore;
          neighbor.fScore = neighbor.gScore + calculateDistance(neighbor, endNode);
  
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
            neighbor.isInOpenSet = true;
            let neighborCell = container.children[neighbor.row * cols + neighbor.col];
            neighborCell.style.backgroundColor='lightblue'; 
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    // Path not found
    console.log = "Path not found!";
    resetGrid();
    return;
  }
  
  

  function calculateDistance(nodeA, nodeB) {
    const distanceX = Math.abs(nodeA.row - nodeB.row);
    const distanceY = Math.abs(nodeA.col - nodeB.col);
    return distanceX + distanceY;
  }
  
  function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
  
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors;
  }
  
  
  function reconstructPath(node) {
    const path = [];
    let current = node;
    while (current !== null) {
      path.unshift(current);
      current = current.previousNode;
    }
    return path;
  }
  

  function visualizePath(path) {
    for (let i = 1; i < path.length-1; i++) {
      const node = path[i];
      const cell = container.children[node.row * cols + node.col];
      setTimeout(() => {
        cell.style.backgroundColor = "#ffff00"; // Color for the path
      }, 50 * i); // Delay the highlighting of each cell by 50ms
    }

  }

  