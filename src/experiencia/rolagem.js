import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function criarRolagem(capacidade) {
  const estado = {
    capitulo: 0,
    progresso: 0,
    progressoGlobal: 0,
    velocidade: 0
  }

  const lenis = new Lenis({
    duration: capacidade.reduzido ? 0.35 : capacidade.toque ? 0.9 : 1.18,
    smoothWheel: !capacidade.reduzido,
    syncTouch: false,
    wheelMultiplier: 0.88
  })

  lenis.on('scroll', evento => {
    estado.velocidade = evento.velocity
    ScrollTrigger.update()
  })

  gsap.ticker.add(tempo => lenis.raf(tempo * 1000))
  gsap.ticker.lagSmoothing(0)

  const secoes = [...document.querySelectorAll('.secao')]
  secoes.forEach((secao, indice) => {
    ScrollTrigger.create({
      trigger: secao,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => estado.capitulo = indice,
      onEnterBack: () => estado.capitulo = indice,
      onUpdate: self => {
        if (estado.capitulo === indice) estado.progresso = self.progress
      }
    })
  })

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'max',
    onUpdate: self => estado.progressoGlobal = self.progress
  })

  function irPara(alvo) {
    lenis.scrollTo(alvo, { duration: capacidade.reduzido ? 0.2 : 1.4, lock: false })
  }

  return { estado, lenis, irPara, ScrollTrigger, gsap }
}
