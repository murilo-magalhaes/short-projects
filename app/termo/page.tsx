'use client'

import {useCallback, useEffect, useState} from "react";
import './styles.css'
import words from "@/data/termo/words";
import randomNumber from "@/utils/numbers/randomNumber";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export default function TermoPage() {

    const [sortedWord, setSortedWord] = useState<string>('')
    const [input, setInput] = useState<string>('')
    const [wordsTried, setWordsTried] = useState<string[]>([])
    const [isFinished, setIsFinished] = useState<boolean>(false)
    const [result, setResult] = useState<{ severity: string, message: string }>({severity: 'error', message: ''})
    const [score, setScore] = useState(0);

    const handleEnter = useCallback(() => {
        if (input.length === 5) {
            setWordsTried(prev => [...prev, input]);
            setInput('');
        }
    }, [input]);

    useEffect(() => {
        sortWord()
    }, []);

    useEffect(() => {
        checkVictory();
    }, [wordsTried])

    const sortWord = () => {
        const random = Number(randomNumber(50).toFixed(0));
        setSortedWord(words[random])
    }

    const playAgain = () => {
        setIsFinished(false);
        setInput('')
        sortWord();
        setWordsTried([])
    }

    const getLetterColor = (letter: string, pos: number) => {
        if (!letter) return "";
        if (!sortedWord.includes(letter)) {
            return 'letter-gray'
        } else {
            if (sortedWord[pos] === letter) return 'letter-green';
            return 'letter-yellow';
        }
    }

    const checkVictory = () => {
        if (wordsTried.includes(sortedWord)) {
            setIsFinished(true)
            setResult({severity: 'success', message: 'Você acertou a palavra!'})
            setScore(prev => prev + 1)
            return;
        }
        if (wordsTried.length === 6) {
            setIsFinished(true);
            setResult({severity: 'error', message: 'Não foi dessa vez...'})
        }
    }

    return (
        <div className={'bg-termo flex-column flex w-full h-full'}>
            <header>
                <p className={'px-4 w-full text-end text-white'}>Score: {score}</p>
            </header>
            <main className={'h-full flex flex-column justify-content-center align-items-center'}>
                <h1 className={'text-white'}>Termo</h1>

                <div>
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i}>
                            {i === wordsTried.length && !isFinished ? (
                                <InputText
                                    autoFocus
                                    className={'input-current'}
                                    value={input}
                                    maxLength={5}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleEnter()
                                    }}
                                />
                            ) : (
                                <div className={'flex gap-2'}>
                                    {
                                        Array.from({length: 5}).map((_, j) => (
                                            <div key={`words-${j}`}
                                                 className={`letter ${getLetterColor(wordsTried[i]?.[j], j)}`}>
                                                {wordsTried[i]?.[j] || ''}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>

                    ))}
                </div>

                {isFinished && (
                    <div className={'w-15rem'}>
                        <p className={`text-center text-${result.severity}`}>{result.message}</p>
                        <Button className={'w-full'} label={'Jogar de novo'} onClick={playAgain}
                                icon={'pi pi-refresh'}/>
                    </div>
                )}

            </main>
        </div>
    )
}