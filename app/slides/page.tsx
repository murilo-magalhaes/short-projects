'use client';

import React, { useState, useEffect, ReactNode, KeyboardEvent } from 'react';
import { ChevronRight, ChevronLeft, MessageSquare, X, Brain, Wallet, Database, LineChart, Code, Users } from 'lucide-react';

// --- Interfaces ---
interface SlideBase {
  id: number;
  title: string;
  notes: string;
  type: 'cover' | 'list' | 'content';
}

interface SlideCover extends SlideBase {
  type: 'cover';
  subtitle: string;
  details: string[];
  icon: ReactNode;
}

interface ListItem {
  title: string;
  desc: string;
}

interface SlideList extends SlideBase {
  type: 'list';
  items: (string | ListItem)[];
}

interface SlideContent extends SlideBase {
  type: 'content';
  content: ReactNode;
}

type Slide = SlideCover | SlideList | SlideContent;

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const slides: Slide[] = [
    {
      id: 1,
      type: "cover",
      title: "Engenharia de Software Comportamental",
      subtitle: "Desenvolvimento de Artefatos Tecnológicos para a Saúde Financeira",
      details: [
        "A aplicação de Nudges e Open Finance no controle do endividamento",
        "Disciplina: Projeto de Pesquisa e Inovação (PPI)",
        "Equipe: Murilo S. Magalhães e Victor Inácio Oliveira",
        "Orientador: Prof. Rodrigo"
      ],
      icon: <Brain size={64} className="text-yellow-400" />,
      notes: "Bem-vindos. Hoje apresentamos nossa proposta de PPI focada na intersecção entre Engenharia de Software e Economia Comportamental."
    },
    {
      id: 2,
      type: "list",
      title: "Agenda",
      items: [
        "Contextualização: Cenário Econômico Brasileiro",
        "Problema de Pesquisa: A falha das ferramentas tradicionais",
        "Referencial Teórico: Finanças Comportamentais & Nudges",
        "Ecossistema: Fintechs e Open Finance",
        "Proposta de Solução: O Artefato de Software",
        "Metodologia: Design Science Research (DSR)",
        "Cronograma e Resultados Esperados"
      ],
      notes: "Esta é a nossa rota para hoje. Começaremos pelo contexto alarmante do endividamento no Brasil."
    },
    {
      id: 3,
      type: "content",
      title: "Contexto: O Cenário Brasileiro",
      content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-400">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Cultura do Curto Prazo</h3>
              <p className="text-gray-300">Herança da memória inflacionária. Aversão cultural à poupança de longo prazo.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-2">Epidemia de Inadimplência</h3>
              <p className="text-gray-300">Dez/2024: Recordes históricos.</p>
              <p className="text-gray-300 mt-2">Faixa mais afetada: <span className="font-bold text-white">41-60 anos (35,1%)</span>.</p>
            </div>
          </div>
      ),
      notes: "O brasileiro não poupa não apenas por falta de renda, mas por um viés histórico."
    },
    {
      id: 4,
      type: "content",
      title: "O Problema de Pesquisa",
      content: (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <h3 className="text-lg font-semibold text-white">Definição:</h3>
              <p className="text-gray-400">Ferramentas atuais (PFM) são ineficazes pois ignoram a psicologia humana.</p>
            </div>
            <div className="bg-yellow-400/10 border border-yellow-400 p-4 rounded text-center">
              <p className="text-yellow-400 font-bold">Questão Norteadora:</p>
              <p className="text-white italic">"Como projetar software que use Open Finance e Economia Comportamental para induzir decisões ótimas?"</p>
            </div>
          </div>
      ),
      notes: "O problema central é que os apps de finanças são feitos para seres racionais (Homo Economicus)."
    },
    {
      id: 5,
      type: "list",
      title: "Justificativa e Relevância",
      items: [
        { title: "Social", desc: "Redução do superendividamento via tecnologia." },
        { title: "Técnica", desc: "Uso inovador de APIs de Open Finance para nudges preditivos." },
        { title: "Acadêmica", desc: "Contribuição para IHC validando teorias comportamentais." }
      ],
      notes: "Justificamos este projeto em três frentes: Social, Técnica e Acadêmica."
    },
    {
      id: 6,
      type: "list",
      title: "Objetivos",
      items: [
        { title: "Geral", desc: "Desenvolver protótipo de gestão financeira fundamentado em Nudge Theory." },
        { title: "Específico 1", desc: "Mapear vieses cognitivos do público brasileiro." },
        { title: "Específico 2", desc: "Projetar Arquitetura de Escolha que reduza carga cognitiva." }
      ],
      notes: "Nosso foco não é apenas 'fazer um app', mas validar um modelo."
    },
    {
      id: 7,
      type: "content",
      title: "Referencial Teórico",
      content: (
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-400">Racionalidade Limitada (Simon)</h3>
                <p className="text-sm text-gray-300">O cérebro economiza energia.</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
              <h4 className="text-white font-bold mb-4">Sistemas de Pensamento (Kahneman)</h4>
              <div className="bg-red-500/20 text-red-300 p-3 rounded border border-red-500/50 mb-2">
                <strong>Sistema 1 (Rápido)</strong>
              </div>
              <div className="bg-green-500/20 text-green-300 p-3 rounded border border-green-500/50">
                <strong>Sistema 2 (Lento)</strong>
              </div>
            </div>
          </div>
      ),
      notes: "Nossa base teórica vem de Kahneman e Tversky."
    },
    {
      id: 8,
      type: "content",
      title: "Vieses & Nudges",
      content: (
          <table className="w-full text-left border-collapse">
            <thead>
            <tr className="text-yellow-400 border-b border-gray-700">
              <th className="p-3">Viés</th>
              <th className="p-3">Nudge</th>
            </tr>
            </thead>
            <tbody className="text-gray-300 text-sm">
            <tr className="border-b border-gray-800">
              <td className="p-3 font-bold">Inércia</td>
              <td className="p-3">Defaults Inteligentes.</td>
            </tr>
            </tbody>
          </table>
      ),
      notes: "Aqui conectamos a teoria à prática. Para cada falha cognitiva, uma funcionalidade."
    },
    {
      id: 9,
      type: "content",
      title: "Ecosystem: Open Finance",
      content: (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
              <Database className="text-blue-400" size={40} />
              <div>
                <h3 className="font-bold text-white">Infraestrutura</h3>
                <p className="text-gray-400 text-sm">Elimina a barreira da entrada de dados manual.</p>
              </div>
            </div>
          </div>
      ),
      notes: "A tecnologia que torna isso possível hoje é o Open Finance."
    },
    {
      id: 10,
      type: "content",
      title: "Metodologia: DSR",
      content: (
          <div className="relative border-l-2 border-yellow-400 ml-6 space-y-8 py-4">
            <div className="relative pl-8">
              <div className="absolute -left-3 top-0 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center text-black font-bold text-xs">1</div>
              <h4 className="font-bold text-white">Investigação do Problema</h4>
            </div>
          </div>
      ),
      notes: "Usaremos DSR (Ciclo de Wieringa) para garantir rigor científico."
    },
    {
      id: 11,
      type: "list",
      title: "Cronograma",
      items: [
        { title: "Meses 1-2", desc: "Aprofundamento teórico." },
        { title: "Mês 4", desc: "Desenvolvimento do Protótipo (Figma)." }
      ],
      notes: "Nosso cronograma é focado em entregar um protótipo validado em 5 meses."
    },
    {
      id: 12,
      type: "content",
      title: "Considerações Finais",
      content: (
          <div className="text-center space-y-8 mt-8">
            <p className="text-xl text-gray-300">"A tecnologia pode acelerar o endividamento ou promover a saúde financeira."</p>
            <div className="flex justify-center gap-4 mt-8 opacity-50">
              <Code size={16} /> <Brain size={16} /> <Wallet size={16} />
            </div>
          </div>
      ),
      notes: "Concluímos que a inovação está na empatia pelo usuário falível. Obrigado."
    }
  ];

  const handleNext = (): void => {
    if (currentSlide < slides.length - 1) {
      setDirection('next');
      setCurrentSlide(currentSlide + 1);
      setShowNotes(false);
    }
  };

  const handlePrev = (): void => {
    if (currentSlide > 0) {
      setDirection('prev');
      setCurrentSlide(currentSlide - 1);
      setShowNotes(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'cover':
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="mb-4 p-6 bg-yellow-400/10 rounded-full border border-yellow-400/20">{slide.icon}</div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{slide.title}</h1>
              <h2 className="text-xl md:text-2xl text-yellow-400 font-light">{slide.subtitle}</h2>
              <div className="text-gray-400 text-sm space-y-1">
                {slide.details.map((detail, idx) => <p key={idx}>{detail}</p>)}
              </div>
            </div>
        );
      case 'list':
        return (
            <div className="h-full flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-8 border-b border-gray-700 pb-4">{slide.title}</h2>
              <ul className="space-y-4">
                {slide.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 min-w-[8px] h-[8px] rounded-full bg-yellow-400"></div>
                      <div>
                        {typeof item === 'string' ? (
                            <span className="text-xl text-gray-200">{item}</span>
                        ) : (
                            <>
                              <span className="text-xl font-bold text-white block">{item.title}</span>
                              <span className="text-base text-gray-400">{item.desc}</span>
                            </>
                        )}
                      </div>
                    </li>
                ))}
              </ul>
            </div>
        );
      case 'content':
        return (
            <div className="h-full flex flex-col">
              <h2 className="text-3xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-4">{slide.title}</h2>
              <div className="flex-grow overflow-y-auto custom-scrollbar">{slide.content}</div>
            </div>
        );
    }
  };

  if (!isClient) return null;

  return (
      <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
        <style jsx global>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        .slide-enter-next { animation: slideInRight 0.5s ease-out forwards; }
        .slide-enter-prev { animation: slideInLeft 0.5s ease-out forwards; }
      `}</style>

        <div className="h-12 bg-black flex items-center justify-between px-4 border-b border-gray-800">
          <span className="text-xs font-bold text-gray-500">PPI 2025</span>
          <span className="text-xs text-gray-400">Slide {currentSlide + 1} / {slides.length}</span>
        </div>

        <div className="flex-grow flex items-center justify-center p-4 md:p-8 relative">
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl shadow-2xl border border-gray-800 p-8 md:p-12 relative overflow-hidden">
            <div key={currentSlide} className={`w-full h-full ${direction === 'next' ? 'slide-enter-next' : 'slide-enter-prev'}`}>
              {renderSlideContent(slides[currentSlide])}
            </div>
          </div>
        </div>

        <div className="h-20 bg-black border-t border-gray-800 flex items-center justify-between px-4 md:px-12 relative z-20">
          <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${showNotes ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300'}`}
          >
            <MessageSquare size={18} />
            <span className="hidden md:inline text-sm">Notas</span>
          </button>

          <div className="flex items-center gap-6">
            <button onClick={handlePrev} disabled={currentSlide === 0} className="p-3 rounded-full bg-gray-800 disabled:opacity-30"><ChevronLeft size={24} /></button>
            <button onClick={handleNext} disabled={currentSlide === slides.length - 1} className="p-3 rounded-full bg-yellow-400 text-black disabled:opacity-30"><ChevronRight size={24} /></button>
          </div>
        </div>

        {showNotes && (
            <div className="absolute bottom-24 left-4 md:left-12 max-w-md bg-white text-gray-900 p-6 rounded-lg shadow-xl border-l-4 border-yellow-400 z-30 slide-enter-next">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-500 text-xs uppercase">Roteiro</h4>
                <button onClick={() => setShowNotes(false)}><X size={16} /></button>
              </div>
              <p className="text-sm font-medium">{slides[currentSlide].notes}</p>
            </div>
        )}
      </div>
  );
}