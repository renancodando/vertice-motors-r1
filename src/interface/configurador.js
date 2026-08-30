export function criarConfigurador(veiculo, capacidade) {
  const secao = document.querySelector('#configurador')
  let arrastando = false
  let inicioX = 0
  let rotacaoInicial = 0
  let rotacaoAlvo = 0
  let habilitado = false

  document.querySelectorAll('[data-cor]').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('[data-cor]').forEach(item => item.classList.remove('ativo'))
      botao.classList.add('ativo')
      veiculo.configurarCor(botao.dataset.cor)
    })
  })

  document.querySelectorAll('[data-rodas]').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('[data-rodas]').forEach(item => item.classList.remove('ativo'))
      botao.classList.add('ativo')
      veiculo.configurarRodas(botao.dataset.rodas)
    })
  })

  document.querySelectorAll('[data-interior]').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('[data-interior]').forEach(item => item.classList.remove('ativo'))
      botao.classList.add('ativo')
      veiculo.configurarInterior(botao.dataset.interior)
    })
  })

  document.querySelectorAll('[data-acabamento]').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('[data-acabamento]').forEach(item => item.classList.remove('ativo'))
      botao.classList.add('ativo')
      veiculo.configurarAcabamento(botao.dataset.acabamento)
    })
  })

  secao.addEventListener('pointerdown', evento => {
    if (!habilitado || evento.target.closest('button')) return
    arrastando = true
    inicioX = evento.clientX
    rotacaoInicial = rotacaoAlvo
    secao.setPointerCapture?.(evento.pointerId)
  })

  secao.addEventListener('pointermove', evento => {
    if (!arrastando) return
    rotacaoAlvo = rotacaoInicial + (evento.clientX - inicioX) * .0065
  })

  const encerrar = () => arrastando = false
  secao.addEventListener('pointerup', encerrar)
  secao.addEventListener('pointercancel', encerrar)

  function atualizar(ativo) {
    habilitado = ativo
    if (!ativo) rotacaoAlvo *= .95
    veiculo.grupoCarro.rotation.y += (rotacaoAlvo - veiculo.grupoCarro.rotation.y) * (capacidade.toque ? .12 : .08)
  }

  return { atualizar }
}
