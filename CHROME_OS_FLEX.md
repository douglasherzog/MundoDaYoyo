# Chrome OS Flex - Teste no Notebook da Yoyo

Este guia explica como criar um pendrive bootavel com Chrome OS Flex para testar no notebook sem apagar o Linux Mint.

## O que é o Chrome OS Flex?

Chrome OS Flex é uma versão gratuita do Chrome OS da Google que pode ser instalada em notebooks antigos. O sistema inicia direto no navegador Chrome, ideal para rodar o Mundo da Yoyo de forma rapida e segura.

> **Aviso importante:** a instalacao do Chrome OS Flex apaga todo o disco. Neste guia vamos apenas **testar pelo pendrive**, sem instalar, preservando o Linux Mint.

## Requisitos

- Pendrive USB de pelo menos **8 GB** (será formatado)
- Notebook da Yoyo
- Acesso a internet no momento da criacao do pendrive
- Computador com Windows, Linux ou Chrome OS para criar o pendrive

## Passo a passo para criar o pendrive no Windows

1. **Baixe a ferramenta oficial**
   - Acesse: https://chromeos.google/products/chromeos-flex/
   - Clique em **"Comece agora"** ou **"Download"**
   - Ou instale a extensao oficial no Chrome: **Chromebook Recovery Utility**
     - Link: https://chromewebstore.google.com/detail/chromebook-recovery-utili/pocpnlppkickdkcmuniobaapebpomelo

2. **Abra a Chromebook Recovery Utility**
   - Clique na engrenagem (⚙️) no canto superior direito
   - Selecione **"Use local image"** (usar imagem local)
   - Escolha o arquivo `.bin` do Chrome OS Flex baixado

3. **Prepare o pendrive**
   - Insira o pendrive de 8 GB ou mais
   - **Atencao:** todos os dados do pendrive serão apagados
   - Na ferramenta, selecione o modelo do pendrive
   - Clique em **"Create now"** e aguarde o processo terminar

4. **Inicie o notebook pelo pendrive**
   - Insira o pendrive no notebook da Yoyo
   - Reinicie o notebook
   - Durante a inicializacao, pressione a tecla de boot (varia por marca):
     - **Acer:** F12
     - **Asus:** ESC ou F8
     - **Dell:** F12
     - **HP:** ESC ou F9
     - **Lenovo:** F12 ou Fn + F12
     - **Samsung:** F10
     - Outras marcas: tente ESC, F2, F10 ou F12
   - Selecione o pendrive na lista de dispositivos de boot

5. **Teste o Chrome OS Flex**
   - O sistema iniciará direto do pendrive
   - Escolha **"Try Chrome OS Flex"** (experimentar sem instalar)
   - Aguarde a tela de boas-vindas
   - Faca login com uma conta Google ou use o modo visitante
   - Abra o Chrome e acesse: https://douglasherzog.github.io/MundoDaYoyo/

## Depois do teste

- Para voltar ao Linux Mint, basta **desligar o notebook**, remover o pendrive e ligar novamente.
- O Linux Mint continua intacto no disco interno.

## Se quiser instalar de verdade

Se o teste agradar e você quiser instalar o Chrome OS Flex no notebook:

1. Faça backup de todos os dados importantes do Linux Mint
2. Inicie pelo pendrive novamente
3. Na tela inicial, escolha **"Install Chrome OS Flex"**
4. Siga as instrucoes — **isso apagara o disco inteiro**

## Dica

Para uma experiencia melhor no teste, use um pendrive **USB 3.0** ou um SSD externo via USB. Pendrives lentos deixam o sistema travando.
