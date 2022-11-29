let mazeSet = [];
let width;
let height;

const find = (arr, x) => {
	console.log(x);
	if (arr[x] < 0) {
		return x;
	}
	else {
		return find(arr, arr[x]);
	}
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

	mazeSet = new Array(width * height).fill(-1);
	while (true) {
		let rootCounter = 0
		for (let i = 0; i < mazeSet.length; i++) {
			if (mazeSet[i] === -1) { rootCounter++; }
			if (rootCounter > 1) { break; }
		}
		if (rootCounter === 1) { break; }

		const curCellInd = Math.floor(Math.random() * (mazeSet.length - 1)) + 1; // random number from 1 to (length - 1)
		const destroyWall = Math.floor(Math.random() * 4)
		switch (destroyWall) {
			case 0: { // top wall
				if (curCellInd < width) { break; }
				const partnerCellInd = curCellInd - width;
				console.log(mazeSet + " top");
				if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { break; }
				mazeSet[curCellInd] = partnerCellInd;
				const curCell = document.getElementById("cell-" + curCellInd);
				curCell.style.borderTop = "none";
				const partnerCell = document.getElementById("cell-" + partnerCellInd);
				partnerCell.style.borderBottom = "none";
				break;
			}
			case 1: {// right wall
				if (curCellInd % width === width - 1) { break; }
				const partnerCellInd = curCellInd + 1;
				console.log(mazeSet + " right");
				if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { break; }
				mazeSet[curCellInd] = partnerCellInd;
				const curCell = document.getElementById("cell-" + curCellInd);
				curCell.style.borderRight = "none";
				const partnerCell = document.getElementById("cell-" + partnerCellInd);
				partnerCell.style.borderLeft = "none";
				break;
			}
			case 2: { // bottom wall
				if (curCellInd >= mazeSet.length - width) { break; }
				const partnerCellInd = curCellInd + width;
				console.log(mazeSet + " bottom");
				if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { break; }
				mazeSet[curCellInd] = partnerCellInd;
				const curCell = document.getElementById("cell-" + curCellInd);
				curCell.style.borderBottom = "none";
				const partnerCell = document.getElementById("cell-" + partnerCellInd);
				partnerCell.style.borderTop = "none";
				break;
			}
			case 3: { // left wall
				if (curCellInd % width === 0) { break; }
				const partnerCellInd = curCellInd - 1;
				console.log(mazeSet + " left");
				if (find(mazeSet, curCellInd) === find(mazeSet, partnerCellInd)) { break; }
				mazeSet[curCellInd] = partnerCellInd;
				const curCell = document.getElementById("cell-" + curCellInd);
				curCell.style.borderLeft = "none";
				const partnerCell = document.getElementById("cell-" + partnerCellInd);
				partnerCell.style.borderRight = "none";
				break;
			}
		}
	}
	document.getElementById("solve-maze").hidden = false;
}

const solveMaze = () => {
	document.getElementById("solve-maze").hidden = true;
	let curCellInd = mazeSet.length - 1;
	let path = "";
	// build the path from bottom to top, then reverse it
	while (curCellInd > 0) {
		document.getElementById("cell-" + curCellInd).style.backgroundColor = "#000";
		if (mazeSet[curCellInd] === curCellInd - width) {
			path += "S";
		}
		else if (mazeSet[curCellInd] === curCellInd - 1) {
			path += "E";
		}
		else if (mazeSet[curCellInd] === curCellInd + width) {
			path += "N";
		}
		else if (mazeSet[curCellInd] === curCellInd + 1) {
			path += "W";
		}
		curCellInd = mazeSet[curCellInd];
	}
	document.getElementById("cell-0").style.backgroundColor = "#000";
	path = path.split("").reverse().join("");
	const solution = document.getElementById("maze-solution");
	solution.innerText = path;
	solution.hidden = false;
}