# Use a imagem oficial do Node.js LTS
FROM node:18-alpine

# Crie o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código fonte
COPY . .

# Compile o TypeScript
RUN npm run build

# Exponha a porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"] 