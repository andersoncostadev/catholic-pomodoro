import { useState } from 'react'
import { faqs } from '@domain/catalogs/content'

const steps = [
  {
    n: '01',
    title: 'Um minuto de oração',
    text: 'Uma jaculatória, oferecendo a Deus o que você vai fazer.',
  },
  {
    n: '02',
    title: 'Vinte e cinco de foco',
    text: 'Trabalho, estudo ou leitura. Uma coisa de cada vez.',
  },
  {
    n: '03',
    title: 'Cinco minutos de pausa',
    text: 'Reze uma dezena do Terço, faça uma breve oração ou permaneça na presença de Deus.',
  },
  {
    n: '04',
    title: 'Recomece',
    text: 'O ciclo volta à oração. Depois de quatro focos, uma pausa mais longa.',
  },
]

export function Story({ onBegin }: { onBegin: () => void }) {
  return (
    <>
      <section className="story" id="metodo">
        <p className="eyebrow">Como funciona</p>
        <h2>Quatro passos, e Deus no meio deles.</h2>
        <p className="lede">
          A técnica Pomodoro divide o trabalho em períodos curtos de foco, intercalados com pausas. Aqui, parte dessas
          pausas — e o minuto antes de começar — fica reservada à oração.
        </p>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="story meaning" id="sentido">
        <p className="eyebrow">O sentido</p>
        <h2>Não é rezar para produzir mais.</h2>
        <blockquote>
          A proposta não é rezar para ser mais produtivo, mas colocar Deus no centro também dos nossos momentos de
          trabalho e estudo, fazendo com que a oração esteja presente no ritmo do nosso dia.
        </blockquote>
      </section>

      <section className="story" id="perguntas">
        <p className="eyebrow">Perguntas</p>
        <h2>Perguntas frequentes</h2>
        <div className="faq">
          {faqs.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Comece oferecendo o próximo minuto.</h2>
        <p>Sem conta. O ciclo abre na oração.</p>
        <button type="button" className="primary" onClick={onBegin}>
          Começar pela oração
        </button>
      </section>

      <footer className="colophon">
        <nav>
          <a href="#timer">Timer</a>
          <a href="#metodo">Método</a>
          <a href="#sentido">Sentido</a>
          <a href="#perguntas">Perguntas</a>
        </nav>
        <p>Pomodoro Católico. Inspirado na técnica Pomodoro de Francesco Cirillo.</p>
      </footer>
    </>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={open ? 'faq-item is-open' : 'faq-item'}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {question}
        <span aria-hidden="true">{open ? '–' : '+'}</span>
      </button>
      {open ? <p>{answer}</p> : null}
    </div>
  )
}
