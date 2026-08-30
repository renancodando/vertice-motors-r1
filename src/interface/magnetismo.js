export function criarMagnetismo(capacidade) {
  if (capacidade.toque || capacidade.reduzido) return
  document.querySelectorAll('.botao-magnetico').forEach(botao => {
    botao.addEventListener('pointermove', evento => {
      const caixa = botao.getBoundingClientRect()
      const x = evento.clientX - caixa.left - caixa.width / 2
      const y = evento.clientY - caixa.top - caixa.height / 2
      botao.style.transform = `translate3d(${x * .14}px, ${y * .18}px, 0)`
    })
    botao.addEventListener('pointerleave', () => {
      botao.style.transform = 'translate3d(0,0,0)'
    })
  })
}
