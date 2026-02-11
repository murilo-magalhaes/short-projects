interface Bill {
    title: string;
    description: string;
    value: number;
    paid: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'A' | 'C';
    owner: {
      name: string;
      avatar_url: string;
    }[]
    category: 'Fixos' | 'Cartões' | 'Alimentação'
}

export const billsMock: Bill[] = [
    {
        title: "Aluguel",
        description: "Apartamento — mês atual",
        value: 1800,
        paid: 1800,
        priority: "HIGH",
        status: "C",
        owner: [
            { name: "Murilo", avatar_url: "https://i.pravatar.cc/150?img=32" }
        ],
        category: "Fixos"
    },
    {
        title: "Cartão Nubank",
        description: "Fatura de compras online e mercado",
        value: 950.75,
        paid: 200,
        priority: "MEDIUM",
        status: "A",
        owner: [
            { name: "Murilo", avatar_url: "https://i.pravatar.cc/150?img=45" },
            { name: "Ana", avatar_url: "https://i.pravatar.cc/150?img=12" }
        ],
        category: "Cartões"
    },
    {
        title: "Supermercado",
        description: "Compra semanal — feira e itens básicos",
        value: 320.40,
        paid: 0,
        priority: "LOW",
        status: "A",
        owner: [
            { name: "Murilo", avatar_url: "https://i.pravatar.cc/150?img=6" }
        ],
        category: "Alimentação"
    },
    {
        title: "Internet",
        description: "Fibra 500 Mbps",
        value: 129.90,
        paid: 129.90,
        priority: "MEDIUM",
        status: "C",
        owner: [
            { name: "Ana", avatar_url: "https://i.pravatar.cc/150?img=17" }
        ],
        category: "Fixos"
    },
    {
        title: "Cartão Itaú",
        description: "Compras parceladas e recorrentes",
        value: 1420.30,
        paid: 0,
        priority: "HIGH",
        status: "A",
        owner: [
            { name: "Murilo", avatar_url: "https://i.pravatar.cc/150?img=40" }
        ],
        category: "Cartões"
    },
    {
        title: "Restaurante",
        description: "Jantar do fim de semana",
        value: 210.90,
        paid: 210.90,
        priority: "LOW",
        status: "C",
        owner: [
            { name: "Ana", avatar_url: "https://i.pravatar.cc/150?img=13" }
        ],
        category: "Alimentação"
    },
    {
        title: "Condomínio",
        description: "Taxa mensal com água inclusa",
        value: 540,
        paid: 540,
        priority: "MEDIUM",
        status: "C",
        owner: [
            { name: "Murilo", avatar_url: "https://i.pravatar.cc/150?img=8" }
        ],
        category: "Fixos"
    },
    {
        title: "Cartão Digio",
        description: "Compras de farmácia e app delivery",
        value: 312.50,
        paid: 100,
        priority: "LOW",
        status: "A",
        owner: [
            { name: "Ana", avatar_url: "https://i.pravatar.cc/150?img=18" }
        ],
        category: "Cartões"
    },
    {
        title: "Padaria",
        description: "Café da manhã de domingo",
        value: 48.70,
        paid: 0,
        priority: "LOW",
        status: "A",
        owner: [
            { name: "Murilo", avatar_url: "https://i.pravatar.cc/150?img=22" }
        ],
        category: "Alimentação"
    },
    {
        title: "Luz / Energia",
        description: "Conta mensal — consumo elevado devido ao calor",
        value: 260.15,
        paid: 0,
        priority: "HIGH",
        status: "A",
        owner: [
            { name: "Ana", avatar_url: "https://i.pravatar.cc/150?img=9" }
        ],
        category: "Fixos"
    }
];
