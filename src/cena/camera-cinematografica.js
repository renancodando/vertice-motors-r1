import * as THREE from 'three'
import { limitar } from '../utilitarios/matematica.js'

function curva(pontos) {
  return new THREE.CatmullRomCurve3(pontos.map(p => new THREE.Vector3(...p)), false, 'catmullrom', 0.55)
}

const rotas = [
  {
    camera: curva([[7.8,1.4,5.8],[6.6,1.25,3.9],[5.5,1.15,2.7]]),
    alvo: curva([[1.5,.82,0],[1.7,.82,0],[1.85,.84,0]])
  },
  {
    camera: curva([[4.9,1.05,2.2],[2.8,1.12,5.4],[-.3,1.2,6.4]]),
    alvo: curva([[1.9,.82,.45],[1.1,.82,0],[0,.9,0]])
  },
  {
    camera: curva([[3.65,1.08,1.15],[3.15,.98,.68],[2.65,.86,.95],[1.65,.7,2.1]]),
    alvo: curva([[2.3,.9,.38],[2.55,.9,.62],[2.1,.74,.9],[1.1,.72,.75]])
  },
  {
    camera: curva([[2.4,2.4,5.2],[.6,3.7,6.8],[-2.3,2.6,5.2]]),
    alvo: curva([[.8,.7,0],[0,.55,0],[-.7,.65,0]])
  },
  {
    camera: curva([[-5.8,1.55,4.2],[-4.5,1.2,2.5],[-3.5,.82,1.4]]),
    alvo: curva([[-.4,.78,0],[-1.2,.7,0],[-2,.68,.15]])
  },
  {
    camera: curva([[1.8,.34,3.8],[.3,.22,2.85],[-1.25,.36,2.6],[-2.3,.48,2.15]]),
    alvo: curva([[.7,.38,0],[0,.36,0],[-.8,.47,0],[-1.65,.55,0]])
  },
  {
    camera: curva([[4.1,2.15,6.3],[2.1,1.85,5.4],[.1,1.65,5.1]]),
    alvo: curva([[0,1.15,2.45],[-.2,1.15,2.45],[-.4,1.15,2.45]])
  },
  {
    camera: curva([[1.2,1.52,2.05],[.55,1.42,1.2],[.28,1.25,.55],[-.05,1.18,.24]]),
    alvo: curva([[.15,1.15,.3],[.1,1.12,.2],[.3,1.06,.24],[.45,1.04,.3]])
  },
  {
    camera: curva([[.48,1.18,.48],[.58,1.1,.2],[.73,1.04,.16]]),
    alvo: curva([[.64,1.08,.3],[.72,1.08,.32],[.78,1.06,.34]])
  },
  {
    camera: curva([[5.4,1.75,5.2],[1.1,1.6,6.5],[-4.1,1.55,4.8]]),
    alvo: curva([[0,.82,0],[0,.82,0],[-.4,.82,0]])
  },
  {
    camera: curva([[-6.8,1.75,5.4],[-7.8,1.45,3.1],[-8.5,1.25,.8]]),
    alvo: curva([[-.6,.78,0],[-.8,.76,0],[-1.2,.78,0]])
  }
]

export function criarCameraCinematografica(camera) {
  const posicaoDesejada = new THREE.Vector3()
  const alvoDesejado = new THREE.Vector3()
  const alvoSuave = new THREE.Vector3(1.5, .8, 0)
  let deslocamentoMouseX = 0
  let deslocamentoMouseY = 0

  function atualizar(capitulo, progresso, mouseX, mouseY, toque = false) {
    const indice = limitar(capitulo, 0, rotas.length - 1)
    const rota = rotas[indice]
    const t = limitar(progresso, 0, 1)
    rota.camera.getPointAt(t, posicaoDesejada)
    rota.alvo.getPointAt(t, alvoDesejado)

    deslocamentoMouseX += ((toque ? 0 : mouseX * 0.12) - deslocamentoMouseX) * 0.04
    deslocamentoMouseY += ((toque ? 0 : mouseY * 0.08) - deslocamentoMouseY) * 0.04
    posicaoDesejada.z += deslocamentoMouseX
    posicaoDesejada.y += deslocamentoMouseY

    camera.position.lerp(posicaoDesejada, 0.065)
    alvoSuave.lerp(alvoDesejado, 0.085)
    camera.lookAt(alvoSuave)

    const fovAlvo = indice === 7 || indice === 8 ? 52 : indice === 2 ? 34 : 38
    camera.fov += (fovAlvo - camera.fov) * 0.045
    camera.updateProjectionMatrix()
  }

  return { atualizar }
}
