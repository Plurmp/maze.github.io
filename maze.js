let mazeSet = [];
let width;
let height;

const find = (arr, x) => {
	if (arr[x][0] < 0) {
		return x;
	}
	else {
		return find(arr, arr[x][0]);
	}
}

const union = (a, b) => {
	const aParent = find(mazeSet, a);
	const bParent = find(mazeSet, b);
	if (aParent === bParent) { return; }
	let aParentCell = mazeSet[aParent]
	mazeSet[aParent] = [bParent, aParentCell[1]]
}

const generateMaze = () => {
	width = +document.getElementById("width-box").value;
	height = +document.getElementById("height-box").value;
	document.getElementById("generation-info").style.display = "none";

	let table = document.createElement("table");
	let tbody = document.createElement("tbody");

	for (let r = 0; r < height; r++) {
		let row = document.createElement("tr");
		for (let c = 0; c < width; c++) {
			let col = document.createElement("td");
			if (r === 0 && c === 0) {
				col.style.borderTop = "none";
				col.style.borderLeft = "none";
				col.setAttribute("type", "start");
			}
			else if (r === height - 1 && c === width - 1) {
				col.style.borderRight = "none";
				col.style.borderBottom = "none";
				col.setAttribute("type", "finish");
			}
			else {
				col.style.backgroundColor = "#FFF";
			}
			col.setAttribute("id", "cell-" + ((r * width) + c))
			row.appendChild(col);
		}
		tbody.appendChild(row);
	}
	table.appendChild(tbody);
	document.getElementById("maze-container").appendChild(table);

	mazeSet = Array.from({length: width * height}, () => [-1, new Set()]);
	while (find(mazeSet, 0) !== find(mazeSet, mazeSet.length - 1)) {
		const curCellInd = Math.floor(Math.random() * (mazeSet.length - 1)) + 1; // random number from 1 to (length - 1)
		const destroyWall = Math.floor(Math.random() * 4)
		if (destroyWall === 0) { // top wall
			if (curCellInd < width) { continue; }
			const partnerCellInd = curCellInd - width;
			if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { continue; }
			union(curCellInd, partnerCellInd);
			const curCell = document.getElementById("cell-" + curCellInd);
			curCell.style.borderTop = "none";
			const partnerCell = document.getElementById("cell-" + partnerCellInd);
			partnerCell.style.borderBottom = "none";

			mazeSet[curCellInd][1].add(partnerCellInd);
			mazeSet[partnerCellInd][1].add(curCellInd);

		}
		else if (destroyWall === 1) {// right wall
			if (curCellInd % width === width - 1) { continue; }
			const partnerCellInd = curCellInd + 1;
			if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { continue; }
			union(curCellInd, partnerCellInd);
			const curCell = document.getElementById("cell-" + curCellInd);
			curCell.style.borderRight = "none";
			const partnerCell = document.getElementById("cell-" + partnerCellInd);
			partnerCell.style.borderLeft = "none";

			mazeSet[curCellInd][1].add(partnerCellInd);
			mazeSet[partnerCellInd][1].add(curCellInd);
		}
		else if (destroyWall === 2) { // bottom wall
			if (curCellInd >= mazeSet.length - width) { continue; }
			const partnerCellInd = curCellInd + width;
			if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { continue; }
			union(curCellInd, partnerCellInd);
			const curCell = document.getElementById("cell-" + curCellInd);
			curCell.style.borderBottom = "none";
			const partnerCell = document.getElementById("cell-" + partnerCellInd);
			partnerCell.style.borderTop = "none";

			mazeSet[curCellInd][1].add(partnerCellInd);
			mazeSet[partnerCellInd][1].add(curCellInd);
		}
		else if (destroyWall === 3) { // left wall
			if (curCellInd % width === 0) { continue; }
			const partnerCellInd = curCellInd - 1;
			if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { continue; }
			union(curCellInd, partnerCellInd);
			const curCell = document.getElementById("cell-" + curCellInd);
			curCell.style.borderLeft = "none";
			const partnerCell = document.getElementById("cell-" + partnerCellInd);
			partnerCell.style.borderRight = "none";

			mazeSet[curCellInd][1].add(partnerCellInd);
			mazeSet[partnerCellInd][1].add(curCellInd);
		}
	}
	document.getElementById("solve-maze").hidden = false;
}

const search = () => { // depth-first search
	let stack = [[0, [0]]];
	let visited = new Array(width * height).fill(false);
	while (stack.length > 0) {
		const [curNode, path] = stack.pop();
		if (!visited[curNode]){
			if (curNode === width * height - 1) return path;
			visited[curNode] = true;
			for (let i of mazeSet[curNode][1]) {
				stack.push([i, path.concat([i])]);
			}
		}
	}
}

const colorPath = (cell) => {
	document.getElementById("cell-" + cell).style.backgroundColor = "#222";
}

const solveMaze = () => {
	document.getElementById("solve-maze").hidden = true;

	const finishedPath = search();
	console.log(finishedPath);

	let path = "";
	for (let i = 0; i < finishedPath.length; i++) {
		setTimeout(colorPath(finishedPath[i]), 100);
		if (finishedPath[i + 1] === finishedPath[i] - width) {
			path += "N";
		}
		else if (finishedPath[i + 1] === finishedPath[i] - 1) {
			path += "W";
		}
		else if (finishedPath[i + 1] === finishedPath[i] + width) {
			path += "S";
		}
		else if (finishedPath[i + 1] === finishedPath[i] + 1) {
			path += "E";
		}
	}
	const solution = document.getElementById("maze-solution");
	solution.innerText = path;
	solution.hidden = false;
}
