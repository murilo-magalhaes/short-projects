'use client'

import {useEffect, useState} from "react";
import './styles.css';
import {Button} from "primereact/button";
import {InputSwitch} from "primereact/inputswitch";
import {Dropdown} from "primereact/dropdown";

interface Coord {
    x: number;
    y: number;
}

interface Map {
    origin: Coord;
    target: Coord;
    obstacles: Coord[];
}

const maps: Map[] = [
    {
        origin: {x: 1, y: 9},
        target: {x: 18, y: 9},
        obstacles: [
            {x: 9, y: 9},
            {x: 9, y: 8},
            {x: 9, y: 10},
            {x: 8, y: 8},
        ]
    },
    {
        origin: {x: 0, y: 0},
        target: {x: 18, y: 19},
        obstacles: [
            {x: 3, y: 0},
            {x: 1, y: 1}, {x: 3, y: 1}, {x: 7, y: 1}, {x: 12, y: 1},
            {x: 1, y: 2}, {x: 5, y: 2}, {x: 7, y: 2}, {x: 10, y: 2}, {x: 14, y: 2}, {x: 16, y: 2},
            {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 5, y: 3}, {x: 9, y: 3}, {x: 10, y: 3}, {x: 14, y: 3}, {
                x: 18,
                y: 3
            },
            {x: 3, y: 4}, {x: 5, y: 4}, {x: 13, y: 4}, {x: 16, y: 4}, {x: 18, y: 4},
            {x: 1, y: 5}, {x: 3, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 9, y: 5}, {x: 11, y: 5}, {x: 14, y: 5}, {
                x: 16,
                y: 5
            },
            {x: 1, y: 6}, {x: 9, y: 6}, {x: 14, y: 6}, {x: 16, y: 6},
            {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 9, y: 7}, {x: 12, y: 7}, {
                x: 14,
                y: 7
            }, {x: 16, y: 7},
            {x: 9, y: 8}, {x: 12, y: 8}, {x: 16, y: 8},
            {x: 1, y: 9}, {x: 2, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}, {x: 6, y: 9}, {x: 9, y: 9}, {x: 16, y: 9},
            {x: 1, y: 10}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}, {x: 14, y: 10}, {x: 16, y: 10},
            {x: 1, y: 11}, {x: 2, y: 11}, {x: 3, y: 11}, {x: 4, y: 11}, {x: 6, y: 11}, {x: 14, y: 11}, {x: 18, y: 11},
            {x: 4, y: 12}, {x: 6, y: 12}, {x: 8, y: 12}, {x: 10, y: 12}, {x: 12, y: 12}, {x: 14, y: 12}, {x: 16, y: 12},
            {x: 1, y: 13}, {x: 2, y: 13}, {x: 4, y: 13}, {x: 9, y: 13}, {x: 14, y: 13}, {x: 16, y: 13},
            {x: 1, y: 14}, {x: 4, y: 14}, {x: 5, y: 14}, {x: 6, y: 14}, {x: 9, y: 14}, {x: 14, y: 14}, {x: 16, y: 14},
            {x: 1, y: 15}, {x: 3, y: 15}, {x: 9, y: 15}, {x: 11, y: 15}, {x: 14, y: 15}, {x: 16, y: 15},
            {x: 3, y: 16}, {x: 5, y: 16}, {x: 6, y: 16}, {x: 7, y: 16}, {x: 8, y: 16}, {x: 9, y: 16}, {x: 11, y: 16}, {
                x: 14,
                y: 16
            }, {x: 16, y: 16},
            {x: 1, y: 17}, {x: 11, y: 17}, {x: 14, y: 17}, {x: 16, y: 17},
            {x: 1, y: 18}, {x: 2, y: 18}, {x: 3, y: 18}, {x: 4, y: 18}, {x: 5, y: 18}, {x: 6, y: 18}, {x: 7, y: 18}, {
                x: 8,
                y: 18
            }, {x: 9, y: 18}, {x: 11, y: 18}, {x: 14, y: 18}, {x: 16, y: 18},
            {x: 11, y: 19}, {x: 14, y: 19}, {x: 16, y: 19}
        ]
    }
]


enum EDirection {
    UP = 'cima',
    DOWN = 'baixo',
    LEFT = 'esquerda',
    RIGHT = 'direita',
}

const moves: { [direction: string]: Coord } = {
    [EDirection.UP]: {x: 0, y: -1},
    [EDirection.DOWN]: {x: 0, y: 1},
    [EDirection.LEFT]: {x: -1, y: 0},
    [EDirection.RIGHT]: {x: 1, y: 0},
}

const DELAY = 100;

