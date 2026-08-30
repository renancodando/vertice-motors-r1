export function criarCursor(capacidade) {
  const cursor = document.querySelector('#cursor')
  const texto = document.querySelector('#cursor-texto')
  if (!cursor || capacidade.toque) return { atualizar: () => {} }

  let x = innerWidth / 2
  let y = innerHeight / 2
  let alvoX = x
  let alvoY = y

  addEventListener('pointermove', evento => {
    alvoX = evento.clientX
    alvoY = evento.clientY
  }, { passive: true })

  document.querySelectorAll('[data-cursor]').forEach(elemento => {
    elemento.addEventListener('pointerenter', () => {
      cursor.classList.add('ativo')
      texto.textContent = elemento.dataset.cursor || ''
    })
    elemento.addEventListener('pointerleave', () => {
      cursor.classList.remove('ativo')
      texto.textContent = ''
    })
  })

  function atualizar() {
    x += (alvoX - x) * .18
    y += (alvoY - y) * .18
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  }

  return { atualizar }
}
