export const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor))
export const interpolar = (inicio, fim, t) => inicio + (fim - inicio) * t
export const suavizar = (valorAtual, alvo, velocidade) => valorAtual + (alvo - valorAtual) * velocidade
export const normalizar = (valor, inicio, fim) => limitar((valor - inicio) / (fim - inicio), 0, 1)
