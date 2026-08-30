import * as THREE from 'three'
import { criarR1 } from '../modelos/r1.js'
import { criarIluminacao } from './iluminacao.js'
import { criarParticulas } from './particulas.js'
import { criarPowertrain } from './powertrain.js'
import { criarMostruarioMateriais } from './mostruario-materiais.js'
import { criarPosProcessamento } from './pos-processamento.js'

export function criarCena(canvas, capacidade) {
  const cena = new THREE.Scene()
  cena.background = new THREE.Color('#080808')
  cena.fog = new THREE.FogExp2('#080808', 0.035)

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.08, 80)
  camera.position.set(7.2, 1.5, 6.5)

  const renderizador = new THREE.WebGLRenderer({ canvas, antialias: !capacidade.fraco, alpha: false, powerPreference: 'high-performance' })
  renderizador.setPixelRatio(capacidade.pixelRatio)
  renderizador.setSize(innerWidth, innerHeight)
  renderizador.outputColorSpace = THREE.SRGBColorSpace
  renderizador.toneMapping = THREE.ACESFilmicToneMapping
  renderizador.toneMappingExposure = 0.84
  renderizador.shadowMap.enabled = !capacidade.fraco
  renderizador.shadowMap.type = THREE.PCFSoftShadowMap

  const piso = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 40),
    new THREE.MeshPhysicalMaterial({ color: '#0b0b0a', metalness: 0.25, roughness: 0.28, clearcoat: 0.15, clearcoatRoughness: 0.45 })
  )
  piso.rotation.x = -Math.PI / 2
  piso.position.y = 0
  piso.receiveShadow = true
  cena.add(piso)

  const fundoTunel = new THREE.Mesh(new THREE.PlaneGeometry(60, 18), new THREE.MeshStandardMaterial({ color: '#0a0a09', roughness: 0.92 }))
  fundoTunel.position.set(-12, 5, -10)
  cena.add(fundoTunel)

  const linhasTunel = new THREE.Group()
  const materialLinha = new THREE.MeshBasicMaterial({ color: '#d7d5ca', transparent: true, opacity: 0.18 })
  for (let x = -15; x <= 15; x += 3.8) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 7), materialLinha)
    barra.position.set(x, 4.4, 0)
    linhasTunel.add(barra)
  }
  cena.add(linhasTunel)

  const veiculo = criarR1()
  cena.add(veiculo.grupoCarro)

  const iluminacao = criarIluminacao(cena)
  const particulas = criarParticulas(cena, capacidade.fraco ? 520 : capacidade.toque ? 850 : 1500)
  const powertrain = criarPowertrain(cena)
  const mostruarioMateriais = criarMostruarioMateriais(cena)
  const posProcessamento = criarPosProcessamento(renderizador, cena, camera, capacidade)

  function redimensionar() {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderizador.setPixelRatio(Math.min(capacidade.pixelRatio, capacidade.fraco ? 1.25 : 1.8))
    renderizador.setSize(innerWidth, innerHeight, false)
    posProcessamento.redimensionar()
  }

  addEventListener('resize', redimensionar, { passive: true })

  return { cena, camera, renderizador, veiculo, iluminacao, particulas, powertrain, mostruarioMateriais, posProcessamento, piso, linhasTunel }
}
