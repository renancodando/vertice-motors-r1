import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { criarTexturaCarbono, criarTexturaEscovada } from '../texturas/procedurais.js'

function criarMalha(geometria, material, nome, posicao = [0, 0, 0], rotacao = [0, 0, 0]) {
  const malha = new THREE.Mesh(geometria, material)
  malha.name = nome
  malha.position.set(...posicao)
  malha.rotation.set(...rotacao)
  malha.castShadow = true
  malha.receiveShadow = true
  return malha
}

function criarMaterialExterior(cor = '#aeb1b0') {
  return new THREE.MeshPhysicalMaterial({
    color: cor,
    metalness: 0.82,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.35
  })
}

export function criarR1() {
  const grupoCarro = new THREE.Group()
  grupoCarro.name = 'VÉRTICE R1'
  grupoCarro.position.y = 0.12

  const materialExterior = criarMaterialExterior()
  const texturaCarbono = criarTexturaCarbono()
  const texturaEscovada = criarTexturaEscovada()
  const materialCarbono = new THREE.MeshPhysicalMaterial({ color: '#b8bab5', map: texturaCarbono, metalness: 0.65, roughness: 0.34, clearcoat: 0.45, clearcoatRoughness: 0.22 })
  const materialVidro = new THREE.MeshPhysicalMaterial({ color: '#111516', metalness: 0.08, roughness: 0.08, transmission: 0.4, transparent: true, opacity: 0.58, thickness: 0.25, ior: 1.42 })
  const materialMetal = new THREE.MeshStandardMaterial({ color: '#737674', metalness: 0.92, roughness: 0.32, roughnessMap: texturaEscovada })
  const materialPneu = new THREE.MeshStandardMaterial({ color: '#080808', metalness: 0.05, roughness: 0.78 })
  const materialDisco = new THREE.MeshStandardMaterial({ color: '#8e918e', metalness: 0.95, roughness: 0.28 })
  const materialPinca = new THREE.MeshStandardMaterial({ color: '#8d1712', metalness: 0.45, roughness: 0.32 })
  const materialFarol = new THREE.MeshStandardMaterial({ color: '#f4f3e9', emissive: '#dadbcf', emissiveIntensity: 2.4, roughness: 0.18 })
  const materialLanterna = new THREE.MeshStandardMaterial({ color: '#5a0806', emissive: '#9c120d', emissiveIntensity: 2.8, roughness: 0.24 })
  const materialBateria = new THREE.MeshStandardMaterial({ color: '#383a38', metalness: 0.72, roughness: 0.38 })
  const materialEnergia = new THREE.MeshStandardMaterial({ color: '#7b541f', emissive: '#b67827', emissiveIntensity: 1.35, metalness: 0.6, roughness: 0.3 })
  const materialInterior = new THREE.MeshStandardMaterial({ color: '#151515', metalness: 0.12, roughness: 0.62 })
  const materialTela = new THREE.MeshStandardMaterial({ color: '#111513', emissive: '#aab6aa', emissiveIntensity: 0.48, roughness: 0.2 })

  const componentes = {}
  const carroceria = new THREE.Group()
  carroceria.name = 'carroceria'
  componentes.carroceria = carroceria
  grupoCarro.add(carroceria)

  const corpoBase = criarMalha(new RoundedBoxGeometry(5.15, 0.9, 2.03, 7, 0.25), materialExterior, 'corpo-base', [0, 0.72, 0])
  corpoBase.scale.set(1, 0.84, 1)
  carroceria.add(corpoBase)

  const nariz = criarMalha(new RoundedBoxGeometry(1.7, 0.48, 1.92, 6, 0.19), materialExterior, 'nariz', [2.35, 0.75, 0], [0, 0, -0.035])
  nariz.scale.set(1.12, 0.75, 1)
  carroceria.add(nariz)

  const capô = criarMalha(new RoundedBoxGeometry(1.7, 0.2, 1.64, 6, 0.12), materialExterior, 'capo', [1.38, 1.13, 0], [0, 0, 0.02])
  carroceria.add(capô)

  const traseira = criarMalha(new RoundedBoxGeometry(1.45, 0.56, 1.94, 6, 0.18), materialExterior, 'traseira', [-2.22, 0.78, 0], [0, 0, 0.02])
  traseira.scale.set(1.05, 0.88, 1)
  carroceria.add(traseira)

  const teto = criarMalha(new RoundedBoxGeometry(2.05, 0.72, 1.55, 7, 0.28), materialVidro, 'canopy', [-0.25, 1.42, 0])
  teto.scale.set(1.06, 0.95, 1)
  carroceria.add(teto)

  const coluna = criarMalha(new RoundedBoxGeometry(0.16, 0.58, 1.58, 4, 0.07), materialCarbono, 'arco-central', [-0.44, 1.43, 0])
  carroceria.add(coluna)

  const saiaEsquerda = criarMalha(new RoundedBoxGeometry(3.25, 0.2, 0.16, 4, 0.07), materialCarbono, 'saia-e', [0, 0.48, 1.04])
  const saiaDireita = saiaEsquerda.clone()
  saiaDireita.name = 'saia-d'
  saiaDireita.position.z = -1.04
  carroceria.add(saiaEsquerda, saiaDireita)

  const splitter = criarMalha(new RoundedBoxGeometry(0.72, 0.08, 2.14, 3, 0.03), materialCarbono, 'splitter', [2.72, 0.43, 0])
  carroceria.add(splitter)

  const difusor = criarMalha(new RoundedBoxGeometry(0.8, 0.12, 1.8, 3, 0.04), materialCarbono, 'difusor', [-2.66, 0.45, 0], [0, 0, 0.04])
  carroceria.add(difusor)

  const entradas = new THREE.Group()
  entradas.name = 'aerodinamica-ativa'
  componentes.aerodinamica = entradas
  grupoCarro.add(entradas)

  for (const lado of [-1, 1]) {
    const entrada = criarMalha(new RoundedBoxGeometry(0.78, 0.3, 0.13, 4, 0.05), materialCarbono, `entrada-${lado}`, [0.6, 0.78, lado * 1.04], [0, lado * 0.05, 0])
    entradas.add(entrada)
  }

  const asa = new THREE.Group()
  asa.name = 'asa-ativa'
  const lamina = criarMalha(new RoundedBoxGeometry(0.52, 0.08, 1.72, 3, 0.03), materialCarbono, 'asa-lamina', [-2.08, 1.1, 0])
  const suporte1 = criarMalha(new RoundedBoxGeometry(0.07, 0.32, 0.08, 2, 0.02), materialMetal, 'asa-suporte-1', [-2.04, 0.94, 0.48])
  const suporte2 = suporte1.clone(); suporte2.position.z = -0.48
  asa.add(lamina, suporte1, suporte2)
  entradas.add(asa)

  const farois = new THREE.Group()
  farois.name = 'farois'
  for (const lado of [-1, 1]) {
    const farol = criarMalha(new RoundedBoxGeometry(0.45, 0.07, 0.18, 3, 0.03), materialFarol, `farol-${lado}`, [2.62, 0.9, lado * 0.68], [0, 0, lado * 0.08])
    farois.add(farol)
  }
  carroceria.add(farois)

  const lanternas = new THREE.Group()
  for (const lado of [-1, 1]) {
    const lanterna = criarMalha(new RoundedBoxGeometry(0.24, 0.05, 0.55, 3, 0.02), materialLanterna, `lanterna-${lado}`, [-2.62, 0.91, lado * 0.5])
    lanternas.add(lanterna)
  }
  carroceria.add(lanternas)

  const chassis = new THREE.Group()
  chassis.name = 'chassis'
  componentes.chassis = chassis
  const monocoque = criarMalha(new RoundedBoxGeometry(3.7, 0.42, 1.46, 5, 0.14), materialCarbono, 'monocoque', [-0.18, 0.62, 0])
  chassis.add(monocoque)
  grupoCarro.add(chassis)

  const bateria = new THREE.Group()
  bateria.name = 'bateria'
  componentes.bateria = bateria
  const pack = criarMalha(new RoundedBoxGeometry(2.75, 0.23, 1.34, 4, 0.08), materialBateria, 'pack-94kwh', [-0.05, 0.34, 0])
  bateria.add(pack)
  for (let i = -4; i <= 4; i++) {
    const linha = criarMalha(new THREE.BoxGeometry(0.03, 0.012, 1.2), materialMetal, `divisao-bateria-${i}`, [i * 0.27, 0.465, 0])
    bateria.add(linha)
  }
  grupoCarro.add(bateria)

  const motores = new THREE.Group()
  motores.name = 'motores'
  componentes.motores = motores
  for (const x of [-1.85, 1.8]) {
    const motor = criarMalha(new THREE.CylinderGeometry(0.27, 0.27, 0.72, 24), materialEnergia, `motor-${x}`, [x, 0.52, 0], [Math.PI / 2, 0, 0])
    motores.add(motor)
  }
  grupoCarro.add(motores)

  const suspensao = new THREE.Group()
  suspensao.name = 'suspensao'
  componentes.suspensao = suspensao
  for (const x of [-1.82, 1.82]) {
    for (const z of [-0.86, 0.86]) {
      const braco = criarMalha(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 10), materialMetal, `braco-${x}-${z}`, [x, 0.61, z * 0.67], [Math.PI / 2, 0, z > 0 ? -0.35 : 0.35])
      suspensao.add(braco)
    }
  }
  grupoCarro.add(suspensao)

  const rodas = new THREE.Group()
  rodas.name = 'rodas'
  componentes.rodas = rodas
  const freios = new THREE.Group()
  freios.name = 'freios'
  componentes.freios = freios

  const conjuntosRoda = []
  for (const x of [-1.82, 1.82]) {
    for (const z of [-1.04, 1.04]) {
      const grupoRoda = new THREE.Group()
      grupoRoda.position.set(x, 0.56, z)
      const pneu = criarMalha(new THREE.CylinderGeometry(0.49, 0.49, 0.28, 48), materialPneu, 'pneu', [0, 0, 0], [Math.PI / 2, 0, 0])
      const aro = criarMalha(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 32), materialMetal, 'aro', [0, 0, 0], [Math.PI / 2, 0, 0])
      const miolo = criarMalha(new THREE.CylinderGeometry(0.07, 0.07, 0.32, 20), materialCarbono, 'miolo', [0, 0, 0], [Math.PI / 2, 0, 0])
      const raios = new THREE.Group()
      for (let i = 0; i < 7; i++) {
        const raio = criarMalha(new RoundedBoxGeometry(0.26, 0.035, 0.045, 2, 0.012), materialCarbono, `raio-${i}`, [0.16, 0, z > 0 ? 0.16 : -0.16], [0, 0, i * Math.PI / 3.5])
        raios.add(raio)
      }
      grupoRoda.add(pneu, aro, miolo, raios)
      rodas.add(grupoRoda)
      conjuntosRoda.push(grupoRoda)

      const disco = criarMalha(new THREE.CylinderGeometry(0.29, 0.29, 0.028, 40), materialDisco, 'disco', [x, 0.56, z * 0.93], [Math.PI / 2, 0, 0])
      const pinca = criarMalha(new RoundedBoxGeometry(0.11, 0.25, 0.08, 3, 0.025), materialPinca, 'pinca', [x + 0.1, 0.56, z * 0.91])
      freios.add(disco, pinca)
    }
  }
  grupoCarro.add(rodas, freios)

  const cockpit = new THREE.Group()
  cockpit.name = 'cockpit'
  componentes.cockpit = cockpit
  const banco1 = criarMalha(new RoundedBoxGeometry(0.64, 0.86, 0.48, 5, 0.16), materialInterior, 'banco-piloto', [-0.44, 0.91, 0.36], [0, 0, -0.08])
  const banco2 = banco1.clone(); banco2.name = 'banco-passageiro'; banco2.position.z = -0.36
  const painel = criarMalha(new RoundedBoxGeometry(0.23, 0.24, 1.2, 4, 0.08), materialInterior, 'painel', [0.5, 1.02, 0], [0, 0, -0.08])
  const tela = criarMalha(new RoundedBoxGeometry(0.03, 0.18, 0.58, 3, 0.03), materialTela, 'hud-interno', [0.63, 1.17, 0.3], [0, 0, -0.08])
  const volanteAro = criarMalha(new THREE.TorusGeometry(0.18, 0.025, 12, 30), materialCarbono, 'volante', [0.65, 1.02, 0.36], [0, Math.PI / 2, 0])
  const console = criarMalha(new RoundedBoxGeometry(1.2, 0.22, 0.22, 4, 0.06), materialCarbono, 'console', [-0.15, 0.86, 0], [0, 0, 0.03])
  cockpit.add(banco1, banco2, painel, tela, volanteAro, console)
  grupoCarro.add(cockpit)

  const pontosOriginais = new Map()
  Object.values(componentes).forEach(grupo => pontosOriginais.set(grupo, grupo.position.clone()))

  function configurarCor(cor) {
    materialExterior.color.set(cor)
  }

  function configurarRodas(tipo) {
    const escalas = { aero: 1, forjada: 1.045, pista: 0.97 }
    const escala = escalas[tipo] || 1
    conjuntosRoda.forEach((grupo, indice) => {
      grupo.scale.setScalar(escala)
      grupo.children[1].material.roughness = tipo === 'forjada' ? 0.18 : tipo === 'pista' ? 0.42 : 0.3
      grupo.rotation.z = tipo === 'pista' ? (indice % 2 ? 0.08 : -0.08) : 0
    })
  }

  function configurarInterior(tipo) {
    const cores = { grafite: '#151515', areia: '#786f62', vermelho: '#4e1210' }
    materialInterior.color.set(cores[tipo] || cores.grafite)
  }

  function configurarAcabamento(tipo) {
    const valores = {
      carbono: { cor: '#b8bab5', metal: 0.65, rugosidade: 0.34 },
      titanio: { cor: '#565958', metal: 0.94, rugosidade: 0.28 },
      aluminio: { cor: '#9b9d99', metal: 0.9, rugosidade: 0.4 }
    }[tipo] || { cor: '#111211', metal: 0.65, rugosidade: 0.34 }
    materialCarbono.color.set(valores.cor)
    materialCarbono.metalness = valores.metal
    materialCarbono.roughness = valores.rugosidade
    materialCarbono.map = tipo === 'carbono' ? texturaCarbono : null
    materialCarbono.roughnessMap = tipo === 'carbono' ? null : texturaEscovada
    materialCarbono.needsUpdate = true
  }

  function definirTransparenciaExterior(valor) {
    const opacidade = Math.max(0.12, Math.min(1, valor))
    materialExterior.transparent = opacidade < 0.999
    materialExterior.opacity = opacidade
    materialExterior.depthWrite = opacidade > 0.6
    materialVidro.opacity = Math.min(0.58, opacidade * 0.65)
  }

  function atualizarAerodinamica(progresso) {
    asa.position.y = progresso * 0.15
    asa.rotation.z = -progresso * 0.12
    splitter.scale.x = 1 + progresso * 0.16
    difusor.rotation.z = progresso * 0.08
  }

  return {
    grupoCarro,
    componentes,
    pontosOriginais,
    materiais: { materialExterior, materialCarbono, materialVidro, materialInterior, materialMetal },
    configurarCor,
    configurarRodas,
    configurarInterior,
    configurarAcabamento,
    definirTransparenciaExterior,
    atualizarAerodinamica
  }
}
