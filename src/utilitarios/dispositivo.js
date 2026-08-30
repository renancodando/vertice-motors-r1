export function detectarCapacidade() {
  const toque = matchMedia('(pointer: coarse)').matches
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches
  const memoria = navigator.deviceMemory || 8
  const nucleos = navigator.hardwareConcurrency || 8
  const fraco = reduzido || memoria <= 4 || nucleos <= 4
  const pixelRatio = Math.min(devicePixelRatio || 1, fraco ? 1.25 : toque ? 1.5 : 1.8)
  document.documentElement.classList.toggle('modo-toque', toque)
  document.documentElement.classList.toggle('modo-reduzido', fraco)
  return { toque, reduzido, fraco, pixelRatio }
}
