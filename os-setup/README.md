# Mundo da Yoyo como Sistema Operacional Educacional

Este guia transforma o **Mundo da Yoyo** em uma experiência semelhante a um sistema operacional infantil: ao ligar o computador, a criança entra direto nas atividades, sem precisar lidar com área de trabalho, login ou navegador.

## Como funciona

A ideia é usar o **Linux Mint** como base, configurar um login automático e abrir o navegador em **modo quiosque** (tela cheia, sem endereço, sem menus) já no jogo. O adulto mantém acesso ao sistema com um atalho de segurança.

## Requisitos

- Um computador antigo ou simples (PC, notebook ou Raspberry Pi)
- Linux Mint, Lubuntu ou qualquer Linux baseado em Ubuntu instalado
- Conexão com a internet (para carregar o jogo pelo GitHub Pages) ou os arquivos locais do projeto

## Modo de instalação

Existem duas formas de usar:

### Opção 1 — Online (mais simples, precisa de internet)

Usa o jogo publicado no GitHub Pages. Ideal se o notebook tiver internet.

1. No Linux Mint, copie a pasta `os-setup` para uma localização, por exemplo `/home/seu-usuario/Downloads/os-setup`.
2. Abra o terminal e **entre na pasta**:

```bash
cd /home/seu-usuario/Downloads/os-setup
```

3. Corrija as quebras de linha se o arquivo veio do Windows:

```bash
sed -i 's/\r$//' setup-kiosk.sh
```

4. Execute com privilégios de administrador:

```bash
sudo bash setup-kiosk.sh
```

> Antes, ative o GitHub Pages em `Settings > Pages` do repositório.

### Opção 2 — Offline (não precisa de internet depois da instalação)

Baixa o projeto inteiro para o computador e abre os arquivos locais. Melhor se o notebook não tiver internet estável.

1. Copie a pasta `os-setup` para o Linux Mint.
2. Abra o terminal dentro da pasta `os-setup`.
3. Corrija as quebras de linha:

```bash
sed -i 's/\r$//' setup-kiosk-local.sh
```

4. Execute:

```bash
sudo bash setup-kiosk-local.sh
```

Esse script instala o `git`, clona o repositório para `/home/yoyo/MundoDaYoyo` e aponta o navegador para os arquivos locais.

5. Reinicie o computador. O Mundo da Yoyo abrirá sozinho, em tela cheia.

## O que o script faz

- Instala o navegador Chromium (se ainda não estiver instalado)
- Cria um usuário chamado `yoyo` com login automático
- Configura o navegador para abrir em modo quiosque no endereço do jogo
- Desliga a tela de bloqueio e a suspensão
- Cria uma saída de emergência para o adulto: pressione **Ctrl+Alt+T** para abrir o terminal

## Endereço do jogo

Por padrão, o script usa a versão publicada no GitHub Pages:

```
https://douglasherzog.github.io/MundoDaYoyo
```

Se você quiser rodar localmente, edite o arquivo `mundodayoyo-kiosk.sh` e troque a URL para o caminho local do `index.html`, por exemplo:

```bash
file:///home/yoyo/MundoDaYoyo/index.html
```

## Controle para o adulto

Dentro do Mundo da Yoyo, o adulto pode usar atalhos ocultos:

- **Ctrl+Alt+T** — abre o terminal para manutenção
- **Ctrl+Shift+A** — abre o painel administrativo com:
  - ajuste de volume do sistema
  - botão para reiniciar
  - botão para desligar

## Para sair do modo quiosque

- **Ctrl+Alt+T** abre o terminal para o adulto fazer ajustes.
- **Ctrl+Shift+A** abre o painel com botão de desligar.

## Sugestão avançada: Raspberry Pi

No Raspberry Pi, o processo é parecido. Instale o Raspberry Pi OS Lite e configure o navegador Chromium para abrir no boot. A vantagem é custo baixo e tamanho pequeno para uma mesinha de criança.
