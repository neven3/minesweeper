export enum CellValue {
    none,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb
}

export enum CellState {
    open,
    flagged,
    visible
}

export interface Cell {
    value: CellValue;
    state: CellState;
}

export type CalculateBombs = (
    cells: Cell[][],
    rowIndex: number,
    colIndex: number,
    bombsAroundPreviousCol?: number,
    bombsAroundCurrentCol?: number,
) => void;
