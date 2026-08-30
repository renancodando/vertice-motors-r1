# VÉRTICE MOTORS — R1

Experiência web cinematográfica para o lançamento fictício do superesportivo elétrico brasileiro VÉRTICE R1.

## Stack

- Vite
- HTML5 semântico
- CSS moderno
- JavaScript modular
- Three.js / WebGL
- GLSL shaders
- Canvas API
- GSAP + ScrollTrigger
- Lenis
- Vercel

## Principais experiências

- abertura quase escura com revelação progressiva do veículo
- câmera cinematográfica contínua sincronizada ao scroll
- fluxo aerodinâmico com partículas WebGL e Canvas
- shader de distorção do ar e heat haze sutil
- micro motion blur ligado à velocidade do scroll
- aerodinâmica ativa
- exploded view mecânico e reversível
- carroceria translúcida durante a visualização do powertrain
- pulso de energia bateria → inversor → motores → rodas
- materiais com microvariações de reflexão
- entrada de câmera no cockpit
- HUD automotivo em Canvas
- configurador em tempo real de cor, rodas, interior e acabamento
- rotação do veículo por mouse ou touch
- cursor de telemetria
- botões magnéticos e microinterações
- loop visual no fim da experiência
- adaptação de pixel ratio e quantidade de partículas conforme o dispositivo
- suporte a `prefers-reduced-motion`
- fallback sem WebGL mantendo conteúdo e Canvas

## Estrutura

```text
vertice-motors-r1/
├── public/
│   ├── favicon.svg
│   ├── og-vertice-r1.png
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── cena/
│   ├── dados/
│   ├── estilos/
│   ├── experiencia/
│   ├── interface/
│   ├── shaders/
│   ├── utilitarios/
│   └── principal.js
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Executar localmente

```bash
npm install
npm run dev
```

Para gerar o pacote de produção:

```bash
npm run build
npm run preview
```

## Publicar na Vercel

Importe o repositório na Vercel. O projeto já contém `vercel.json`, comando de build e diretório de saída configurados.

Também é possível usar a CLI:

```bash
npm install -g vercel
vercel
vercel --prod
```

## SEO antes do domínio definitivo

O projeto usa `https://vertice-motors.vercel.app/` como domínio canônico fictício. Se o endereço final for diferente, altere o canonical, Open Graph URL, JSON-LD, `robots.txt` e `sitemap.xml`.

## Modelos e texturas

A versão entregue constrói o R1 proceduralmente em Three.js, então não depende de um GLB para abrir. Por isso Draco e KTX2 não são necessários no build padrão. Se um modelo automotivo de produção for incorporado depois, a arquitetura já separa cena, modelo, shaders e utilitários para permitir a substituição sem reescrever a narrativa.

## Observação de design

Todo o conteúdo textual permanece no DOM e indexável. Canvas e WebGL são usados como camada cinematográfica, não como substitutos do conteúdo semântico.
