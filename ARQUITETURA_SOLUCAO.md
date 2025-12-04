# **🏛️ Arquitetura da Solução ContentGen Scomfort**

Esta solução implementa um pipeline de IA Generativa com uma camada de processamento de dados internos (simulando um Data Layer) antes da chamada ao Modelo de Linguagem Grande (LLM).

## **Componentes Chave**

1. **Frontend (Interface do Usuário):** Aplicação Web desenvolvida em HTML/CSS/JavaScript.  
2. **Backend (API de Serviço):** API RESTful desenvolvida em **Python** utilizando o framework **Flask**.  
3. **Data Layer (Dados Internos):** Arquivos CSV (scomfort\_clientes.csv e scomfort\_produtos.csv).  
4. **Arquivos de Configuração:** Arquivos cruciais para o ambiente (.env e requirements.txt).  
5. **Modelo de IA:** Google Gemini (modelo gemini-2.0-flash).

## **Fluxo de Dados (Data Flow Diagram)**

O fluxo da solução é um ciclo de *Request* (Requisição) \-\> *Contextualização* \-\> *Generation* (Geração).

### **1\. Requisição do Usuário (Frontend ⮕ Backend)**

* O usuário preenche as instruções na Interface (Frontend).  
* Um evento JavaScript é disparado, fazendo uma chamada POST HTTP para o endpoint /generate da API Flask.

### **2\. Processamento e Contextualização (Backend: Pandas & Lógica)**

* A API Flask (backend\_api.py) recebe as instruções do usuário.  
* **Análise de Dados:** A função identificar\_produto\_na\_frase tenta extrair o nome do produto (ex: 'Runner').  
* **Busca de Contexto:** Se o produto for identificado, as funções buscar\_dados\_produto (que usa scomfort\_produtos.csv) e buscar\_publico\_alvo (que usa scomfort\_clientes.csv) são executadas.  
  * **Resultado do Contexto:** Dados de performance do produto e, crucialmente, a **profissão mais comum** entre os clientes e a **média de satisfação**.

### **3\. Engenharia de Prompt (Backend: Prompt Engineering)**

* O backend constrói o *prompt* final:  
  * **Instruções da Marca:** "Aja como copywriter sênior da Scomfort..."  
  * **Contexto:** Injeta as informações reais obtidas dos CSVs (Preço, Estoque, Público-Alvo principal).

### **4\. Geração de Conteúdo (Backend ⮕ Gemini API)**

* A API Flask envia o prompt enriquecido para a **API do Google Gemini** (gemini-2.0-flash).  
* O modelo de IA gera as opções de texto solicitadas, utilizando os dados internos como base para criar um conteúdo mais persuasivo e direcionado.

### **5\. Resposta e Exibição (Backend ⮕ Frontend)**

* O resultado da IA é recebido pelo Backend.  
* A API Flask retorna o texto gerado em formato JSON para o Frontend.  
* O JavaScript do Frontend exibe as diferentes opções de conteúdo na tela.

## **🔑 Inovação Técnica (Data Grounding)**

A inovação principal está na camada de "Data Layer". Ao invés de depender apenas de informações gerais, a solução usa dados proprietários (Customer Data) para influenciar o tom e o foco do conteúdo gerado pela IA. Isso aumenta a **Aplicabilidade** e a **Viabilidade Comercial** da solução.