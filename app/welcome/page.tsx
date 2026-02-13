'use client'

import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {redirect} from "next/navigation";
import {v4} from "uuid";
import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {generateCode} from "@/utils/numbers/generateCode";

export default function WelcomePage() {

    const [username, setUsername] = useState<string>('');
    const [tictactoeId, setTictactoeId] = useState<string>('');

    useEffect(() => {
        const hasUser = localStorage.getItem("username") || '';
        setUsername(hasUser);
    }, [])

    const checkUsername = () => {
        if (username === '') {
            alert('Por favor, escolha um nome de usuário para jogar.');
            return false;
        }

        localStorage.setItem('username', username);
        return true;
    }

    const handleNewTictactoeRoom = () => {
        if(!checkUsername()) return;

        const id = generateCode(6);
        redirect(`/tictactoe/${id}`);
    }

    const handleEnterTictactoeRoom = () => {
        if(!checkUsername()) return;
        redirect(`/tictactoe/${tictactoeId}`);
    }

    return (
        <div className="flex flex-column justify-content-center align-items-center w-full bg-primary text-white">
            <h1 className="text-3xl font-bold">Bem-vind@ aos projetinhos do Magal!</h1>
            <div className={'grid p-fluid p-2'}>
                <div className={'field col-12'}>
                    <label htmlFor={'username'} >Escolha um nome de usuário</label>
                    <InputText id={'username'} placeholder={'Nome de usuário...'} value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                </div>
            </div>

            <div className={'grid w-full px-8'}>
                <div className={'p-2 col-4 h-full flex'}>
                    <Card title={'Jogo da Velha 2'} className={'text-center'}>
                        <div className={'w-full grid p-fluid'}>

                        <div className={'col-12'}>
                            <Button label={'Criar nova sala'} onClick={handleNewTictactoeRoom}></Button>
                        </div>
                        <span className={'col-12'}>ou</span>
                        <div className={'col-8 mt-2'}>
                            <FloatLabel>
                                <InputText id={'tictactoe_id'} value={tictactoeId}
                                           onChange={(e) => setTictactoeId(e.target.value)} placeholder={'Ex.: MUBTCX'}/>
                                <label htmlFor={'tictactoe_id'}>Código de sala</label>
                            </FloatLabel>
                        </div>
                        <div className={'col-4 mt-2'}>
                            <Button label={'Entrar'} onClick={handleEnterTictactoeRoom}/>
                        </div>
                        </div>
                    </Card>
                </div>
                <div className={'p-2 col-4 h-full flex'}>
                    <Card className={'w-full text-center'} title={'Damas'}>
                        <p>Em desenvolvimento <i className={'pi pi-spinner spin'}></i></p>
                    </Card>
                </div>
                <div className={'p-2 col-4 h-full flex'}>
                    <Card className={'w-full text-center'} title={'Outros projetos'}>
                        <p>Em desenvolvimento <i className={'pi pi-spinner spin'}></i></p>
                    </Card>
                </div>
            </div>
        </div>
    )
}