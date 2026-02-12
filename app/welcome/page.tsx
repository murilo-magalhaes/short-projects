'use client'

import {useState} from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {redirect} from "next/navigation";
import {v4} from "uuid";

export default function WelcomePage() {

    const [username, setUsername] = useState<string>('');

    const playTictactoe = () => {
        if (username === '') {
            alert('Por favor, escolha um nome de usuário para jogar.');
            return;
        }

        localStorage.setItem('username', username);

        const id = localStorage.getItem('tictactoe_id') as string || v4();

        redirect(`/tictactoe/${id}`);
    }

    return (
        <div className="flex flex-column justify-content-center align-items-center w-full">
            <h1 className="text-3xl font-bold">Bem-vind@ aos projetinhos do Magal!</h1>
            <div className={'grid p-fluid p-card p-4'} style={{backgroundColor: 'var(--gray-200)'}}>
                <div className={'field col-12'}>
                    <label htmlFor={'username'}>Escolha um nome de usuário</label>
                    <InputText id={'username'} placeholder={'Nome de usuário...'} value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className={'field col-12'}>
                    <Button label={'Jogo da Velha 2'} onClick={() => playTictactoe()}/>
                </div>
            </div>
        </div>
    )
}