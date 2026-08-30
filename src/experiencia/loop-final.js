export function criarLoopFinal(gsap, lenis) {
  const botao = document.querySelector('#voltar-inicio')
  let bloqueado = false
  let toqueInicioY = 0

  function voltar() {
    if (bloqueado) return
    bloqueado = true
    gsap.to(['.cena-webgl', '.camada-canvas', '.final-conteudo'], {
      opacity: 0,
      duration: .32,
      ease: 'power2.in',
      onComplete: () => {
        lenis.scrollTo(0, { immediate: true })
        gsap.to(['.cena-webgl', '.camada-canvas', '.final-conteudo'], { opacity: 1, duration: .75, delay: .08, ease: 'power3.out', onComplete: () => bloqueado = false })
      }
    })
  }

  botao.addEventListener('click', voltar)
  addEventListener('wheel', evento => {
    const noFim = innerHeight + scrollY >= document.documentElement.scrollHeight - 3
    if (noFim && evento.deltaY > 18) voltar()
  }, { passive: true })

  addEventListener('touchstart', evento => {
    toqueInicioY = evento.touches[0]?.clientY || 0
  }, { passive: true })

  addEventListener('touchend', evento => {
    const fimY = evento.changedTouches[0]?.clientY || toqueInicioY
    const noFim = innerHeight + scrollY >= document.documentElement.scrollHeight - 3
    if (noFim && toqueInicioY - fimY > 44) voltar()
  }, { passive: true })

  return { voltar }
}
