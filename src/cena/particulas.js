import * as THREE from 'three'
import { criarMaterialFluxo } from '../shaders/materiais.js'

export function criarParticulas(cena, quantidade = 1400) {
  const geometria = new THREE.BufferGeometry()
  const posicoes = new Float32Array(quantidade * 3)
  const escalas = new Float32Array(quantidade)

  for (let i = 0; i < quantidade; i++) {
    posicoes[i * 3] = (Math.random() - 0.5) * 12
    posicoes[i * 3 + 1] = Math.random() * 4 - 0.4
    posicoes[i * 3 + 2] = (Math.random() - 0.5) * 7
    escalas[i] = Math.random() * 2.2 + 0.35
  }

  geometria.setAttribute('position', new THREE.BufferAttribute(posicoes, 3))
  geometria.setAttribute('escala', new THREE.BufferAttribute(escalas, 1))
  const material = criarMaterialFluxo()
  const pontos = new THREE.Points(geometria, material)
  pontos.frustumCulled = false
  cena.add(pontos)

  let intensidadeAlvo = 0.18
  let velocidade = 0.2

  function atualizar(tempo, velocidadeRolagem, modoAero) {
    velocidade += ((0.35 + Math.abs(velocidadeRolagem) * 0.012 + modoAero * 1.4) - velocidade) * 0.055
    material.uniforms.tempo.value = tempo * velocidade
    intensidadeAlvo = modoAero > 0.05 ? 0.68 : 0.18
    material.uniforms.intensidade.value += (intensidadeAlvo - material.uniforms.intensidade.value) * 0.04
    pontos.rotation.y = Math.sin(tempo * 0.08) * 0.035
  }

  return { pontos, material, atualizar }
}
