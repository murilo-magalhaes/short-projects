'use client'
import {useEffect, useRef, useState} from "react";
import randomNumber from "@/utils/numbers/randomNumber";
import './styles.css'
import Image from "next/image";
import {Button} from "primereact/button";
import delay from "@/utils/delay";

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

enum ESoundEffect {
    ADD_FLAG = 'add-flag',
    REMOVE_FLAG = 'remove-flag',
    REVEAL1 = 'reveal1',
    REVEAL2 = 'reveal2',
    MINE = 'mine'
}

export default function Minesweeper() {
    const [board, setBoard] = useState<ICell[][]>([]);
    const [clicksCount, setClicksCount] = useState<number>(0)

    useEffect(() => {
        const board = mountBoard()
        setBoard(board)
    }, []);

    const playSoundEffect = (sound: ESoundEffect) => {
        const audio = new Audio(`/audio/${sound}.mp3`);
        audio.play().catch()
    }

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

    const checkAdjacentsAndModify = (board: ICell[][], cell: ICell, filter: (cell: ICell) => boolean, modifier: (cell: ICell) => ICell) => {
        const adjacents: ICell[] = getAdjacents(board, cell);

        adjacents.forEach((adjacent: ICell) => {
            if (filter(adjacent)) {
                board[adjacent.x][adjacent.y] = modifier(adjacent);
            }
        })
        return board;
    }

    const getAdjacents = (board: ICell[][], cell: ICell, radius: number = 1) => {
        const adjacents: ICell[] = [];
        for (let i = Math.max(0, cell.x - radius); i <= Math.min(COLS - 1, cell.x + radius); i++) {
            for (let j = Math.max(0, cell.y - radius); j <= Math.min(ROWS - 1, cell.y + radius); j++) {
                    adjacents.push(board[i][j]);
            }
        }

        return adjacents
    }

    const generateMines = (clickedCell: ICell): ICell[][] => {
        const mines: [number, number][] = []

        const adjacents = getAdjacents(board, clickedCell, 2);
        const forbiddenCells = [...adjacents.map(cell => [cell.x, cell.y]), [clickedCell.x, clickedCell.y]]

        while (mines.length < 40) {
            const x = randomNumber(15, 0);
            const y = randomNumber(15, 0);

            const exists = mines.some(mine => mine[0] === x && mine[1] === y);
            if (!exists && !forbiddenCells.some(forbidden => forbidden[0] === x && forbidden[1] === y)) {
                mines.push([x, y]);
            }
        }

        return mountBoard(mines);

    }

    const mountBoard = (mines?: [number, number][]): ICell[][] => {
        let board: ICell[][] = [];
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (!board[i]) board[i] = []
                const isMine = mines && mines.some(mine => mine[0] === i && mine[1] === j);
                board[i][j] = {
                    x: i,
                    y: j,
                    isMine,
                    isFlagged: false,
                    isRevealed: false,
                    adjacentMines: 0,
                } as ICell
            }
        }

        const minedCells = board.flat().filter(isMine);
        minedCells.forEach(cell => {
            board = checkAdjacentsAndModify(board, cell, noFilter, incrementAdjacentsMines)
        })

        return board
    }

    const lose = () => {
        playSoundEffect(ESoundEffect.MINE)
    }

    const revealCell = (cell: ICell, board: ICell[][], recursive: boolean = true): ICell[][] => {
        const newBoard = [...board];
        const revealRecursive = (x: number, y: number) => {
            const current = newBoard[x][y];

            if (current.isRevealed || current.isFlagged || current.isMine) return;

            newBoard[x][y] = {...current, isRevealed: true};

            if (current.adjacentMines === 0) {
                const adjacents = getAdjacents(newBoard, newBoard[x][y]).filter(adj => !adj.isMine);
                adjacents.forEach((adj) => {
                    revealRecursive(adj.x, adj.y);
                });
            }
        };

        if (recursive) {
            revealRecursive(cell.x, cell.y);
        } else {
            // ✅ When not recursive, reveal only the single cell passed
            const current = newBoard[cell.x][cell.y];
            if (!current.isRevealed && !current.isFlagged && !current.isMine) {
                newBoard[cell.x][cell.y] = {...current, isRevealed: true};
            }
        }

        playSoundEffect(clicksCount % 2 === 0 ? ESoundEffect.REVEAL1 : ESoundEffect.REVEAL2)
        return newBoard
    };

    const onClickCell = (cell: ICell) => {
        let _board: ICell[][] = board;

        if (cell.isRevealed && cell.adjacentMines > 0) {
            const adjacents = getAdjacents(_board, cell).filter(
                adj => !adj.isFlagged && !adj.isRevealed
            );

            // ✅ If any adjacent (not flagged) is a mine, lose immediately
            if (adjacents.some(adj => adj.isMine)) {
                lose();
                return;
            }

            adjacents.forEach((adj) => {
                _board = revealCell(adj, _board, false);
            });

        } else {
            if (cell.isRevealed || cell.isFlagged) return;
            if (cell.isMine) return lose();
            if (clicksCount === 0) {
                _board = generateMines(cell);
            }
            _board = revealCell(cell, _board);
        }

        setBoard(_board);
        setClicksCount(prev => prev + 1);
    }

    const onRightClickCell = (cell: ICell) => {
        if (cell.isRevealed) return;
        const newBoard = [...board];
        newBoard[cell.x][cell.y] = {
            ...cell,
            isFlagged: !cell.isFlagged,
        }
        setBoard(newBoard)

        playSoundEffect(cell.isFlagged ? ESoundEffect.REMOVE_FLAG : ESoundEffect.ADD_FLAG)
    }

    const colors = ['blue', 'green', 'red']

    const buildCellClasses = (cell: ICell): string => {
        const classes = ['cell'];

        classes.push(cell.x % 2 === cell.y % 2 ? 'dark' : 'light');
        classes.push(cell.isRevealed ? 'revealed' : 'unrevealed')

        return classes.join(' ');
    }

    return (
        <div className={'w-full flex justify-content-center'}>
            <div>
                <h1 className={'text-center m-0'}>Campo minado</h1>
                <div className={'p-2 flex justify-content-between'}>
                    <div className={'flex align-items-center'}>
                        <Image src={'/assets/flag.png'} width={50} height={30} alt={'Flag'}/>
                        <span className={'font-bold text-xl text-white'}>{40 - board.flat().filter(cell => cell.isFlagged).length}</span>
                    </div>
                    <Button label={'Reiniciar'} onClick={() => window.location.reload()}/>
                </div>
                {board.length > 0 && Array.from({length: ROWS}).map((_, i) => (
                    <div key={i} className={'flex'}>
                        {Array.from({length: COLS}).map((_, j) => {
                            const cell = board[i][j]
                            return (
                                <div
                                    key={j}
                                    className={buildCellClasses(cell)}
                                    onClick={() => onClickCell(cell)}
                                    onContextMenu={e => {
                                        e.preventDefault();
                                        onRightClickCell(cell);
                                    }}
                                >
                                    {cell.adjacentMines > 0 && cell.isRevealed &&
                                        <span style={{
                                            color: colors[cell.adjacentMines - 1] || 'black'
                                        }}>{cell.adjacentMines}</span>}
                                    {cell.isFlagged &&
                                        <Image src={'/assets/flag.png'} width={45} height={30} alt={'Flag'}/>
                                    }
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
