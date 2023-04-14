# identifica qual versão da máquina vai ser utilizado (alpine é uma versão bem reduzida quase sem funcionalidade do SO além do node sendo bem mais leve)
FROM node:alpine 

#define qual diretório da máquina vai ser trabalhado
WORKDIR usr/app

#Copia os packeges pra dentro da máquina
COPY package*.json ./
RUN npm install

COPY . .

#Define qual a porta o servidor vai expor pra máquina acessar
EXPOSE 3000

#Define qual comando o servidor precisa rodar pra aplicação entrar no ar
CMD ["npm", "start"]
