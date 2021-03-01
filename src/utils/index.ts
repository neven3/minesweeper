import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from '../constants';
import { CellValue, CellState, Cell, CalculateBombs } from '../types';

export let cellsWithMines: (Cell[]) = [];

export const generateCells = () => {
    const cells: Cell[][] = [];
    cellsWithMines = [];

    // generating all cells
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open
            });
        }
    }

    //randomly place 10 bombs
    for (let i = 0; i < NO_OF_BOMBS; i++) {
        placeBombs(cells, MAX_ROWS, MAX_COLS);
    }

    calculateNumOfBombsAround(cells, 0, 0);

    return cells;
};

function placeBombs(cells: Cell[][], maxRows: number, maxCols: number): void {
    // generate a random row
    const randomRow = generateRandomNum(maxRows);
    // generate a random column
    const randomCol = generateRandomNum(maxCols);

    const cellHasBomb = cells[randomRow][randomCol].value === CellValue.bomb;

    if (!cellHasBomb) {
        cells[randomRow][randomCol].value = CellValue.bomb;
        cellsWithMines.push(cells[randomRow][randomCol]);
    } else {
        placeBombs(cells, maxRows, maxCols);
    }
}

function generateRandomNum(num: number): number {
    const random = Math.floor(Math.random() * num);

    return random;
}

const calculateNumOfBombsAround: CalculateBombs = (cells, rowIndex, colIndex, bombsFromPreviousCol, bombsFromCurrentCol) => {
    const finishedAllRows = rowIndex === cells.length;
    const finishedAllCols = colIndex === cells[rowIndex]?.length;

    if (finishedAllRows) {
        return;
    } else if (finishedAllCols) {
        return calculateNumOfBombsAround(cells, rowIndex + 1, 0);
    }

    const currentField = cells[rowIndex][colIndex];
    const isCurrentBomb = currentField.value === CellValue.bomb;

    if (isCurrentBomb) {
        calculateNumOfBombsAround(cells, rowIndex, colIndex + 1);
    } else {
        let bombsInPreviousCol: number;
        let bombsInCurrentCol: number;
        let bombsInNextCol: number;

        if (bombsFromPreviousCol == null || bombsFromCurrentCol == null) {
            bombsInPreviousCol = returnNumberOfBombsInArray(getFieldsInPrevCol(cells, rowIndex, colIndex));
            bombsInCurrentCol = returnNumberOfBombsInArray(getFieldsInCurrentCol(cells, rowIndex, colIndex));
        } else {
            bombsInPreviousCol = bombsFromPreviousCol;
            bombsInCurrentCol = bombsFromCurrentCol;
        }

        if (colIndex !== cells[rowIndex].length - 1) {
            bombsInNextCol = returnNumberOfBombsInArray(getFieldsInNextCol(cells, rowIndex, colIndex));
        } else {
            bombsInNextCol = 0;
        }

        const bombsAroundCurrentField = bombsInPreviousCol + bombsInCurrentCol + bombsInNextCol;
        cells[rowIndex][colIndex].value = bombsAroundCurrentField;

        calculateNumOfBombsAround(cells, rowIndex, colIndex + 1, bombsInCurrentCol, bombsInNextCol);
    }
}

function returnNumberOfBombsInArray(cells: ((Cell | undefined)[])): number {
    return cells.reduce((accNum: number, currCell): number => {
        return accNum + Number(currCell ? (currCell.value === CellValue.bomb) : 0);
    }, 0);
}

function getFieldsInPrevCol(cells: Cell[][], rowIndex: number, colIndex: number): Cell[] {
    return ([
        cells?.[rowIndex - 1]?.[colIndex - 1],
        cells?.[rowIndex]?.[colIndex - 1],
        cells?.[rowIndex + 1]?.[colIndex - 1]
    ]);
}

function getFieldsInCurrentCol(cells: Cell[][], rowIndex: number, colIndex: number): Cell[] {
    return ([
        cells?.[rowIndex - 1]?.[colIndex],
        cells?.[rowIndex + 1]?.[colIndex]
    ]);
}

