export function criarHud() {
  const canvas = document.querySelector('#hud-canvas')
  const contexto = canvas.getContext('2d')
  const velocidade = document.querySelector('#hud-velocidade')
  const potencia = document.querySelector('#hud-potencia')
  const temperatura = document.querySelector('#hud-temperatura')
  const autonomia = document.querySelector('#hud-autonomia')
  const gforce = document.querySelector('#hud-gforce')

  function desenhar(progresso, tempo) {
    const largura = canvas.width
    const altura = canvas.height
    contexto.clearRect(0, 0, largura, altura)
    contexto.save()
    contexto.translate(largura / 2, altura * .53)

    contexto.strokeStyle = 'rgba(235,238,230,.18)'
    contexto.lineWidth = 2
    for (let i = -6; i <= 6; i++) {
      const angulo = Math.PI * 1.08 + (i + 6) / 12 * Math.PI * .84
      const raio1 = altura * .39
      const raio2 = altura * .44
      contexto.beginPath()
      contexto.moveTo(Math.cos(angulo) * raio1, Math.sin(angulo) * raio1)
      contexto.lineTo(Math.cos(angulo) * raio2, Math.sin(angulo) * raio2)
      contexto.stroke()
    }

    contexto.strokeStyle = 'rgba(198,139,56,.72)'
    contexto.lineWidth = 4
    contexto.beginPath()
    contexto.arc(0, 0, altura * .34, Math.PI * 1.07, Math.PI * (1.07 + .86 * (.24 + progresso * .58)))
    contexto.stroke()

    const oscilacao = Math.sin(tempo * .0018) * 4
    contexto.strokeStyle = 'rgba(235,238,230,.28)'
    contexto.lineWidth = 1
    contexto.beginPath()
    for (let x = -largura * .33; x <= largura * .33; x += 8) {
      const y = Math.sin(x * .03 + tempo * .002) * (5 + progresso * 8) + oscilacao
      if (x === -largura * .33) contexto.moveTo(x, y)
      else contexto.lineTo(x, y)
    }
    contexto.stroke()
    contexto.restore()

    const valorVelocidade = Math.round(86 + progresso * 196)
    velocidade.textContent = String(valorVelocidade)
    potencia.textContent = `${Math.round(36 + progresso * 54)}%`
    temperatura.textContent = `${Math.round(58 + progresso * 31)}°C`
    autonomia.textContent = `${Math.round(412 - progresso * 176)} km`
    gforce.textContent = `${(.48 + progresso * 1.62).toFixed(2)} g`
  }

  return { desenhar }
}
