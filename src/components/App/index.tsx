import React, { useState, Dispatch, MouseEvent, useEffect } from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells } from '../../utils';
import Button from '../Button';
import { Cell, CellState, CellValue, Face } from '../../types';
import { NO_OF_BOMBS } from '../../constants';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [numOfFlags, setNumOfFlags] = useState<number>(NO_OF_BOMBS);

    useEffect(() => {
        if (isGameActive && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return (() => clearInterval(timer));
        }
    }, [isGameActive, time])

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={numOfFlags} />
                <div
                    className="Face"
                    onClick={() => handleFaceClick(setFace, setTime, setIsGameActive, setCells, setNumOfFlags)}
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
                {renderCells(cells, setCells, isGameActive, setIsGameActive, numOfFlags, setNumOfFlags, face, setFace)}
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
    setFace: Dispatch<Face>
): React.ReactNode {
    return cells.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
            return (
                <Button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={handleFieldClick(cell, cells, setCells, isGameActive, setIsGameActive, face, setFace)}
                    handleRightClick={handleFieldRightClick(cell, cells, setCells, numOfFlags, setNumOfFlags, face)}
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
    cell: Cell,
    cells: Cell[][],
    setCells: Dispatch<Cell[][]>,
    isGameActive: boolean,
    setIsGameActive: Dispatch<boolean>,
    face: Face,
    setFace: Dispatch<Face>
): (event?: MouseEvent) => void {
    return function (event?: MouseEvent): void {
        console.log(event?.target)
        if (!isGameActive && face === Face.smile) {
            setIsGameActive(true);
        } else if (face === Face.smile) {
            const newCells = cells.slice();

            console.log(newCells.some(row => row.includes(cell)));

            if (cell.state === CellState.open) {
                cell.state = CellState.visible;
                setCells(cells);
            }

            if (cell.value === CellValue.bomb) {
                setIsGameActive(false);
                setFace(Face.lost);

            }
        }
    };
}

function handleFaceClick(
    setFace: Dispatch<Face>,
    setTime: Dispatch<number>,
    setIsGameActive: Dispatch<boolean>,
    setCells: Dispatch<Cell[][]>,
    setNumOfFlags: Dispatch<number>
): void {
    setFace(Face.smile);
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

        if (numOfFlags > 0 && face === Face.smile) {
            if (cell.state === CellState.open) {
                cell.state = CellState.flagged;
                setNumOfFlags(numOfFlags - 1);
                setCells(cells);
            } else if (cell.state === CellState.flagged) {
                cell.state = CellState.open;
                setNumOfFlags(numOfFlags + 1);
                setCells(cells);
            }
        }
    }
}