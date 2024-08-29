# Projeto de Aplicativo de Exposição a Campo Eletromagnético

Este projeto é um aplicativo de calculo da exposição a campos eletromagnéticos desenvolvido com React Native. O aplicativo utiliza mapas interativos para exibir torres de comunicação e suas áreas de alcance com base em dados fornecidos e calcula a exposição que o ser humano sofre. 

## Funcionalidades

- Exibe torres de comunicação em um mapa interativo.
- Permite ao usuário clicar em um ponto do mapa para visualizar as torres próximas.
- Calcula e exibe círculos de alcance ao redor das torres.
- Mostra uma tabela com informações sobre as torres próximas ao ponto clicado.

## Tecnologias Utilizadas

- **React Native**: Framework para construção de aplicativos móveis.
- **react-native-maps**: Biblioteca para integração de mapas no React Native.
- **Expo**: Plataforma para desenvolvimento e execução de aplicativos React Native.
- **@react-navigation/native**: Biblioteca para navegação em aplicativos React Native.

## Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente.

1. **Clone o Repositório**

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2. **Instale as Dependências**

    Se você está usando o Expo:

    ```bash
    expo install react-native-maps @react-navigation/native react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
    ```

    Se você não está usando o Expo, execute:

    ```bash
    npm install @react-navigation/native @react-navigation/stack react-native-maps react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
    ```

3. **Configure o Projeto**

    Se você está usando o Expo, o projeto deve estar pronto para execução após a instalação das dependências.

    Se você não está usando o Expo, pode ser necessário realizar configurações adicionais para integrar o `react-native-maps` com o seu projeto. Consulte a [documentação oficial do react-native-maps](https://github.com/react-native-maps/react-native-maps) para detalhes.

4. **Execute o Projeto**

    Se estiver usando o Expo:

    ```bash
    expo start
    ```

    Se não estiver usando o Expo:

    ```bash
    npm start
    ```

## Estrutura do Projeto

- **/src**: Contém o código fonte do aplicativo.
  - **/components**: Componentes reutilizáveis, como `MapView`, `Botoes` e `Tabela`.
  - **/data**: Arquivos de dados JSON utilizados pelo aplicativo.
  - **/utils**: Funções utilitárias para cálculos e processamento de dados.
- **App.js**: Componente principal do aplicativo que gerencia o estado e a renderização do mapa.
- **index.js**: Ponto de entrada do aplicativo.

---

Obrigado por conferir o projeto!