export default function BetterWay() {
    const [x, setX] = useState(20);
    const [y, setY] = useState(20);

    const [highlightedRow, setHighlightedRow] = useState(-1);
    const [highlightedColumn, setHighlightedColumn] = useState(-1);

    const [origin, setOrigin] = useState<Coord>(maps[0].origin);
    const [hoveredCoord, setHoveredCoord] = useState<Coord>({x: -1, y: -1});
    const [target, setTarget] = useState<Coord>(maps[0].target);
    const [obstacles, setObstacles] = useState<Coord[]>(maps[0].obstacles);

    const [direction, setDirection] = useState<EDirection | undefined>(undefined);
    const [verticalDeviating, setVerticalDeviating] = useState<EDirection | undefined>(undefined);
    const [horizontalDeviating, setHorizontalDeviating] = useState<EDirection | undefined>(undefined);
    const [pathPassed, setPathPassed] = useState<Coord[]>([]);

    const [isWalking, setIsWalking] = useState(false);
    const [isDeviating, setIsDeviating] = useState(false);
    const [isArrived, setIsArrived] = useState(false);
    const [isAddingObstacles, setIsAddingObstacles] = useState(false);

    const [map, setMap] = useState<number>(0);

    useEffect(() => {
        if (isWalking) {
            if (isSameCoord(origin, target)) {
                setIsWalking(false);
                setIsArrived(true)
            } else {
                walk()
            }
        }
    }, [origin, isWalking]);

    const isObstacle = (coord: Coord) =>
        obstacles.some(o => o.x === coord.x && o.y === coord.y);

    const isPathPassed = (coord: Coord) =>
        pathPassed.some(path => path.x === coord.x && path.y === coord.y);

    const isOrigin = (coord: Coord) =>
        origin.x === coord.x && origin.y === coord.y;

    const isTarget = (coord: Coord) =>
        target.x === coord.x && target.y === coord.y;

    const isWithinLimits = (coord: Coord) => coord.x >= 0 && coord.y >= 0 && coord.x < x && coord.y < y

    const identify = (coord: Coord): string => {
        const _isOrigin = isOrigin(coord);
        return isObstacle(coord) ? 'obstacle' :
            isArrived && _isOrigin ? 'arrived' :
                _isOrigin ? 'origin' :
                    isTarget(coord) ? 'target' :
                        isPathPassed(coord) ? 'path_passed' :
                            !isWithinLimits(coord) ? 'out_of_limits' :
                                'free';
    }

    const isSameCoord = (a: Coord, b: Coord) =>
        a.x === b.x && a.y === b.y;

    const getCoordAtDirection = (coord: Coord, dir: EDirection) =>
        ({x: coord.x + moves[dir].x, y: coord.y + moves[dir].y});

    const manualMove = (dir: EDirection) => {
        setOrigin(prev => {
            const next = getCoordAtDirection(prev, dir);
            if (['free', 'path_passed', 'target'].includes(identify(next))) {
                return next;
            }
            return prev;
        })
    }

    const handleChangeMap = (map: number) => {
        setMap(map)
        setOrigin(maps[map].origin)
        setTarget(maps[map].target);
        setObstacles(maps[map].obstacles);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    console.log('Movendo para', EDirection.UP)
                    manualMove(EDirection.UP)
                    break;
                case 'ArrowDown':
                    console.log('Movendo para', EDirection.DOWN)
                    manualMove(EDirection.DOWN)
                    break;
                case 'ArrowLeft':
                    console.log('Movendo para', EDirection.LEFT)
                    manualMove(EDirection.LEFT)
                    break;
                case 'ArrowRight':
                    console.log('Movendo para', EDirection.RIGHT)
                    manualMove(EDirection.RIGHT)
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const isFree = (coord: Coord) => ['free', 'path_passed', 'target'].includes(identify(coord))

    const checkHorizontalMoves = (coord: Coord): EDirection | undefined => {
        if (horizontalDeviating) return horizontalDeviating;

        let _horizontalDeviating: EDirection | undefined = horizontalDeviating;
        let nextDir: EDirection | undefined = undefined;

        if (coord.x <= target.x) {
            if (isFree(getCoordAtDirection(coord, EDirection.RIGHT))) {
                console.log('Caminho livre para DIREITA')
                nextDir = EDirection.RIGHT
            } else {
                console.log('Caminho bloqueado para DIREITA, definindo horizontalDeviating como LEFT')
                _horizontalDeviating = EDirection.LEFT
            }
        } else {
            if (isFree(getCoordAtDirection(coord, EDirection.LEFT))) {
                console.log('Caminho livre para ESQUERDA')
                nextDir = EDirection.LEFT
            } else {
                console.log('Caminho bloqueado para ESQUERDA, definindo horizontalDeviating como RIGHT')
                _horizontalDeviating = EDirection.RIGHT
            }
        }

        setVerticalDeviating(_horizontalDeviating)

        return nextDir;
    }

    const checkVerticalMoves = (coord: Coord): EDirection | undefined => {
        if (verticalDeviating) return verticalDeviating;

        let _verticalDeviating: EDirection | undefined = verticalDeviating;
        let nextDir: EDirection | undefined = undefined;

        if (coord.y <= target.y) {
            if (isFree(getCoordAtDirection(coord, EDirection.DOWN))) {
                console.log('Caminho livre para BAIXO')
                nextDir = EDirection.DOWN
            } else {
                console.log('Caminho bloqueado para BAIXO, definindo verticalDeviating como UP')
                _verticalDeviating = EDirection.UP
            }
        } else {
            if (isFree(getCoordAtDirection(coord, EDirection.UP))) {
                console.log('Caminho livre para CIMA')
                nextDir = EDirection.UP
            } else {
                console.log('Caminho bloqueado para CIMA, definindo verticalDeviating como DOWN')
                _verticalDeviating = EDirection.DOWN
            }
        }
        setVerticalDeviating(_verticalDeviating)

        return nextDir;
    }

    console.log({verticalDeviating, horizontalDeviating})

    const walk = () => {
        setTimeout(() => {
            let nextDir = !verticalDeviating ? checkHorizontalMoves(origin) : checkVerticalMoves(origin)
            if (!nextDir) nextDir = checkVerticalMoves(origin)
            console.log(nextDir)

            if (nextDir) {
                const next = getCoordAtDirection(origin, nextDir);
                setDirection(nextDir);
                setPathPassed(prev => [...prev, origin])
                setOrigin(next);
                setDirection(nextDir)
            }

        }, DELAY)
    };

    const addObstacle = (coord: Coord) => {
        setObstacles(prev => {
            if (!isObstacle(coord)) return [...prev, coord];
            return prev
        });
    }

    const remObstacle = (coord: Coord) => {
        setObstacles(prev => prev.filter(o => !(o.x === coord.x && o.y === coord.y)));
    }

    const handleClickCell = (coord: Coord) => {
        if (isObstacle(coord)) {
            remObstacle(coord)
        } else if (identify(coord) === 'free' && isAddingObstacles) {
            addObstacle(coord)
        }
    }

    return (
        <div className="p-2">

            {/*<Image alt={'lince'} height={200} width={400} src={'/lince.png'}/>*/}

            <div className={'grid mb-3 h-6rem'} style={{
                width: `${2.2 * (x + 1)}rem`,
            }}>
                <div className={'col-4'}>
                    <Dropdown
                        className={'w-full'}
                        placeholder={'Selecione um mapa'}
                        value={map}
                        onChange={e => handleChangeMap(e.value)}
                        options={maps.map((_, i) => ({label: `Mapa ${i + 1}`, value: i}))}
                    />
                </div>
                <div className={'col-4'}>
                    <Button
                        className={'w-full'}
                        onClick={() => setIsWalking(prev => !prev)}
                        label={isWalking ? 'Parar' : 'Começar'}
                    />
                </div>
                <div className={'col-4'}>
                    <Button
                        className={'w-full'}
                        onClick={walk}
                        label={'Passo'}
                    />
                </div>
                <div className={'col-4 flex align-items-center'}>
                    <InputSwitch checked={isAddingObstacles} onChange={e => setIsAddingObstacles(e.target.value)}/>
                    <label className={'ml-2'} htmlFor={'add-obstacle'}>Add obstáculos</label>
                </div>
                <div className={'col-4'}>
                    {isWalking && <p className={'m-0'}>Movendo para {direction}</p>}
                </div>
                <div className={'col-4'}>
                    {hoveredCoord.x >= 0 && <p className={'m-0'}>Mouse em: ({hoveredCoord.x}, {hoveredCoord.y})</p>}
                </div>
            </div>

            <div
                className="p-0"
                style={{
                    border: '1px solid #000',
                    width: `${2.2 * (x + 1)}rem`,
                    height: `${2.2 * (y + 1)}rem`
                }}
            >
                {Array.from({length: y + 1}).map((_, i) => {
                    const yCoord = i - 1;
                    return (
                        <div
                            className="flex align-items-end p-0 m-0" key={yCoord}>
                            <div
                                onMouseEnter={() => setHighlightedRow(yCoord)}
                                onMouseLeave={() => setHighlightedRow(-1)}
                                className="cell p-0 m-0"
                                style={{
                                    backgroundColor: 'lightgray',
                                    borderRight: '1px solid #000'
                                }}>{yCoord >= 0 ? yCoord : ''}</div>
                            {Array.from({length: x}).map((_, x) => (
                                <div className="flex flex-column" key={x}>
                                    {yCoord === -1 ? (
                                        <div className="cell flex align-items-center justify-content-center"
                                             onMouseEnter={() => setHighlightedColumn(x)}
                                             onMouseLeave={() => setHighlightedColumn(-1)}
                                             style={{
                                                 backgroundColor: 'lightgray',
                                                 borderBottom: '1px solid #000'
                                             }}>{x}</div>
                                    ) : (
                                        <div
                                            onMouseEnter={() => setHoveredCoord({x, y: yCoord})}
                                            onMouseLeave={() => setHoveredCoord({x: -1, y: -1})}
                                            onClick={() => handleClickCell({x, y: yCoord})}
                                            id={`${x}_${yCoord}`}
                                            className={`cell ${identify({
                                                x,
                                                y: yCoord
                                            })} ${x === highlightedColumn || yCoord === highlightedRow ? 'highlight' : ''}`}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
