'use client'

import {useState} from "react";
import './styles.css'

interface Coord {
    x: number;
    y: number;
}

const emptyCoord: Coord = {x:-1,y:-1};

const mockObstacles: Coord[] = [
    {x: 10, y: 10},
    {x: 10, y: 9},
    {x: 10, y: 11},
]

export default function BetterWay() {

    const [x, setX] = useState<number>(20);
    const [y, setY] = useState<number>(20);

    const [origin, setOrigin] = useState<Coord>({x:1, y: 10});
    const [destiny, setDestiny] = useState<Coord>({x:19, y: 10});
    const [obstacles, setObstacles] = useState<Coord[]>(mockObstacles);

    const isObstacle = (coord: Coord): boolean => {
        return obstacles.some(obstacle => obstacle.x === coord.x && obstacle.y === coord.y);
    }

    const isOrigin = (coord: Coord): boolean => {
        return origin.x === coord.x && origin.y === coord.y;
    }

    const isDestiny = (coord: Coord): boolean => {
        return destiny.x === coord.x && destiny.y === coord.y;
    }

    const getColor = (coord: Coord): string => {
        return isObstacle(coord)
            ? '#000'
            : isOrigin(coord)
                ? 'red'
                : isDestiny(coord)
                    ? 'blue'
                    : '#fff'
    }

    return (
        <div className={'p-2'}>
            {Array.from({length: y}).map((_, y) => (
                <div className={'flex align-items-end'} key={y}>
                    <>
                        <div className={'h-2rem w-2rem text-center'}>
                            {y}
                        </div>
                        {Array.from({length: x}).map((_, x) => (
                            <div className={'flex flex-column'} key={x}>
                                {y === 0 && (
                                    <div className={'h-2rem w-2rem text-center'}>
                                        {x}
                                    </div>
                                )}
                                <div id={`${x}_${y}`} key={`${x}_${y}`} className={'h-2rem w-2rem'} style={{backgroundColor: getColor({x,y})}}>

                                </div>
                            </div>
                        ))}
                    </>
                </div>
            ))}

        </div>
    )
}