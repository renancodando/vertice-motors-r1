import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

export function criarIluminacao(cena) {
  RectAreaLightUniformsLib.init()
  const ambiente = new THREE.HemisphereLight('#d6d7d2', '#050505', 0.18)
  cena.add(ambiente)

  const luzPrincipal = new THREE.RectAreaLight('#f2f1ea', 7.5, 4.8, 0.28)
  luzPrincipal.position.set(0.6, 4.8, 2.7)
  luzPrincipal.lookAt(0, 0.7, 0)
  cena.add(luzPrincipal)

  const luzRecorte = new THREE.RectAreaLight('#bfc5c1', 5.4, 5.8, 0.14)
  luzRecorte.position.set(-3.8, 2.2, -3.7)
  luzRecorte.lookAt(-0.4, 0.85, 0)
  cena.add(luzRecorte)

  const luzFrontal = new THREE.SpotLight('#f3eee4', 22, 18, Math.PI * 0.13, 0.65, 1.8)
  luzFrontal.position.set(5.8, 2.4, 0.4)
  luzFrontal.target.position.set(1.6, 0.7, 0)
  luzFrontal.castShadow = true
  luzFrontal.shadow.mapSize.set(1024, 1024)
  cena.add(luzFrontal, luzFrontal.target)

  const luzAmbra = new THREE.PointLight('#c68b38', 3.2, 7, 2)
  luzAmbra.position.set(-2.4, 0.35, -1.8)
  cena.add(luzAmbra)

  const luzVermelha = new THREE.PointLight('#72110e', 1.4, 5, 2)
  luzVermelha.position.set(-2.8, 0.7, 1.4)
  cena.add(luzVermelha)

  function atualizarPorMouse(mouseX, mouseY) {
    luzPrincipal.position.x = mouseX * 2.4
    luzPrincipal.position.z = 2.8 + mouseY * 1.5
    luzPrincipal.lookAt(0, 0.8, 0)
  }

  function definirClima(indice) {
    const intensidades = [3.8, 6.8, 8.2, 6.4, 7.2, 4.8, 7.4, 3.2, 2.8, 6.6, 1.8]
    const alvoPrincipal = intensidades[indice] ?? 6
    const alvoRecorte = indice === 7 ? 2.6 : indice === 9 ? 7.5 : indice === 0 ? 2.2 : 5.4
    const alvoAmbra = indice === 5 ? 6 : indice === 8 ? 4.5 : 2.2
    const alvoVermelho = indice === 10 ? 3 : 1.2
    const alvoFrontal = indice === 0 ? 5.5 : indice === 10 ? 7 : 22
    luzPrincipal.intensity += (alvoPrincipal - luzPrincipal.intensity) * .035
    luzRecorte.intensity += (alvoRecorte - luzRecorte.intensity) * .035
    luzAmbra.intensity += (alvoAmbra - luzAmbra.intensity) * .035
    luzVermelha.intensity += (alvoVermelho - luzVermelha.intensity) * .035
    luzFrontal.intensity += (alvoFrontal - luzFrontal.intensity) * .035
  }

  return { atualizarPorMouse, definirClima, luzPrincipal, luzRecorte, luzFrontal, luzAmbra }
}
