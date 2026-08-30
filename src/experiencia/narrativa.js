import { limitar } from '../utilitarios/matematica.js'

export function criarNarrativa(gsap, ScrollTrigger) {
  const indicador = document.querySelector('#indicador-capitulo')
  const indicadorAtual = indicador.querySelector('span')
  const cabecalhoCentro = document.querySelector('.cabecalho-centro')
  const leituraFluxo = document.querySelector('#leitura-fluxo')
  let materialAtivo = 'carbono'

  document.querySelectorAll('.material-opcao').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('.material-opcao').forEach(item => item.classList.remove('ativo'))
      botao.classList.add('ativo')
      materialAtivo = botao.dataset.material
    })
  })

  document.querySelectorAll('.secao h2, .titulo-performance').forEach(titulo => {
    gsap.fromTo(titulo, { yPercent: 18, opacity: 0 }, {
      yPercent: 0,
      opacity: 1,
      duration: 1.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: titulo, start: 'top 82%', toggleActions: 'play none none reverse' }
    })
  })

  document.querySelectorAll('.linha-performance, .material-opcao, .cockpit-itens span').forEach((item, indice) => {
    gsap.fromTo(item, { opacity: 0, y: 18 }, {
      opacity: 1,
      y: 0,
      duration: .65,
      delay: (indice % 5) * .025,
      ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none reverse' }
    })
  })

  function animarEntrada() {
    const elementos = document.querySelectorAll('.mascara-texto > span')
    gsap.to(elementos, { y: 0, duration: 1.15, stagger: .08, ease: 'power4.out' })
    gsap.fromTo('.botao-primario', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, delay: .35, ease: 'power3.out' })
  }

  function atualizar(estado) {
    indicadorAtual.textContent = String(estado.capitulo).padStart(2, '0')
    indicador.style.setProperty('--progresso-capitulo', `${estado.progresso * 100}%`)
    cabecalhoCentro.textContent = `R1 / ${String(estado.capitulo).padStart(2, '0')}`

    const fluxo = estado.capitulo === 1
      ? limitar(.25 + estado.progresso * .75, 0, 1)
      : estado.capitulo === 2
        ? 1
        : 0
    leituraFluxo.textContent = String(Math.round(92 + fluxo * 148 + Math.abs(estado.velocidade) * .7))

    const explosao = estado.capitulo === 3 ? Math.sin(Math.PI * estado.progresso) : 0
    const powertrain = estado.capitulo === 5 ? Math.sin(Math.PI * limitar(estado.progresso * 1.12, 0, 1)) : 0
    const materiais = estado.capitulo === 6 ? Math.sin(Math.PI * limitar(estado.progresso * 1.05, 0, 1)) : 0
    const cockpit = estado.capitulo === 7 || estado.capitulo === 8 ? 1 : 0
    const configurador = estado.capitulo === 9

    return {
      fluxo,
      explosao,
      powertrain,
      materiais,
      cockpit,
      configurador,
      materialAtivo,
      aeroMovel: estado.capitulo === 2 ? Math.sin(Math.PI * estado.progresso) : 0
    }
  }

  return { animarEntrada, atualizar }
}
