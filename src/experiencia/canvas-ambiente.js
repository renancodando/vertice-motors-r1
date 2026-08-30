export function criarCanvasAmbiente(canvas, capacidade) {
  const contexto = canvas.getContext('2d', { alpha: true })
  let largura = 0
  let altura = 0
  let pixelRatio = 1
  const quantidade = capacidade.fraco ? 28 : capacidade.toque ? 46 : 82
  const particulas = Array.from({ length: quantidade }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
    vx: Math.random() * .00006 + .000015,
    tamanho: Math.random() * 1.2 + .25
  }))
  let mouseX = .5
  let mouseY = .5
  let intensidadeFluxo = 0

  function redimensionar() {
    pixelRatio = Math.min(devicePixelRatio || 1, 1.5)
    largura = innerWidth
    altura = innerHeight
    canvas.width = Math.floor(largura * pixelRatio)
    canvas.height = Math.floor(altura * pixelRatio)
    canvas.style.width = `${largura}px`
    canvas.style.height = `${altura}px`
    contexto.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  function definirMouse(x, y) {
    mouseX = (x + 1) / 2
    mouseY = (1 - y) / 2
  }

  function definirFluxo(valor) {
    intensidadeFluxo += (valor - intensidadeFluxo) * .08
  }

  function renderizar(tempo, velocidade) {
    contexto.clearRect(0, 0, largura, altura)
    const velocidadeExtra = Math.min(8, Math.abs(velocidade) * .08)
    for (const p of particulas) {
      p.x += p.vx * (1 + intensidadeFluxo * 45 + velocidadeExtra)
      if (p.x > 1.08) {
        p.x = -.08
        p.y = Math.random()
        p.z = Math.random()
      }
      const desvioX = (mouseX - .5) * (1 - p.z) * 18
      const desvioY = (mouseY - .5) * (1 - p.z) * 12
      const x = p.x * largura + desvioX
      const y = p.y * altura + desvioY + Math.sin(tempo * .0002 + p.x * 8) * 3
      const comprimento = 1 + intensidadeFluxo * 42 + velocidadeExtra * 2
      contexto.beginPath()
      contexto.moveTo(x, y)
      contexto.lineTo(x + comprimento, y)
      contexto.strokeStyle = `rgba(220,222,216,${.045 + (1-p.z)*.11})`
      contexto.lineWidth = Math.max(.25, p.tamanho * (1 - p.z * .7))
      contexto.stroke()
    }
  }

  addEventListener('resize', redimensionar, { passive: true })
  redimensionar()

  return { definirMouse, definirFluxo, renderizar }
}
