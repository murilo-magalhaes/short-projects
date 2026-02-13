'use client';

import {CSSProperties, useEffect, useRef, useState} from "react";
import '../styles.css'
import {InputSwitch} from "primereact/inputswitch";
import {io, Socket} from "socket.io-client";
import {redirect, useParams} from "next/navigation";

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

interface MessageData {
    op: string;
    id: string;
    data: any;
}

interface ErrorData {
    op: string;
    id: string;
    msg: string;
}

export default function Tictactoe() {

    const {id}: {id: string} = useParams();

    const [currentGame, setCurrentGame] = useState(0);
    const [turn, setTurn] = useState<ESymbol>(ESymbol.X);
    const [winner, setWinner] = useState<ESymbol | undefined>(undefined);
    const [mark, setMark] = useState<number>(0);

    const [showInnerGames, setShowInnerGames] = useState<boolean>(false);

    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<string[]>([]);

    // 1. Usamos um useRef para guardar a instância do socket sem causar re-renderizações
    const socketRef = useRef<Socket | null>(null);

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
        const username = localStorage.getItem('username');
        if (!username) {
            localStorage.setItem('tictactoe_id', id as string)
            redirect('/')
        }

        // 2. Conectamos ao backend separado (aquele do node-tests)
        socketRef.current = io('http://192.168.2.91:3001', {
            auth: {
                tictactoe_id: id,
            }
        });

        // 3. Ouvimos os eventos que o servidor envia
        socketRef.current.on('message', (msg: MessageData) => {
            console.log('Msg recebida', msg);
            handleMessage(msg)
        });

        socketRef.current.on('error', (msg: ErrorData) => {
            console.log('Erro recebido', msg);
            handleError(msg);
        })

        socketRef.current?.emit('message', {op: 'user.signed', id, data: {username}})

        // 4. LIMPEZA: Quando o usuário sair da página, desconectamos o socket
        return () => {
            socketRef.current?.disconnect();
        };

    }, []);

    const handleError = (msg: ErrorData) => {
        alert(msg.msg);
        if (msg.op === 'user.signed') {
            redirect('/')
        }
    }

    const handleMessage = (msg: {op: string, data: any}) => {
        if (msg.op === 'players.update') {
           setPlayers(msg.data);
        }
    }

    const sendMessage = () => {
        // 5. Enviamos o evento para o servidor
        socketRef.current?.emit('message', { text: 'test' });
    };

    useEffect(() => {
        checkMainVictory()
    }, [games]);

    const renderSymbol = (gameId: number, cellId: number) => {
        const symbol = games[gameId - 1]?.cells[cellId - 1]?.symbol;
        if (symbol)
            return <span className={symbol}>{symbol}</span>
    }

    const drawMark = (mark: number, bigGame = false): CSSProperties | undefined => {
        if (!mark) return;

        let style = {}
        if (mark <= 3) {
            style = {
                top: `${(bigGame ? 80 : 25) + ((mark - 1) * (bigGame ? 200 : 55))}px`,
            }
        } else if (mark <= 6) {
            style = {
                transform: 'rotate(90deg)',
                top: bigGame ? '280px' : '80px',
                left: `${(bigGame ? -200 : -55) + ((mark - 4) * (bigGame ? 200 : 55))}px`,
            }
        } else {
            style = {
                transform: `rotate(${mark === 7 ? 45 : -45}deg) scale(1.3)`,
                top: bigGame ? '285px' : '80px',
            }
        }
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
        const _games = games.map((game) => {
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
        })

        setGames(_games);
        setTurn(prev => prev === ESymbol.X ? ESymbol.O : ESymbol.X);
        setCurrentGame(games[cellId - 1]?.winner || (cellId === selectedGame.id && selectedGame.winner) ? 0 : cellId)

        sendMessage();

    }

    console.log({winner, mark})

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Código da sala copiado!')
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    };

    return (
        <div className={'md:px-8 px-3 w-full flex flex-column justify-content-start align-items-center'}>
            <h1 className={'text-center'}>Jogo da Velha 2</h1>
            <span>Código da sala: <strong className={'cursor-pointer'} onClick={() => copyToClipboard(id)}>{id} <i className={'pi pi-copy'}></i></strong></span>
            {players.length > 0 && <span>Jogadores: {players.join(', ')}</span>}
            <div className={'flex w-full md:w-6 justify-content-between align-items-center'}>
                <h2>Vez de <span className={turn}>{turn}</span></h2>
                <div className={'flex align-items-center gap-2'}>
                    <label htmlFor={'showInnerGames'}>Exibir jogos vencidos</label>
                    <InputSwitch id={'showInnerGames'} checked={showInnerGames}
                                 onChange={() => setShowInnerGames(!showInnerGames)}/>
                </div>
            </div>

            <div className={'relative'}>
                {winner && <div className={`mark ${winner}`}
                                style={drawMark(mark, true)}
                ></div>}

                <div className={'biggame grid'}>
                    {Array.from({length: 9}).map((_, i) => (
                        <div key={i}
                             className={`cell p-0 col-4 flex justify-content-center align-items-center p-3 ${(i + 1 === currentGame || (currentGame === 0 && !games[i]?.winner)) && !winner ? `highlighted_${turn}` : ''}`}
                             style={{
                                 borderRight: [0, 1, 3, 4, 6, 7].includes(i) ? `4px solid black` : 'none',
                                 borderBottom: i < 6 ? `4px solid black` : 'none',
                             }}>
                            {renderGame(i + 1)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
