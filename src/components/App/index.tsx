import React, { useState, Dispatch, MouseEvent, useEffect } from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells, revealZeroMinesArea, cellsWithMines } from '../../utils';
import Button from '../Button';
import { Cell, CellState, CellValue, Face } from '../../types';
import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from '../../constants';

const newCells = generateCells();

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(newCells);
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [numOfFlags, setNumOfFlags] = useState<number>(NO_OF_BOMBS);
    const [hasWon, setHasWon] = useState<boolean>(false);

    useEffect(() => {
        if (isGameActive && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return (() => clearInterval(timer));
        }
    }, [isGameActive, time]);

    useEffect(() => {
        if (hasWon) {
            setIsGameActive(false);
            setFace(Face.won);
        }
    }, [hasWon]);

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={numOfFlags} />
                <div
                    className="Face"
                    onClick={() => handleFaceClick(setFace, setTime, setIsGameActive, setCells, setNumOfFlags, setHasWon)}
                >
                    {face}
                </div>
                <NumberDisplay value={time} />
            </div>
            <div
                className="Body"
                onMouseDown={() => face === Face.smile && setFace(Face.onClick)}
                onMouseUp={() => face === Face.onClick && setFace(Face.smile)}
            >
                {renderCells(cells, setCells, isGameActive, setIsGameActive, numOfFlags, setNumOfFlags, face, setFace, setHasWon)}
            </div>
        </div>
    );
};

export default App;

function renderCells(
    cells: Cell[][],
    setCells: Dispatch<Cell[][]>,
    isGameActive: boolean,
    setIsGameActive: Dispatch<boolean>,
    numOfFlags: number,
    setNumOfFlags: Dispatch<number>,
    face: Face,
    setFace: Dispatch<Face>,
    setHasWon: Dispatch<boolean>
): React.ReactNode {
    const newCells = cells.slice();
    return newCells.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
            return (
                <Button
                    key={`${rowIndex}-${colIndex}`}
                    explosion={cell.explosion}
                    onClick={handleFieldClick(rowIndex, colIndex, newCells, setCells, isGameActive, setIsGameActive, face, setFace, setHasWon, numOfFlags, setNumOfFlags)}
                    handleRightClick={handleFieldRightClick(cell, newCells, setCells, numOfFlags, setNumOfFlags, face)}
                    state={cell.state}
                    value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                />
            );
        });
    });
}

function handleFieldClick(
    rowIndex: number,
    colIndex: number,
    cells: Cell[][],
    setCells: Dispatch<Cell[][]>,
    isGameActive: boolean,
    setIsGameActive: Dispatch<boolean>,
    face: Face,
    setFace: Dispatch<Face>,
    setHasWon: Dispatch<boolean>,
    numOfFlags: number,
    setNumOfFlags: Dispatch<number>
): (event?: MouseEvent) => void {
    return function (event?: MouseEvent): void {
        const cell = cells[rowIndex][colIndex];
        const newCells = cells.slice();

        if (!isGameActive && face === Face.smile) {
            setIsGameActive(true);
        }

        if (face === Face.smile) {
            if (cell.state === CellState.open) {
                if (cell.value === CellValue.none) {
                    revealZeroMinesArea(cells, rowIndex, colIndex, false);
                } else {
                    cell.state = CellState.visible;

                    if (cell.value === CellValue.bomb) {
                        cell.explosion = true;
                        setIsGameActive(false);
                        setFace(Face.lost);
                        cellsWithMines.forEach(cell => cell.state = CellState.visible)
                        setCells(newCells);
                        return;
                    }
                }

                let safeOpenCellsExit = false;

                const cellsWithMinesLeft: Cell[] = [];

                for (let row = 0; row < MAX_ROWS; row++) {
                    for (let col = 0; col < MAX_COLS; col++) {
                        const currentCell = newCells[row][col];

                        if (currentCell.state === CellState.open) {
                            if (currentCell.value === CellValue.bomb) {
                                cellsWithMinesLeft.push(currentCell);
                            } else {
                                safeOpenCellsExit = true;
                                break;
                            }
                        }
                    }
                }

                if (!safeOpenCellsExit) {
                    cellsWithMinesLeft.forEach(cell => {
                        cell.state = CellState.flagged;
                    });

                    setNumOfFlags(numOfFlags - cellsWithMinesLeft.length);
                    setHasWon(true);
                }

                setCells(newCells);
            }
        }
    };
}

function handleFaceClick(
    setFace: Dispatch<Face>,
    setTime: Dispatch<number>,
    setIsGameActive: Dispatch<boolean>,
    setCells: Dispatch<Cell[][]>,
    setNumOfFlags: Dispatch<number>,
    setHasWon: Dispatch<boolean>
): void {
    setFace(Face.smile);
    setHasWon(false);
    setTime(0);
    setIsGameActive(false);
    setCells(generateCells());
    setNumOfFlags(NO_OF_BOMBS);
}

function handleFieldRightClick(
    cell: Cell,
    cells: Cell[][],
    setCells: Dispatch<Cell[][]>,
    numOfFlags: number,
    setNumOfFlags: Dispatch<number>,
    face: Face
): (e?: MouseEvent) => void {
    return function (e?: MouseEvent): void {
        e?.preventDefault();
        const newCells = cells.slice();

        if (numOfFlags > 0 && face === Face.smile) {
            if (cell.state === CellState.open) {
                cell.state = CellState.flagged;
                setNumOfFlags(numOfFlags - 1);
                setCells(newCells);
            } else if (cell.state === CellState.flagged) {
                cell.state = CellState.open;
                setNumOfFlags(numOfFlags + 1);
                setCells(newCells);
            }
        }
    };
}