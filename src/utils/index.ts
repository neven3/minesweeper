import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from '../constants';
import { CellValue, CellState, Cell, CalculateBombs } from '../types';

export const generateCells = () => {
    const cells: Cell[][] = [];

    // // number of bombs around one field that will affect the adjacent field
    // let bombsAffectingNext: number = 0;

    // generating all cells
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.visible
            });
        }
    }

    //randomly put 10 bombs
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
    debugger

    if (isCurrentBomb) {
        calculateNumOfBombsAround(cells, rowIndex, colIndex + 1);
    } else {
        let bombsInPreviousCol: number;
        let bombsInCurrentCol: number;
        let bombsInNextCol: number;

        if (bombsFromPreviousCol == null || bombsFromCurrentCol == null) {
            bombsInPreviousCol = getBombsInPrevCol(cells, rowIndex, colIndex);
            bombsInCurrentCol = getBombsInCurrentCol(cells, rowIndex, colIndex);
        } else {
            bombsInPreviousCol = bombsFromPreviousCol;
            bombsInCurrentCol = bombsFromCurrentCol;
        }

        if (colIndex !== cells[rowIndex].length - 1) {
            bombsInNextCol = getBombsInNextCol(cells, rowIndex, colIndex)
        } else {
            bombsInNextCol = 0;
        }

        const bombsAroundCurrentField = bombsInPreviousCol + bombsInCurrentCol + bombsInNextCol;
        cells[rowIndex][colIndex].value = bombsAroundCurrentField;

        calculateNumOfBombsAround(cells, rowIndex, colIndex + 1, bombsInCurrentCol, bombsInNextCol);
    }
    // } else if (isLastCol) {
    //     calculateNumOfBombsAround(cells, rowIndex + 1, 0, 0, 0);
    // } else if (colIndex === 0) {
    //     const currentFieldIsBomb = currentField.value === CellValue.bomb;

    //     const bombsInCurrentRow
    // }
    // check self, above, below, upperRight, lowerRight, right
    // if self is bomb
    // mark cell as bomb
    // if right is bomb
    // mark isNextBomb = true
    // add all of them together and mark the cell accordingly
    // move on to next with bombsAroundPrevious set to the number of bombs
    //  else if last in a row
    // if isCurrentBomb
    // mark cell as bomb
    // else
    // give cell number bombsAroundPrevious
    // move on with cells, (rowIndex + 1), colIndex set to 0, bombsAroundPrevious set to 0, isNextBomb
    // else
    // check upperRight, right, lowerRight
    // if right is bomb
    // mark isNextBomb = true
    // add them all together
    // mark them as bombsFromCurrentCol
    // add that plus bombsAroundPrevious
    // if isCurrentBomb
    // mark cell as bomb
    // else
    // mark cell as bombsAroundPrevious + ,
    // move on with cells, rowIndex, colIndex + 1, bombs
}

function returnNumberOfBombsInArray(...cells: ((Cell | undefined)[])): number {
    return cells.reduce((accNum: number, currCell): number => {
        return accNum + Number(currCell != null ? (currCell.value === CellValue.bomb) : 0);
    }, 0);
}

function getBombsInPrevCol(cells: Cell[][], rowIndex: number, colIndex: number): number {
    return returnNumberOfBombsInArray(
        cells?.[rowIndex - 1]?.[colIndex - 1],
        cells?.[rowIndex]?.[colIndex - 1],
        cells?.[rowIndex + 1]?.[colIndex - 1]
    );
}

function getBombsInCurrentCol(cells: Cell[][], rowIndex: number, colIndex: number): number {
    return returnNumberOfBombsInArray(
        cells?.[rowIndex - 1]?.[colIndex],
        cells?.[rowIndex + 1]?.[colIndex]
    );
}

function getBombsInNextCol(cells: Cell[][], rowIndex: number, colIndex: number): number {
    return returnNumberOfBombsInArray(
        cells?.[rowIndex - 1]?.[colIndex + 1],
        cells?.[rowIndex]?.[colIndex + 1],
        cells?.[rowIndex + 1]?.[colIndex + 1]
    );
}
