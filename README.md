# 🌌 Janela Cósmica

## Autor

**Lays Evangelista Sales** — Matrícula: 22551447

## Descrição

A **Janela Cósmica** é uma aplicação web interativa que permite escolher uma data e visualizar a *Astronomy Picture of the Day* (APOD), disponibilizada diariamente pela NASA. A aplicação apresenta a imagem ou vídeo astronômico, o título, a data, a explicação científica e os créditos da mídia.

Na **Etapa 02**, o projeto evoluiu com a integração do **Supabase** para persistência de dados (favoritos) e a **containerização com Docker**, utilizando o **Nginx** como servidor web.

---

## 🚀 Funcionalidades

### Funcionalidades da Aplicação & API
- Consulta da imagem astronômica por data.
- Botão para consultar a imagem de hoje.
- Exibição do título, data e tipo de mídia.
- Exibição da explicação científica e dos créditos.
- Link para abrir a mídia original.
- Tratamento de erros amigável.
- Layout responsivo para computador e celular.
- **Sistema de Favoritos (Etapa 02):** Permite salvar e remover imagens favoritas com persistência na nuvem via Supabase.

### Requisitos & Sidequests de Infraestrutura (Etapa 02)
- **Containerização:** Aplicação empacotada em container leve usando Nginx (`nginx:alpine`).
- **SQ1 - Otimização com `.dockerignore`:** Exclusão de arquivos desnecessários (`.git`, `README.md`, imagens) na construção da imagem Docker.
- **SQ2 & SQ3 - Publicação e Versionamento no Docker Hub:** Imagem publicada e versionada com as tags `1.0`, `1.1` e `latest`.
- **SQ4 - Execução Multicontainer:** Execução simultânea da aplicação em portas diferentes (`8080` e `8081`).

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Banco de Dados & APIs:** 
  - NASA APOD API
  - Supabase (Persistência dos favoritos na nuvem)
- **DevOps & Containerização:**
  - Docker & Docker Desktop (WSL 2)
  - Nginx (Alpine)
  - Docker Hub
- **Hospedagem & Controle de Versão:** GitHub & GitHub Pages

---

## 🌐 API Utilizada

- **Nome:** NASA Astronomy Picture of the Day — APOD
- **Portal:** https://api.nasa.gov/
- **Documentação:** https://github.com/nasa/apod-api
- **Endpoint utilizado:** `https://api.nasa.gov/planetary/apod`

### Parâmetros Utilizados
- `api_key`: chave de acesso da API
- `date`: data escolhida pelo usuário (`YYYY-MM-DD`)
- `thumbs`: permite obter miniatura quando o conteúdo é um vídeo (`thumbs=true`)

---

## 🐳 Como Executar

### Opção 1: Execução via Docker (Recomendado)

1. **Baixar a imagem do Docker Hub:**
   ```bash
   docker pull layssales/bootcamp2-app:latest
 
