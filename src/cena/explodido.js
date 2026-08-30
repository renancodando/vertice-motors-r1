import * as THREE from 'three'
import { suavizar } from '../utilitarios/matematica.js'

export function criarControleExplodido(componentes) {
  const alvos = {
    carroceria: new THREE.Vector3(0, 1.85, 0),
    chassis: new THREE.Vector3(0, 0.42, 0),
    suspensao: new THREE.Vector3(0, -0.15, 0),
    freios: new THREE.Vector3(0, 0, 0),
    motores: new THREE.Vector3(0, -0.52, 0),
    bateria: new THREE.Vector3(0, -1.28, 0),
    rodas: new THREE.Vector3(0, 0, 0),
    aerodinamica: new THREE.Vector3(0, 1.15, 0),
    cockpit: new THREE.Vector3(0, 1.05, 0)
  }

  let progressoAtual = 0
  const posicoesRodas = componentes.rodas ? componentes.rodas.children.map(roda => roda.position.clone()) : []

  function atualizar(progresso) {
    progressoAtual = suavizar(progressoAtual, progresso, 0.075)
    Object.entries(componentes).forEach(([nome, grupo]) => {
      const alvo = alvos[nome] || new THREE.Vector3()
      grupo.position.x += ((alvo.x * progressoAtual) - grupo.position.x) * 0.09
      grupo.position.y += ((alvo.y * progressoAtual) - grupo.position.y) * 0.09
      grupo.position.z += ((alvo.z * progressoAtual) - grupo.position.z) * 0.09
    })

    if (componentes.rodas) {
      const p = progressoAtual
      componentes.rodas.children.forEach((roda, indice) => {
        const base = posicoesRodas[indice]
        const sinalX = base.x < 0 ? -1 : 1
        const sinalZ = base.z < 0 ? -1 : 1
        const alvoX = base.x + sinalX * p * 0.8
        const alvoZ = base.z + sinalZ * p * 0.72
        roda.position.x += (alvoX - roda.position.x) * 0.08
        roda.position.z += (alvoZ - roda.position.z) * 0.08
      })
    }
  }

  return { atualizar, obterProgresso: () => progressoAtual }
}
