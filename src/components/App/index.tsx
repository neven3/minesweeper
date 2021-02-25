import React, { useState } from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells } from '../../utils';
import Button from '../Button';
import { Cell } from '../../types';

const App: React.FC = () => {
    const [cells, setCells] = useState(generateCells());

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={23} />
                <div className="Face">
                    🙂
                </div>
                <NumberDisplay value={0} />
            </div>
            <div className="Body">{renderCells(cells)}</div>
        </div>
    );
};

export default App;

function renderCells(cells: Cell[][]): React.ReactNode {
    return cells.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
            return (
                <Button
                    key={`${rowIndex}-${colIndex}`}
                    state={cell.state}
                    value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                />
            );
        });
    });
}