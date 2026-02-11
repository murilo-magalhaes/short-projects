'use client';

import {CSSProperties, useEffect, useState} from "react";
import './styles.css'
import {underline} from "next/dist/lib/picocolors";
import {InputSwitch} from "primereact/inputswitch";

enum ESymbol {
    X = 'X',
    O = 'O'
}

interface Cell {
    id: number;
    symbol?: ESymbol
}

interface Game {
    id: number;
    winner?: ESymbol;
    mark: number
    cells: Cell[];
}

const possibleVictories = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
]

export default function Tictactoe() {
    const [currentGame, setCurrentGame] = useState(0);
    const [turn, setTurn] = useState<ESymbol>(ESymbol.X);
    const [winner, setWinner] = useState<ESymbol | undefined>(undefined);
    const [mark, setMark] = useState<number>(0);

    const [showInnerGames, setShowInnerGames] = useState<boolean>(false);

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const games: Game[] = [];
        for (let i = 1; i <= 9; i++) {
            games.push({
                id: i,
                winner: undefined,
                mark: 0,
                cells: Array.from({length: 9}).map((cell, index) => ({
                    id: index + 1,
                    symbol: undefined,
                })),
            })
        }

        setGames(games);
    }, [])

    useEffect(() => {
        checkMainVictory()
        games.forEach(game => {
            if (game.mark > 0) console.log(game.id, game.mark);
        })
    }, [games]);

    const renderSymbol = (gameId: number, cellId: number) => {
        const symbol = games[gameId - 1]?.cells[cellId - 1]?.symbol;
        if (symbol)
            return <span className={symbol}>{symbol}</span>
    }

    const drawMark = (mark: number): CSSProperties | undefined => {
        if (!mark) return;

        console.log({mark})
        let style = {}
        if (mark <= 3) {
            style = {
                top: `${25 + ((mark - 1) * 55)}px`,
            }
        } else if (mark <= 6) {
            style = {
                transform: 'rotate(90deg)',
                top: '80px',
                left: `${-55 + ((mark - 4) * 55)}px`,
            }
        } else {
            style = {
                transform: `rotate(${mark === 7 ? 45 : -45}deg) scale(1.3)`,
                top: '80px',
            }
        }
        console.log(style)
        return style
    }

    const renderGame = (gameId: number) => {
        const game = games[gameId - 1];

        return <div className={'game grid w-full relative'}>
                {game?.winner && <>
                    <span
                        className={`bigsymbol outlined ${game?.winner}`}>{game?.winner}</span>
                </>}
                {!(game?.winner && !showInnerGames) && <>
                {game?.winner && <div className={`mark ${game?.winner}`}
                                     style={drawMark(game.mark)}
                ></div>}
                    {
                        Array.from({length: 9}).map((_, i) => (
                            <div key={`cell_${i}`} className={'cell col-4 md:text-4xl'} style={{
                                borderRight: [0, 1, 3, 4, 6, 7].includes(i) ? `2px solid black` : 'none',
                                borderBottom: i < 6 ? `2px solid black` : 'none'
                            }} onClick={() => handleClickCell(gameId, i + 1)}>{renderSymbol(gameId, i + 1)}</div>
                        ))
                 }
                 </>
                }
        </div>

    }

    const checkVictory = (game: Game) => {
        let victoryIndex = 0;
        possibleVictories.forEach((victory, index) => {
            if (game.cells[victory[0] - 1].symbol
                && game.cells[victory[0] - 1].symbol === game.cells[victory[1] - 1].symbol
                && game.cells[victory[0] - 1].symbol === game.cells[victory[2] - 1].symbol) {
                victoryIndex = index + 1;
            }
            ;
        })

        return victoryIndex
    }

    const checkMainVictory = () => {
        possibleVictories.forEach((victory, index) => {
            if (games[victory[0] - 1]?.winner
                && games[victory[0] - 1]?.winner === games[victory[1] - 1]?.winner
                && games[victory[0] - 1]?.winner === games[victory[2] - 1]?.winner) {
                setWinner(games[victory[0] - 1]?.winner);
                setMark(index + 1)
            }
        })
    }

    const handleClickCell = (gameId: number, cellId: number) => {
        if (currentGame !== 0 && currentGame !== gameId) return;
        if (games[gameId - 1].cells[cellId - 1].symbol) return;
        if (games[gameId - 1].winner) return;
        if (winner) return;

        let selectedGame = {} as Game;
        setGames(prev =>
            prev.map((game) => {
                if (game.id === gameId) {
                    selectedGame = {
                        ...game,
                        cells: game.cells.map((cell) => {
                            if (cell.id === cellId) {
                                return {
                                    ...cell,
                                    symbol: turn
                                };
                            } else {
                                return cell;
                            }
                        }),
                    }

                    const victoryIndex = checkVictory(selectedGame)
                    if (victoryIndex > 0) {
                        selectedGame.winner = turn
                        selectedGame.mark = victoryIndex
                    }
                    return selectedGame;
                } else {
                    return game;
                }
            }),
        );

        setTurn(prev => prev === ESymbol.X ? ESymbol.O : ESymbol.X);
        setCurrentGame(games[cellId - 1]?.winner ? 0 : cellId)

    }


    return (
        <div className={'md:px-8 px-3 w-full flex flex-column justify-content-start align-items-center'}>
            <h1 className={'text-center'}>Jogo da Velha 2</h1>
            <div className={'flex w-6 justify-content-between align-items-center'}>
                <h2>Vez de <span className={turn}>{turn}</span></h2>
                <div className={'flex align-items-center gap-2'}>
                    <label htmlFor={'showInnerGames'}>Exibir jogos vencidos</label>
                    <InputSwitch id={'showInnerGames'} checked={showInnerGames}
                                 onChange={() => setShowInnerGames(!showInnerGames)}/>
                </div>
            </div>

            <div className={'biggame grid'}>
                {Array.from({length: 9}).map((_, i) => (
                    <div key={i}
                         className={`cell p-0 col-4 flex justify-content-center align-items-center p-3 ${(i + 1 === currentGame || (currentGame === 0 && !games[i]?.winner)) && !winner ? 'highlighted' : ''}`}
                         style={{
                             borderRight: [0, 1, 3, 4, 6, 7].includes(i) ? `4px solid black` : 'none',
                             borderBottom: i < 6 ? `4px solid black` : 'none',
                         }}>
                        {renderGame(i + 1)}
                    </div>
                ))}
            </div>
        </div>
    )
}