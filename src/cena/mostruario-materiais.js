import * as THREE from 'three'
import { criarMaterialMostruario } from '../shaders/materiais.js'

export function criarMostruarioMateriais(cena) {
  const grupo = new THREE.Group()
  grupo.position.set(-0.4, 1.15, 2.45)
  grupo.visible = false

  const tipos = ['carbono', 'titanio', 'aluminio']
  const amostras = []

  tipos.forEach((tipo, indice) => {
    const geometria = new THREE.SphereGeometry(0.58, 64, 48)
    const material = criarMaterialMostruario(tipo)
    const esfera = new THREE.Mesh(geometria, material)
    esfera.position.x = (indice - 1) * 1.55
    esfera.scale.y = 1.22
    esfera.userData.tipo = tipo
    grupo.add(esfera)
    amostras.push(esfera)
  })

  cena.add(grupo)

  function atualizar(tempo, intensidade, mouseX, mouseY, ativo = 'carbono') {
    grupo.visible = intensidade > 0.01
    grupo.position.y = 1.15 + (1 - intensidade) * 0.4
    amostras.forEach((esfera, indice) => {
      esfera.rotation.y = tempo * (0.08 + indice * 0.02) + mouseX * 0.25
      esfera.rotation.x = mouseY * 0.12
      const alvo = esfera.userData.tipo === ativo ? 1 : 0.78
      esfera.scale.x += (alvo - esfera.scale.x) * 0.06
      esfera.scale.z += (alvo - esfera.scale.z) * 0.06
      esfera.material.opacity = intensidade
      esfera.material.transparent = intensidade < 0.99
    })
  }

  return { grupo, atualizar }
}
