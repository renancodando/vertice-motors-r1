export function criarVisibilidade() {
  const estado = new Map()
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      estado.set(entrada.target.id, entrada.isIntersecting)
      entrada.target.classList.toggle('visivel', entrada.isIntersecting)
    })
  }, { rootMargin: '35% 0px 35% 0px', threshold: 0.01 })

  document.querySelectorAll('.secao').forEach(secao => {
    estado.set(secao.id, false)
    observador.observe(secao)
  })

  return {
    estaVisivel: id => estado.get(id) === true,
    destruir: () => observador.disconnect()
  }
}
