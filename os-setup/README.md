# Mundo da Yoyo como Sistema Operacional Educacional

Este guia transforma o **Mundo da Yoyo** em uma experiência semelhante a um sistema operacional infantil: ao ligar o computador, a criança entra direto nas atividades, sem precisar lidar com área de trabalho, login ou navegador.

## Como funciona

A ideia é usar o **Linux Mint** como base, configurar um login automático e abrir o navegador em **modo quiosque** (tela cheia, sem endereço, sem menus) já no jogo. O adulto mantém acesso ao sistema com um atalho de segurança.

## Requisitos

- Um computador antigo ou simples (PC, notebook ou Raspberry Pi)
- Linux Mint, Lubuntu ou qualquer Linux baseado em Ubuntu instalado
- Conexão com a internet (para carregar o jogo pelo GitHub Pages) ou os arquivos locais do projeto

## Instalação rápida

1. No Linux Mint, copie a pasta `os-setup` para uma localização, por exemplo:

```bash
/home/seu-usuario/Downloads/os-setup
```

2. Abra o terminal e **entre na pasta** do script:

```bash
cd /home/seu-usuario/Downloads/os-setup
```

> Substitua `seu-usuario` pelo nome do seu usuário.

3. Se o arquivo veio do Windows, corrija as quebras de linha:

```bash
sed -i 's/\r$//' setup-kiosk.sh
```

4. Tome o script executável:

```bash
chmod +x setup-kiosk.sh
```

5. Execute o script com privilégios de administrador:

```bash
sudo bash setup-kiosk.sh
```

6. Reinicie o computador. O Mundo da Yoyo abrirá sozinho, em tela cheia.

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

## Para sair do modo quiosque

- **Ctrl+Alt+T** abre o terminal para o adulto fazer ajustes.
- Para desligar o computador, segure o botão de energia ou use o terminal com `poweroff`.

## Sugestão avançada: Raspberry Pi

No Raspberry Pi, o processo é parecido. Instale o Raspberry Pi OS Lite e configure o navegador Chromium para abrir no boot. A vantagem é custo baixo e tamanho pequeno para uma mesinha de criança.
