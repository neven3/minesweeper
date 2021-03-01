import React, { MouseEvent } from 'react';
import { CellState, CellValue } from '../../types';
import './Button.scss';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    explosion?: boolean;
    onClick(event?: MouseEvent): void;
    handleRightClick(event?: MouseEvent): void;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value, explosion, onClick, handleRightClick }) => {
    return (
        <div
            className={`Button${state === CellState.visible ? " visible" : ""}${explosion ? " activated-mine" : ""} value-${value}`}
            onClick={onClick}
            onContextMenu={handleRightClick}
        >
            {renderCellContent(state, value)}
        </div>
    );
};

export default Button;

function renderCellContent(state: number, value: number): React.ReactNode {
    if (state === CellState.visible) {
        switch (value) {
            case CellValue.one:
                return (<span>1</span>);
            case CellValue.two:
                return (<span>2</span>);
            case CellValue.three:
                return (<span>3</span>);
            case CellValue.four:
                return (<span>4</span>);
            case CellValue.five:
                return (<span>5</span>);
            case CellValue.six:
                return (<span>6</span>);
            case CellValue.seven:
                return (<span>7</span>);
            case CellValue.eight:
                return (<span>8</span>);
            case CellValue.bomb:
                return (<span role="img" aria-label="bomb">💣</span>);
            default:
                return (<span></span>);
        }
    } else if (state === CellState.flagged) {
        return (<span role="img" aria-label="flag">🏴‍☠️</span>);
    }
}