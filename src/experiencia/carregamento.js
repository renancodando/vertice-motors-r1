export async function executarCarregamento(gsap) {
  const camada = document.querySelector('#carregamento')
  const progresso = document.querySelector('#carregamento-progresso')
  const status = document.querySelector('#carregamento-status')
  const etapas = ['Preparando aerodinâmica', 'Calibrando powertrain', 'Inicializando telemetria', 'R1 pronto']

  try { await document.fonts.ready } catch {}

  for (let i = 0; i < etapas.length; i++) {
    status.textContent = etapas[i]
    await new Promise(resolve => gsap.to(progresso, { width: `${(i + 1) * 25}%`, duration: .16, ease: 'power2.out', onComplete: resolve }))
  }

  await new Promise(resolve => gsap.to(camada, { yPercent: -100, duration: .85, ease: 'power4.inOut', onComplete: resolve }))
  camada.remove()
}
