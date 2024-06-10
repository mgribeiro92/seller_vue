# Usa a imagem oficial do Node.js
FROM node:16

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia os arquivos da aplicação para o diretório de trabalho
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Exponha a porta que a aplicação vai rodar
EXPOSE 5174

# Comando para iniciar a aplicação
CMD ["npm", "run", "serve"]
