FROM node:14.7-stretch
ADD package.json .
RUN yarn install
ADD . .
RUN yarn build

FROM nginx:1.19-alpine
ADD nginx.conf /etc/nginx/nginx.conf
# COPY --from=0 dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]