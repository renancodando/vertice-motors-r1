export function criarMenu(gsap, irPara) {
  const botao = document.querySelector('#botao-menu')
  const menu = document.querySelector('#menu')
  let aberto = false

  function definirAberto(valor) {
    aberto = valor
    botao.setAttribute('aria-expanded', String(aberto))
    botao.textContent = aberto ? 'FECHAR' : 'MENU'
    document.body.classList.toggle('menu-aberto', aberto)
    gsap.to(menu, { autoAlpha: aberto ? 1 : 0, duration: .45, ease: 'power3.out' })
  }

  botao.addEventListener('click', () => definirAberto(!aberto))
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', evento => {
    evento.preventDefault()
    const alvo = document.querySelector(link.getAttribute('href'))
    definirAberto(false)
    irPara(alvo)
  }))

  return { definirAberto }
}
