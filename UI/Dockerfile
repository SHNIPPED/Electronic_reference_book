# ---- Этап 1: Сборка React-приложения ----
FROM node:20-alpine AS build

WORKDIR /app/react-intro

# Копируем package.json
COPY react-intro/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY react-intro/ ./

# Собираем приложение
RUN npm run build

# Проверяем, что сборка создала файлы
RUN ls -la build/ && echo "Build"

#Раздача статики через Nginx
FROM nginx:alpine

# Копируем собранные файлы из этапа build
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
