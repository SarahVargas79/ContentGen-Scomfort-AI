# **🤖 ContentGen Scomfort: Assistente de Conteúdo com IA Generativa**

### **Visão Geral**

O ContentGen Scomfort é uma solução de Inteligência Artificial (IA) desenvolvida para auxiliar a equipe de Marketing da Scomfort na criação de conteúdo promocional e informativo (descrições, FAQs, posts de redes sociais).

A principal inovação da solução reside na integração dos dados internos da empresa (dados de clientes e produtos) diretamente no *prompt* da IA (Gemini), garantindo que o conteúdo gerado seja **altamente segmentado, baseado em dados reais de vendas e alinhado com a marca Scomfort**.

## **🚀 Requisitos e Configuração**

### **Pré-requisitos**

* Python 3.8+ (Recomendado)  
* pip (Gerenciador de pacotes do Python)  
* **Chave de API do Google Gemini** (Necessária para rodar a IA)

### **1\. Estrutura de Pastas**

Certifique-se de que a estrutura do projeto está organizada como segue:

projeto\_scomfort/  
├── backend/  
│   ├── .env  
│   ├── backend\_api.py  
│   ├── requirements.txt  \<-- Arquivo a ser usado para instalação  
│   └── dados/  
│       ├── scomfort\_clientes.csv  
│       └── scomfort\_produtos.csv  
└── frontend/  
    ├── index.html  
    ├── img/  
    ├── css/  
    ├── js/  
    └── data/

### **2\. Instalação de Dependências**

Navegue até a pasta backend e instale as bibliotecas Python necessárias:

cd backend  
pip install \-r requirements.txt

### **3\. Configuração da Chave de API**

Crie ou edite o arquivo **.env** dentro da pasta backend e insira sua chave de API do Gemini:

\# Conteúdo do arquivo backend/.env  
GEMINI\_API\_KEY \= SUA\_CHAVE\_AQUI

### **4\. Execução da Solução**

1. **Inicie o Backend:** A partir da pasta backend, execute o script principal. O servidor iniciará na porta 5000.  
   python backend\_api.py

2. **Acesse o Frontend:** Abra a interface do usuário no seu navegador.  
   \[http://127.0.0.1:5000/\](http://127.0.0.1:5000/)

## **💡 Instruções de Uso da Interface**

1. **Instruções do Tênis / Tópico:** Insira uma descrição detalhada do produto (cor, material, tecnologias, estilo, uso ideal).  
2. **Botões de Exemplo:** Use os botões Exemplo 1, Exemplo 2, etc., para carregar exemplos de *prompts* pré-definidos (que estão em frontend/data/exemplos.json).  
3. **Tipo de Conteúdo e Opções:** Selecione o formato desejado (Descrição Curta, FAQ, etc.) e o número de opções para gerar.  
4. **Gerar:** Clique em GERAR TEXTOS SCOMFORT. O resultado aparecerá na área de "Conteúdo Gerado".

**Dica de Multitarefa:** Tente incluir o nome do modelo do tênis (Classic, Runner, Slip-on) nas instruções para ativar a busca por dados internos e obter resultados mais direcionados\!

## **🛠️ Arquitetura da Solução**

O ContentGen Scomfort utiliza uma arquitetura simples de API REST (Backend/Frontend) integrada à IA. Para detalhes sobre o fluxo de dados, consulte o arquivo ARQUITETURA\_SOLUCAO.md.# ContentGen-Scomfort-AI
