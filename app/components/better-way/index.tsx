'use client'

import {useEffect, useState} from "react";
import './styles.css';
import {Button} from "primereact/button";

interface Coord {
    x: number;
    y: number;
}

const mockObstacles: Coord[] = [
    {x: 10, y: 10},
    {x: 10, y: 9},
    {x: 10, y: 11},
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

const DELAY = 300;

export default function BetterWay() {
    const [x, setX] = useState(20);
    const [y, setY] = useState(20);

    const [origin, setOrigin] = useState<Coord>({x: 1, y: 10});
    const [hoveredCoord, setHoveredCoord] = useState<Coord>({x: -1, y: -1});
    const [target, setTarget] = useState<Coord>({x: 19, y: 10});
    const [obstacles, setObstacles] = useState<Coord[]>(mockObstacles);

    const [direction, setDirection] = useState<EDirection>(EDirection.RIGHT);
    const [pathPassed, setPathPassed] = useState<Coord[]>([]);

    const [isWalking, setIsWalking] = useState(false);
    const [isDeviating, setIsDeviating] = useState(false);
    const [isArrived, setIsArrived] = useState(false);

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

    const isDestiny = (coord: Coord) =>
        target.x === coord.x && target.y === coord.y;

    const isWithinLimits = (coord: Coord) => coord.x >= 0 && coord.y >= 0 && coord.x < x && coord.y < y

    const identify = (coord: Coord): string => {
        return isObstacle(coord) ? 'obstacle' :
            isArrived ? 'arrived' :
                isOrigin(coord) ? 'origin' :
                    isDestiny(coord) ? 'destiny' :
                        isPathPassed(coord) ? 'path_passed' :
                            !isWithinLimits(coord) ? 'out_of_limits' :
                                'free';
    }

    const isSameCoord = (a: Coord, b: Coord) =>
        a.x === b.x && a.y === b.y;

    const moveTo = (coord: Coord, dir: EDirection) =>
        ({x: coord.x + moves[dir].x, y: coord.y + moves[dir].y});

    const manualMove = (dir: EDirection) => {
        setOrigin(prev => {
            const next = moveTo(prev, dir);
            if (['free', 'path_passed', 'destiny'].includes(identify(next))) {
                return next;
            }
            return prev;
        })
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

    const walk = () => {
        setTimeout(() => {

            const horizontal = origin.x - target.x;
            const vertical = origin.y - target.y;

            let newDir: EDirection;
            let next: Coord;
            let _isDeviating = false;

            if (Math.abs(horizontal) > Math.abs(vertical)) {
                newDir = origin.x < target.x ? EDirection.RIGHT : EDirection.LEFT;
                next = moveTo(origin, newDir);
                if (!['free', 'path_passed', 'destiny'].includes(identify(next))) {
                    newDir = (origin.y < target.y && !isDeviating) ? EDirection.DOWN : EDirection.UP;
                    _isDeviating = true
                    next = moveTo(origin, newDir);
                }
            } else {
                newDir = origin.y < target.y ? EDirection.DOWN : EDirection.UP;
                next = moveTo(origin, newDir);
                if (!['free', 'path_passed', 'destiny'].includes(identify(next))) {
                    newDir = (origin.x < target.x && !isDeviating) ? EDirection.RIGHT : EDirection.LEFT;
                    _isDeviating = true
                    next = moveTo(origin, newDir);
                }
            }

            console.log({newDir, next})
            setDirection(newDir);
            setIsDeviating(_isDeviating)
            setPathPassed(prev => [...prev, origin])
            setOrigin(next);
        }, DELAY)
    };

    return (
        <div className="m-2">
            <div className={'grid mb-3'} style={{
                width: `${2.2 * (x + 1)}rem`,
            }}>
                <div className={'col-12'}>
                    <Button
                        className={'w-full'}
                        onClick={() => setIsWalking(prev => !prev)}
                        label={isWalking ? 'Parar' : 'Começar'}
                    />
                </div>
                {isWalking && <p>Movendo para {direction}</p>}
                {hoveredCoord.x >= 0 && <p>Mouse em: ({hoveredCoord.x}, {hoveredCoord.y})</p>}
            </div>

            <div
                className="p-0"
                style={{
                    border: '1px solid #000',
                    width: `${2.2 * (x + 1)}rem`,
                    height: `${2.2 * (y + 1)}rem`
                }}
            >
                {Array.from({length: y + 2}).map((_, i) => {
                    const yCoord = i - 1;
                    return (
                        <div className="flex align-items-end p-0 m-0" key={yCoord}>
                            <div className="cell p-0 m-0"
                                 style={{borderRight: '1px solid #000'}}>{yCoord >= 0 ? yCoord : ''}</div>
                            {Array.from({length: x}).map((_, x) => (
                                <div className="flex flex-column" key={x}>
                                    {yCoord === -1 ? (
                                        <div className="cell flex align-items-center justify-content-center"
                                             style={{borderBottom: '1px solid #000'}}>{x}</div>
                                    ) : (
                                        <div
                                            onMouseEnter={() => setHoveredCoord({x, y: yCoord})}
                                            onMouseLeave={() => setHoveredCoord({x: -1, y: -1})}
                                            id={`${x}_${yCoord}`}
                                            className={`cell ${identify({x, y: yCoord})}`}
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
