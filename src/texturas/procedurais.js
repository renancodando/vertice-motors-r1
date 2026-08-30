import * as THREE from 'three'

function prepararTextura(canvas, repeticaoX, repeticaoY) {
  const textura = new THREE.CanvasTexture(canvas)
  textura.wrapS = THREE.RepeatWrapping
  textura.wrapT = THREE.RepeatWrapping
  textura.repeat.set(repeticaoX, repeticaoY)
  textura.colorSpace = THREE.SRGBColorSpace
  textura.anisotropy = 4
  return textura
}

export function criarTexturaCarbono() {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 96
  const contexto = canvas.getContext('2d')
  contexto.fillStyle = '#1a1a19'
  contexto.fillRect(0, 0, 96, 96)
  for (let y = -16; y < 112; y += 12) {
    for (let x = -16; x < 112; x += 12) {
      contexto.save()
      contexto.translate(x, y)
      contexto.rotate(Math.PI / 4)
      contexto.fillStyle = (x / 12 + y / 12) % 2 === 0 ? '#20201f' : '#111211'
      contexto.fillRect(-7, -2, 14, 4)
      contexto.restore()
    }
  }
  return prepararTextura(canvas, 8, 8)
}

export function criarTexturaEscovada() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 32
  const contexto = canvas.getContext('2d')
  const imagem = contexto.createImageData(128, 32)
  for (let y = 0; y < 32; y++) {
    let valorLinha = 160 + Math.floor(Math.random() * 34)
    for (let x = 0; x < 128; x++) {
      const indice = (y * 128 + x) * 4
      const variacao = Math.max(0, Math.min(255, valorLinha + Math.floor((Math.random() - .5) * 14)))
      imagem.data[indice] = variacao
      imagem.data[indice + 1] = variacao
      imagem.data[indice + 2] = variacao
      imagem.data[indice + 3] = 255
    }
  }
  contexto.putImageData(imagem, 0, 0)
  const textura = prepararTextura(canvas, 5, 2)
  textura.colorSpace = THREE.NoColorSpace
  return textura
}
