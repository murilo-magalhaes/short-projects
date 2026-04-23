'use client'
import {useEffect, useRef, useState} from "react";
import randomNumber from "@/utils/numbers/randomNumber";
import './styles.css'
import Image from "next/image";

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
        mountBoard()
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

    const getAdjacents = (board: ICell[][], cell: ICell, onlyEmpties: boolean = false, radius: number = 1) => {
        const adjacents: ICell[] = [];
        for (let i = Math.max(0, cell.x - radius); i <= Math.min(COLS - 1, cell.x + radius); i++) {
            for (let j = Math.max(0, cell.y - radius); j <= Math.min(ROWS - 1, cell.y + radius); j++) {
                const lookingCell = board[i][j];
                if (!onlyEmpties || (onlyEmpties && !lookingCell.isMine)) {
                    adjacents.push(lookingCell);
                }
            }
        }

        return adjacents
    }

    const generateMines = (clickedCell: ICell) => {
        const mines: [number, number][] = []

        const adjacents = getAdjacents(board, clickedCell, false, 2);
        const forbiddenCells = [...adjacents.map(cell => [cell.x, cell.y]), [clickedCell.x, clickedCell.y]]

        while (mines.length < 40) {
            const x = randomNumber(15, 0);
            const y = randomNumber(15, 0);

            const exists = mines.some(mine => mine[0] === x && mine[1] === y);
            if (!exists && !forbiddenCells.some(forbidden => forbidden[0] === x && forbidden[1] === y)) {
                mines.push([x, y]);
            }
        }

        mountBoard(mines)
    }

    const mountBoard = (mines?: [number, number][]) => {
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

        setBoard(board);
    }

    const lose = () => {
        playSoundEffect(ESoundEffect.MINE)
    }

    const revealCell = (cell: ICell) => {
        // 3. Criar uma cópia profunda para manipulação direta
        // Se o seu board for muito grande, considere uma cópia por linha
        const newBoard = [...board.map(row => [...row])];

        // 4. Função interna recursiva para modificar a cópia
        const revealRecursive = (x: number, y: number) => {
            const current = newBoard[x][y];

            if (current.isRevealed || current.isFlagged || current.isMine) return;

            // Revela a célula na cópia
            newBoard[x][y] = {...current, isRevealed: true};

            // 5. Só continua a recursão se a célula for vazia (0 minas ao redor)
            // Se cell.neighborCount > 0, paramos aqui (revelamos o número e não expandimos)
            if (current.adjacentMines === 0) {
                const adjacents = getAdjacents(newBoard, newBoard[x][y], true);
                adjacents.forEach((adj) => {
                    revealRecursive(adj.x, adj.y);
                });
            }
        };

        // Inicia a recursão na célula clicada
        revealRecursive(cell.x, cell.y);

        // 6. Atualiza o estado uma única vez
        setBoard(newBoard);

        playSoundEffect(clicksCount % 2 === 0 ? ESoundEffect.REVEAL1 : ESoundEffect.REVEAL2)
    };

    const onClickCell = (cell: ICell) => {
        if (cell.isRevealed || cell.isFlagged) return;
        if (cell.isMine) return lose();
        if (clicksCount === 0) {
            generateMines(cell)
        } else {
            revealCell(cell)
        }
        setClicksCount(prev => prev + 1)
    }

    const onRightClickCell = (cell: ICell) => {
        if (cell.isRevealed) return;
        board[cell.x][cell.y] = {
            ...cell,
            isFlagged: !cell.isFlagged,
        }
        setBoard([...board])

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
                <h1 className={'text-center'}>Campo minado</h1>
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
                        })
                        }
                    </div>
                ))}
            </div>
        </div>

    )
}