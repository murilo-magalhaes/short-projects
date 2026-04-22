'use client'
import {useEffect, useState} from "react";
import randomNumber from "@/utils/numbers/randomNumber";
import './styles.css'

interface ICell {
    x: number;
    y: number;
    isMine: boolean;
    isFlagged: boolean;
    isRevealed: boolean;
    adjacentMines: number;
}

const ROWS = 16;
const COLS = 16;

export default function Minesweeper() {

    const [board, setBoard] = useState<ICell[]>([]);

    useEffect(() => {
        mountBoard()
    }, []);

    const isMine = (cell: ICell): boolean => {
        return cell.isMine;
    }

    const noFilter = () => true;

    const incrementAdjacentsMines = (cell: ICell): ICell => {
        return {
            ...cell,
            adjacentMines: cell.adjacentMines + 1,
        }
    }

    const checkAdjacentsAndModify = (board: ICell[], cell: ICell, filter: (cell: ICell) => boolean, modifier: (cell: ICell) => ICell) => {
        for(let i = Math.max(0, cell.x - 1); i <= Math.min(COLS - 1, cell.x + 1); i) {
            for(let j = Math.max(0, cell.y - 1); j <= Math.min(ROWS - 1, cell.y + 1); j++) {
                const lookingCell = board.find(c => c.x === i && c.y === j);
                if(lookingCell && filter(lookingCell)) {
                    const newCell = modifier(lookingCell);
                    const index = board.indexOf(lookingCell);
                    board[index] = newCell;
                }
            }
        }
        return board;
    }

    const mountBoard = () => {
        const mines: [number, number][] = []

        while (mines.length < 40) {
            const x = randomNumber(15, 0 );
            const y = randomNumber(15, 0 );

            const exists = mines.some(mine => mine[0] === x && mine[1] === y);
            if (!exists) {
                mines.push([x, y]);
            }

        }

        let board: ICell[] = [];
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                const isMined = mines.some(mine => mine[0] === i && mine[1] === j);

                board.push({
                    x: i,
                    y: j,
                    isMine: isMined,
                    isFlagged: false,
                    isRevealed: false,
                    adjacentMines: 0,
                })
            }
        }

        const minedCells = board.filter(c => c.isMine);
        minedCells.forEach(cell => {
            board = checkAdjacentsAndModify(board, cell, noFilter, incrementAdjacentsMines)
        })

        setBoard(board);
    }

    return (
        <div className={'w-full flex justify-content-center'}>
            <div>

            <h1 className={'text-center'}>Campo minado</h1>
            {Array.from({length: ROWS}).map((_, i) => (
                <div key={i} className={'flex'}>
                    {Array.from({length: COLS}).map((_, j) => (
                        <div key={j} className={`cell ${i % 2 === j % 2 ? 'dark' : 'light'}`}></div>
                    ))}
                        </div>
            ))}
            </div>
        </div>

    )
}