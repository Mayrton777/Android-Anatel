# Como executar o projeto  

1. **Clone o Repositório**  

    ```bash
    git clone https://github.com/Mayrton777/Android-Anatel.git
    cd Android-Anatel/app/
    ```  

2. **Instale as Dependências**  

    ```bash
    npm i
    ```  

    Este projeto utiliza o Expo. Caso não tenha instalado, utilize o seguinte comando:  

    ```bash
    npm install -g expo-cli
    ```  

3. **Utilizando o emulador do Android Studio**  

   No Android Studio, inicie o emulador seguindo os passos:  
   * Clique em **More Actions**  
   * Acesse **Virtual Device Manager**  
   * Clique em **Start**  
   * Com o emulador em execução, execute o seguinte comando:  

    ```bash
    npx expo start
    ```  

   * Após iniciar o servidor, pressione **a** para abrir o aplicativo no emulador.  

4. **Utilizando o aplicativo Expo Go no seu celular (Android ou iOS)**  

   * Baixe o aplicativo **Expo Go**  
   * No seu computador, execute o comando:  

    ```bash
    npx expo start
    ```  

   * No aplicativo **Expo Go**, escaneie o QR code ou digite o código IP. Exemplo:  

    ```
    exp://192.168.1.3:8080
    ```  
