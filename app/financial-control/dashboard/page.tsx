'use client'

import {PanelMenu} from "primereact/panelmenu";
import {MenuItem} from "primereact/menuitem";
import Image from "next/image";
import {useState} from "react";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {billsMock} from "@/data/bill.interface";
import {Column} from "primereact/column";

export default function FinancialDashboardPage() {

    const menuItems: MenuItem[] = [
        {
            label: 'Despesas',
            icon: 'pi pi-money-bill',
            items: [
                {
                    label: 'Nova despesa',
                    icon: 'pi pi-plus'
                },
                {
                    label: 'Pagar despesa',
                    icon: 'pi pi-check'
                }
            ]
        },
        {
            label: 'Rendas',
            icon: 'pi pi-dollar',
            items: [
                {
                    label: 'Nova renda',
                    icon: 'pi pi-plus'
                }
            ]
        }
    ]

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    function formatDecimal(
        value: string | number,
        decimals?: number,
    ): string {
        let formatedValue: string = '';

        // Converte string para number
        if (typeof value === 'string') {
            const conValue = Number(value.replace(',', '.'));
            formatedValue = new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                currency: 'BRL',
                minimumFractionDigits: decimals || 2,
                maximumFractionDigits: decimals || 2,
            }).format(conValue);
        }

        if (typeof value === 'number') {
            formatedValue = new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                currency: 'BRL',
                minimumFractionDigits: decimals || 2,
                maximumFractionDigits: decimals || 2,
            }).format(value);
        }

        return formatedValue;
    }

    const mountOwnerColumn = (owner: {name: string, avatar_url: string}) => {
        return <div>
            <div className={'profile'}><Image src={owner.avatar_url} alt={`owner_${owner.name}`} width={50} height={50}></Image></div>
            <span className={'name'}>{owner.name}</span>
        </div>
    }


    return (
        <div className={'flex w-full'}>
            <aside className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`} onMouseEnter={() => setSidebarOpen(true)}
                   onMouseLeave={() => setSidebarOpen(false)}>
                {sidebarOpen ?
                    <h2 className={'title mb-4'}>Pluto</h2> : <i className={'title pi pi-dollar'}/>
                }

                <div>
                    <ul className={'list'}>
                        <li><i className={'fas fa-hand-holding-dollar'}></i>{sidebarOpen ? 'Despesas' : ''}</li>
                        <li><i className={'fa-regular fa-money-bill-1'}></i>{sidebarOpen ? 'Rendas' : ''}</li>
                        <li><i className={'fas fa-sack-dollar'}></i>{sidebarOpen ? 'Reservas' : ''}</li>
                        <li><i className={'fas fa-arrow-trend-up'}></i>{sidebarOpen ? 'Metas' : ''}</li>
                    </ul>
                </div>
            </aside>
            <div className={'app-container w-full'}>
                <header className={'main-header'}>
                    <div className={'profile'}><Image src={'https://avatars.githubusercontent.com/u/101419493?v=4'}
                                                      alt={'Profile'} width={50} height={50}/></div>
                </header>
                <div className={'main-content'}>
                    <div className={'grid'}>

                        <Card className={'resume-card col-2'}
                              header={<h2 className={'w-full text-center m-0'}>Despesas</h2>}>
                            <h3 className={'w-full text-center m-0'}>R$ 2.500,00</h3>
                        </Card>
                    </div>

                    <DataTable
                        value={billsMock}

                    >
                        <Column header={'Resp.'} field={'owner.avatar_url'} body={r => mountOwnerColumn(r.owner[0])}/>
                        <Column header={'Título'} field={'title'}/>
                        <Column header={'Valor'} field={'value'} body={r => formatDecimal(r.value)}/>
                    </DataTable>

                </div>
            </div>
        </div>
    )
}