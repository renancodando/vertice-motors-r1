import './estilos/base.css'
import './estilos/interface.css'
import { detectarCapacidade } from './utilitarios/dispositivo.js'
import { criarRolagem } from './experiencia/rolagem.js'
import { criarCanvasAmbiente } from './experiencia/canvas-ambiente.js'
import { criarNarrativa } from './experiencia/narrativa.js'
import { executarCarregamento } from './experiencia/carregamento.js'
import { criarLoopFinal } from './experiencia/loop-final.js'
import { criarVisibilidade } from './experiencia/visibilidade.js'
import { criarCursor } from './interface/cursor.js'
import { criarMagnetismo } from './interface/magnetismo.js'
import { criarHud } from './interface/hud.js'
import { criarMenu } from './interface/menu.js'

const capacidade = detectarCapacidade()
const canvasWebgl = document.querySelector('#cena-webgl')
const canvasAmbiente = document.querySelector('#camada-canvas')
const avisoDesempenho = document.querySelector('#aviso-desempenho')

if (capacidade.fraco && avisoDesempenho) {
  avisoDesempenho.hidden = false
  setTimeout(() => avisoDesempenho.hidden = true, 3200)
}

const mouse = { x: 0, y: 0 }
addEventListener('pointermove', evento => {
  mouse.x = (evento.clientX / innerWidth) * 2 - 1
  mouse.y = -((evento.clientY / innerHeight) * 2 - 1)
}, { passive: true })

async function iniciar() {
  const rolagem = criarRolagem(capacidade)
  const narrativa = criarNarrativa(rolagem.gsap, rolagem.ScrollTrigger)
  const cursor = criarCursor(capacidade)
  const ambienteCanvas = criarCanvasAmbiente(canvasAmbiente, capacidade)
  const hud = criarHud()
  const visibilidade = criarVisibilidade()

  let mundo
  let criarCameraCinematografica
  let criarControleExplodido
  let criarConfigurador
  try {
    const modulos3d = await Promise.all([
      import('./cena/criar-cena.js'),
      import('./cena/camera-cinematografica.js'),
      import('./cena/explodido.js'),
      import('./interface/configurador.js')
    ])
    mundo = modulos3d[0].criarCena(canvasWebgl, capacidade)
    criarCameraCinematografica = modulos3d[1].criarCameraCinematografica
    criarControleExplodido = modulos3d[2].criarControleExplodido
    criarConfigurador = modulos3d[3].criarConfigurador
  } catch {
    document.documentElement.classList.add('sem-webgl')
    canvasWebgl.style.display = 'none'
  }

  criarMagnetismo(capacidade)
  criarMenu(rolagem.gsap, rolagem.irPara)
  criarLoopFinal(rolagem.gsap, rolagem.lenis)

  document.querySelector('#explorar-r1')?.addEventListener('click', () => rolagem.irPara('#forma'))
  document.querySelector('.marca')?.addEventListener('click', evento => {
    evento.preventDefault()
    rolagem.irPara('#inicio')
  })

  if (!mundo) {
    await executarCarregamento(rolagem.gsap)
    narrativa.animarEntrada()
    const ciclo = tempo => {
      cursor.atualizar()
      ambienteCanvas.definirMouse(mouse.x, mouse.y)
      ambienteCanvas.definirFluxo(rolagem.estado.capitulo === 2 ? 1 : .15)
      ambienteCanvas.renderizar(tempo, rolagem.estado.velocidade)
      if (visibilidade.estaVisivel('interface')) hud.desenhar(rolagem.estado.capitulo === 8 ? rolagem.estado.progresso : .35, tempo)
      narrativa.atualizar(rolagem.estado)
      requestAnimationFrame(ciclo)
    }
    requestAnimationFrame(ciclo)
    return
  }

  const cameraCinematografica = criarCameraCinematografica(mundo.camera)
  const explodido = criarControleExplodido(mundo.veiculo.componentes)
  const configurador = criarConfigurador(mundo.veiculo, capacidade)
  let tempoAnterior = performance.now()
  let tempoAcumulado = 0

  await executarCarregamento(rolagem.gsap)
  narrativa.animarEntrada()
  rolagem.ScrollTrigger.refresh()

  function ciclo(tempo) {
    const delta = Math.min(.05, (tempo - tempoAnterior) / 1000)
    tempoAnterior = tempo
    tempoAcumulado += delta

    const efeitos = narrativa.atualizar(rolagem.estado)
    cursor.atualizar()
    ambienteCanvas.definirMouse(mouse.x, mouse.y)
    ambienteCanvas.definirFluxo(efeitos.fluxo)
    ambienteCanvas.renderizar(tempo, rolagem.estado.velocidade)

    cameraCinematografica.atualizar(
      rolagem.estado.capitulo,
      rolagem.estado.progresso,
      mouse.x,
      mouse.y,
      capacidade.toque
    )

    mundo.iluminacao.atualizarPorMouse(mouse.x, mouse.y)
    mundo.iluminacao.definirClima(rolagem.estado.capitulo)
    mundo.particulas.atualizar(tempoAcumulado, rolagem.estado.velocidade, efeitos.fluxo)
    explodido.atualizar(efeitos.explosao)
    mundo.veiculo.atualizarAerodinamica(efeitos.aeroMovel)
    mundo.powertrain.atualizar(tempoAcumulado, efeitos.powertrain)
    mundo.mostruarioMateriais.atualizar(tempoAcumulado, efeitos.materiais, mouse.x, mouse.y, efeitos.materialAtivo)
    mundo.posProcessamento.atualizar(tempoAcumulado, efeitos, rolagem.estado.velocidade)

    const opacidadeExterior = efeitos.powertrain > .02
      ? 1 - efeitos.powertrain * .74
      : efeitos.cockpit
        ? .22
        : 1
    mundo.veiculo.definirTransparenciaExterior(opacidadeExterior)

    configurador.atualizar(efeitos.configurador)
    if (visibilidade.estaVisivel('interface')) hud.desenhar(rolagem.estado.capitulo === 8 ? rolagem.estado.progresso : .34, tempo)

    mundo.linhasTunel.position.x = ((rolagem.estado.progressoGlobal * 16) % 3.8) - 1.9
    mundo.posProcessamento.renderizar()
    requestAnimationFrame(ciclo)
  }

  requestAnimationFrame(ciclo)
}

iniciar()
