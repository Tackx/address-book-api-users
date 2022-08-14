FROM node:16 as development

ARG NODE_ENV=development

WORKDIR /usr/src/users

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE ${DEV_PORT}

FROM node:16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/users

RUN mkdir -p logs \
    && chown -R node logs \
    && chgrp -R node logs

COPY --chown=node:node package*.json ./

RUN npm ci --only=production

COPY --chown=node:node --from=development /usr/src/users/dist ./dist/

USER node

EXPOSE ${PROD_PORT}

CMD ["npm", "run", "start"]