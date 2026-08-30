import * as THREE from 'three'
import { criarMaterialEnergia } from '../shaders/materiais.js'

export function criarPowertrain(cena) {
  const grupo = new THREE.Group()
  grupo.visible = false
  cena.add(grupo)

  const material = criarMaterialEnergia()
  const bateria = new THREE.Vector3(-0.1, 0.48, 0)
  const inversor = new THREE.Vector3(0.75, 0.58, 0)
  const motorDianteiro = new THREE.Vector3(1.85, 0.56, 0)
  const motorTraseiro = new THREE.Vector3(-1.85, 0.56, 0)
  const segmentos = [
    [bateria, inversor],
    [inversor, motorDianteiro],
    [inversor, motorTraseiro],
    [motorDianteiro, new THREE.Vector3(1.85, 0.56, 0.96)],
    [motorDianteiro, new THREE.Vector3(1.85, 0.56, -0.96)],
    [motorTraseiro, new THREE.Vector3(-1.85, 0.56, 0.96)],
    [motorTraseiro, new THREE.Vector3(-1.85, 0.56, -0.96)]
  ]

  segmentos.forEach(([inicio, fim], indice) => {
    const meio = inicio.clone().lerp(fim, 0.5)
    meio.y += indice < 3 ? 0.12 : 0.05
    const curva = new THREE.CatmullRomCurve3([inicio, meio, fim])
    const geometria = new THREE.TubeGeometry(curva, 32, 0.024, 8, false)
    const tubo = new THREE.Mesh(geometria, material.clone())
    tubo.material.uniforms = THREE.UniformsUtils.clone(material.uniforms)
    tubo.material.vertexShader = material.vertexShader
    tubo.material.fragmentShader = material.fragmentShader
    grupo.add(tubo)
  })

  function atualizar(tempo, intensidade) {
    grupo.visible = intensidade > 0.02
    grupo.children.forEach((tubo, indice) => {
      tubo.material.uniforms.tempo.value = tempo - indice * .12
      tubo.material.uniforms.intensidade.value = intensidade
    })
  }

  return { grupo, atualizar }
}
