import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const shaderCinema = {
  uniforms: {
    tDiffuse: { value: null },
    tempo: { value: 0 },
    distorcao: { value: 0 },
    movimento: { value: 0 },
    foco: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float tempo;
    uniform float distorcao;
    uniform float movimento;
    uniform float foco;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float faixa = smoothstep(0.18, 0.58, uv.y) * (1.0 - smoothstep(0.76, 0.98, uv.y));
      float onda = sin(uv.y * 92.0 + tempo * 2.4) * 0.0008 + sin(uv.x * 48.0 - tempo * 1.7) * 0.00055;
      vec2 deslocamentoAr = vec2(onda * faixa * distorcao, onda * 0.32 * distorcao);
      vec2 direcao = vec2(0.0012 * movimento, -0.00035 * movimento);
      vec4 cor = texture2D(tDiffuse, uv + deslocamentoAr) * 0.52;
      cor += texture2D(tDiffuse, uv + deslocamentoAr - direcao) * 0.2;
      cor += texture2D(tDiffuse, uv + deslocamentoAr - direcao * 2.0) * 0.12;
      cor += texture2D(tDiffuse, uv + deslocamentoAr + direcao) * 0.1;
      cor += texture2D(tDiffuse, uv + deslocamentoAr + direcao * 2.0) * 0.06;
      float distanciaCentro = length(uv - vec2(0.5));
      float desfoquePeriferico = smoothstep(0.4, 0.78, distanciaCentro) * foco;
      vec4 vizinha = texture2D(tDiffuse, mix(uv, vec2(0.5), desfoquePeriferico * 0.008));
      cor = mix(cor, vizinha, desfoquePeriferico * 0.24);
      gl_FragColor = cor;
    }
  `
}

export function criarPosProcessamento(renderizador, cena, camera, capacidade) {
  if (capacidade.fraco) {
    return {
      atualizar: () => {},
      redimensionar: () => {},
      renderizar: () => renderizador.render(cena, camera)
    }
  }

  const compositor = new EffectComposer(renderizador)
  compositor.addPass(new RenderPass(cena, camera))
  const passeCinema = new ShaderPass(shaderCinema)
  compositor.addPass(passeCinema)
  compositor.addPass(new OutputPass())

  function atualizar(tempo, efeitos, velocidade) {
    passeCinema.uniforms.tempo.value = tempo
    passeCinema.uniforms.distorcao.value += ((efeitos.fluxo > .4 ? efeitos.fluxo : 0) - passeCinema.uniforms.distorcao.value) * .08
    const alvoMovimento = Math.min(1, Math.abs(velocidade) / 32)
    passeCinema.uniforms.movimento.value += (alvoMovimento - passeCinema.uniforms.movimento.value) * .1
    const alvoFoco = efeitos.cockpit ? .55 : efeitos.materiais > .1 ? .26 : .08
    passeCinema.uniforms.foco.value += (alvoFoco - passeCinema.uniforms.foco.value) * .06
  }

  function redimensionar() {
    compositor.setSize(innerWidth, innerHeight)
    compositor.setPixelRatio(Math.min(capacidade.pixelRatio, 1.5))
  }

  redimensionar()
  return { atualizar, redimensionar, renderizar: () => compositor.render() }
}
