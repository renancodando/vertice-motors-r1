import * as THREE from 'three'

export function criarMaterialFluxo() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      tempo: { value: 0 },
      intensidade: { value: 0.38 },
      cor: { value: new THREE.Color('#d7d9d5') }
    },
    vertexShader: `
      uniform float tempo;
      attribute float escala;
      varying float vida;
      void main() {
        vec3 p = position;
        p.x = 6.0 - mod(position.x + tempo * 2.7 + 6.0, 12.0);
        float corpo = 1.0 - smoothstep(2.7, 3.35, abs(p.x));
        float zonaLateral = 1.0 - smoothstep(0.75, 1.85, abs(p.z));
        float desvio = corpo * zonaLateral;
        p.z += sign(p.z + 0.001) * desvio * (0.24 + (1.0 - clamp(p.y / 2.2, 0.0, 1.0)) * 0.22);
        p.y += desvio * (0.18 + cos(p.x * 1.1) * 0.04);
        p.y += sin(p.z * 2.0 + tempo * 1.4) * 0.025;
        vida = fract((position.x + tempo * 1.3) * 0.16);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = escala * (145.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 cor;
      uniform float intensidade;
      varying float vida;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float alpha = smoothstep(0.5, 0.0, d) * intensidade * smoothstep(0.0, 0.22, vida) * smoothstep(1.0, 0.72, vida);
        gl_FragColor = vec4(cor, alpha);
      }
    `
  })
}

export function criarMaterialEnergia() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      tempo: { value: 0 },
      cor: { value: new THREE.Color('#c68b38') },
      intensidade: { value: 1 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float tempo;
      uniform vec3 cor;
      uniform float intensidade;
      varying vec2 vUv;
      void main() {
        float pulso = smoothstep(0.18, 0.0, abs(fract(vUv.x * 2.0 - tempo * 0.8) - 0.5));
        float borda = smoothstep(0.5, 0.05, abs(vUv.y - 0.5));
        gl_FragColor = vec4(cor, pulso * borda * intensidade);
      }
    `
  })
}

export function criarMaterialMostruario(tipo = 'carbono') {
  const parametros = {
    carbono: { base: '#1b1b1a', metal: 0.88, rugosidade: 0.24 },
    titanio: { base: '#696b6a', metal: 0.98, rugosidade: 0.3 },
    aluminio: { base: '#a7a8a4', metal: 0.94, rugosidade: 0.38 }
  }[tipo]

  const material = new THREE.MeshPhysicalMaterial({
    color: parametros.base,
    metalness: parametros.metal,
    roughness: parametros.rugosidade,
    clearcoat: tipo === 'carbono' ? 0.55 : 0.12,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.2
  })

  material.anisotropy = tipo === 'carbono' ? 0.65 : tipo === 'aluminio' ? 0.32 : 0.12
  material.onBeforeCompile = shader => {
    shader.vertexShader = `varying vec2 vUvVertice;\n` + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvUvVertice = uv;')
    shader.fragmentShader = `varying vec2 vUvVertice;\n` + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      `#include <roughnessmap_fragment>
      vec2 padrao = vUvVertice * ${tipo === 'carbono' ? '95.0' : tipo === 'titanio' ? '28.0' : '120.0'};
      float micro = sin(padrao.x + sin(padrao.y * 0.75) * 0.8) * ${tipo === 'carbono' ? '0.035' : tipo === 'titanio' ? '0.018' : '0.026'};
      roughnessFactor = clamp(roughnessFactor + micro, 0.08, 0.85);`
    )
    material.userData.shader = shader
  }
  material.customProgramCacheKey = () => `vertice-${tipo}`
  return material
}