function getFieldsInNextCol(cells: Cell[][], rowIndex: number, colIndex: number): Cell[] {
    return ([
        cells?.[rowIndex - 1]?.[colIndex + 1],
        cells?.[rowIndex]?.[colIndex + 1],
        cells?.[rowIndex + 1]?.[colIndex + 1]
    ]);
}

export function revealZeroMinesArea(
    cells: Cell[][],
    rowIndex: number,
    colIndex: number,
    isPreviousNearBombs: boolean,
): void {
    const cell = cells?.[rowIndex]?.[colIndex];

    if (!cell) {
        return;
    }

    const { value, state } = cell;

    if (state === CellState.visible || state === CellState.flagged) {
        return;
    }

    let isCurrentNearBombs = false;
    let shouldRevealSurrounding = false;

    if (isPreviousNearBombs) {
        if (value !== CellValue.none) {
            return;
        } else {
            shouldRevealSurrounding = true;
        }
    }

    if (value !== CellValue.none) {
        isCurrentNearBombs = true;
    }

    cell.state = CellState.visible;
    // call function with the field above the current field
    revealZeroMinesArea(cells, rowIndex - 1, colIndex, isCurrentNearBombs);
    // then call the function with the field just right to the current field
    revealZeroMinesArea(cells, rowIndex, colIndex + 1, isCurrentNearBombs);
    // then call the function with the field to the left of the current field
    revealZeroMinesArea(cells, rowIndex, colIndex - 1, isCurrentNearBombs);
    // then call the function with the field just below the current field
    revealZeroMinesArea(cells, rowIndex + 1, colIndex, isCurrentNearBombs);

    if (shouldRevealSurrounding) {
        [
            ...getFieldsInPrevCol(cells, rowIndex, colIndex),
            ...getFieldsInCurrentCol(cells, rowIndex, colIndex),
            ...getFieldsInNextCol(cells, rowIndex, colIndex)
        ].forEach((cell) => {
            if (cell) {
                cell.state = CellState.visible;
            }
        });
    }

    if (value === CellValue.none) {
        const cornerCoordinates = getCornerCoordinates(cells, rowIndex, colIndex);

        if (cornerCoordinates) {
            cornerCoordinates.forEach(([corRow, corCol]) => cells[corRow][corCol].state = CellState.visible);
        }
    }
}

function getCornerCoordinates(cells: Cell[][], rowIndex: number, colIndex: number): ([number, number][] | null) {
    const upperIndex = rowIndex - 1;
    const lowerIndex = rowIndex + 1;
    const leftIndex = colIndex - 1;
    const rightIndex = colIndex + 1;

    const upperCell = cells?.[upperIndex]?.[colIndex];
    const lowerCell = cells?.[lowerIndex]?.[colIndex];
    const leftCell = cells?.[rowIndex]?.[leftIndex];
    const rightCell = cells?.[rowIndex]?.[rightIndex];

    const checkIfNumber = (cell: Cell): boolean => (
        cell?.state !== CellState.open
        && cell?.value !== CellValue.none
        && cell?.value !== CellValue.bomb
    );

    const items: [number, number][] = [];

    if (upperCell && rightCell && checkIfCellsMatchValue([upperCell, rightCell], checkIfNumber)) {
        items.push([upperIndex, rightIndex]);
    }

    if (upperCell && leftCell && checkIfCellsMatchValue([upperCell, leftCell], checkIfNumber)) {
        items.push([upperIndex, leftIndex]);
    }

    if (lowerCell && rightCell && checkIfCellsMatchValue([lowerCell, rightCell], checkIfNumber)) {
        items.push([lowerIndex, rightIndex]);
    }

    if (lowerCell && leftCell && checkIfCellsMatchValue([lowerCell, leftCell], checkIfNumber)) {
        items.push([lowerIndex, leftIndex]);
    }

    return items.length ? items : null;
}

function checkIfCellsMatchValue(cells: [Cell, Cell], cb: Function) {
    return cells.reduce((accBool, currCell) => {
        return accBool && cb(currCell);
    }, true);
}