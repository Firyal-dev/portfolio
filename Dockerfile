from node:20-alpine as builder
workdir /app
copy package*.json ./
run npm install
copy . .
run npm run build

from nginx:alpine
copy --from=builder /app/out /usr/share/nginx/html
expose 80
cmd ["nginx", "-g", "daemon off;"]