# Mundo da Yoyo — Documentação Técnica

## Visão Geral

Projeto educativo para crianças pré-alfabetizadas (3+ anos). 35 jogos em vanilla JS/HTML/CSS com TTS, sistema de estrelas, mascote animada, conquistas e PWA offline.

## Arquitetura

### Arquivos Core (carregados em todos os jogos)

| Arquivo | Função |
|---------|--------|
| `stars.js` | Sistema de estrelas (acumular, salvar, exibir, animar) |
| `tts.js` | Text-to-speech em pt-BR (Web Speech API + fallback servidor) |
| `sounds.js` | Efeitos sonoros + música de fundo (Web Audio API) |
| `yoyo-mascot.js` | Mascote unicórnio SVG animada com reações e balão de fala |
| `transitions.js` | Transições suaves entre páginas (overlay + fade) |
| `achievements.js` | Sistema de conquistas (badges, colecionáveis, bônus diário) |
| `admin.js` | Painel administrativo (acesso restrito) |
| `sw.js` | Service worker para funcionamento offline (PWA) |
| `manifest.json` | Configuração PWA (display: fullscreen) |

### Ordem de carregamento (em todos os HTML)

```html
<script src="stars.js"></script>
<script src="sounds.js"></script>
<script src="yoyo-mascot.js"></script>
<script src="transitions.js"></script>
<script src="achievements.js"></script>
<script src="tts.js"></script>
<script src="[jogo].js"></script>
<script src="admin.js"></script>
```

### Jogos

35 jogos, cada um com seu `[nome].html` + `[nome].js`. Alguns têm CSS próprio (`unicornio.css`, `semana.css`, `meu-amigo-jesus.css`).

## Sistemas Implementados

### 1. Mascote Yoyo (Fase 1)

- **Arquivo**: `yoyo-mascot.js`
- **API global**: `window.YoyoMascot`
- **Métodos**: `onCorrect()`, `onError()`, `onVictory()`, `celebrate()`, `say(texto)`, `setMood(mood)`, `hide()`, `show()`, `resetStreak()`
- **Humores**: `idle` (padrão), `happy` (acerto), `sad` (erro), `celebrate` (3+ seguidos)
- **Integração automática**: `playSuccess()` e `playError()` em `sounds.js` já chamam `YoyoMascot.onCorrect()` e `onError()`
- **Balão de fala**: frases aleatórias contextuais (acerto, erro, streak, idle)
- **Idle check**: após 15s sem interação, a mascote diz uma frase de incentivo

### 2. Áudio (Fase 2)

- **Arquivo**: `sounds.js`
- **API global**: `BgMusic` (música de fundo)
- **Funções**: `playSuccess()`, `playError()`, `playClick()`, `playPop()`, `playHover()`, `playVictory()`, `playMagic()`, `playMusicNote(freq, dur)`
- **Música de fundo**: melodia lúdica de 16 notas com baixo, loop contínuo via Web Audio API
- **Botão de música**: 🎵 no canto superior esquerdo (toggle on/off)
- **Auto-start**: no primeiro clique/toque (requisito dos navegadores)
- **Som de hover**: automático em todos os botões/cards/links

### 3. Transições (Fase 3)

- **Arquivo**: `transitions.js`
- **Mecanismo**: intercepta cliques em `<a href>`, mostra overlay roxo com unicórnio pulando, navega após 400ms
- **Fade-in**: ao carregar nova página, body faz fade de opacity 0→1
- **Exclusões**: links externos (http), `target="_blank"`, `href="#"`, `data-no-transition`

### 4. Menu Animado (Fase 3)

- **CSS em**: `style.css` (seções `.menu-card`, `.menu-icon`, `@keyframes cardEntrance/iconBounce/titleGlow`)
- **Entrada em cascata**: cards aparecem um por um com delay incremental
- **Hover**: card escala 1.03, brilho radial, ícone pula e rotaciona
- **Título**: glow pulsante rosa

### 5. Conquistas (Fase 4)

- **Arquivo**: `achievements.js`
- **API global**: `window.YoyoAchievements`
- **14 badges**: primeira estrela, 10/50/100 estrelas, streak 3/5/10, 5/10/todos os jogos, 3/7 dias seguidos, jogo perfeito, 5 jogos perfeitos
- **8 colecionáveis**: acessórios do unicórnio (crina rosa, arco-íris, coroa, asas, chifre estelar, etc.) desbloqueados por total de estrelas
- **Bônus diário**: +2 estrelas por dia seguido (máx +10), popup ao abrir o menu
- **Painel de conquistas**: aparece no menu (index.html) abaixo do grid de jogos
- **Popup de badge**: central, com ícone, nome e descrição da conquista
- **Rastreamento**: `localStorage` (`yoyo_stats`, `yoyo_achievements`)
- **Integração**: `adicionarEstrelas()` em `stars.js` chama `YoyoAchievements.trackStars()` automaticamente; `YoyoMascot.onCorrect()` chama `trackStreak()`

### 6. PWA

- **`manifest.json`**: `display: fullscreen`, ícone SVG, theme color
- **`sw.js`**: cache de todos os arquivos para funcionamento offline
- **Versão do cache**: `mundo-yoyo-v4` (bump a cada deploy com novos arquivos)

### 7. Segurança (Chrome OS Flex)

- **`stars.js`** (IIFE no final): bloqueia F11, Esc, F5, Ctrl+R/T/N/W/J, Alt+Home/Left/Right/D, F1-F12, botão direito, drag, select
- **Overlay de fullscreen**: se sair do fullscreen, mostra overlay roxo "Clique aqui para voltar a jogar!"
- **Auto-fullscreen**: no primeiro clique/toque/key

## Como Adicionar um Novo Jogo

1. Criar `nome.html` com a estrutura padrão (incluir todos os scripts core na ordem acima)
2. Criar `nome.js` com a lógica do jogo
3. Usar `playSuccess()` no acerto e `playError()` no erro (a mascote reage automaticamente)
4. Usar `falar(texto)` para instruções em voz alta
5. Usar `adicionarEstrelas(n)` para recompensar (conquistas atualizam automaticamente)
6. Adicionar `<a href="nome.html" class="menu-card">` no `index.html`
7. Adicionar `./nome.html` e `./nome.js` no `sw.js` e bumpar `CACHE_NAME`

## Deploy

- GitHub Pages: `https://douglasherzog.github.io/MundoDaYoyo/`
- Push para `main` branch publica automaticamente
- Para PWA: instalar como app no Chrome (⋮ → Instalar página como app)
