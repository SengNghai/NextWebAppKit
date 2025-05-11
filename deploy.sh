#!/bin/bash

# 设置变量
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"
NEXT_DIR="$HOME/next-app"
PORT=3000

echo "🚀 开始自动部署 Next.js + PM2 + Nginx + SSL (macOS & Linux)"

# 检测系统类型
OS=$(uname -s)
echo "🖥️ 当前系统: $OS"

# 检查 Homebrew 或 APT
if [[ "$OS" == "Darwin" ]]; then
    PACKAGE_MANAGER="brew"
    NGINX_CONFIG="/opt/homebrew/etc/nginx/nginx.conf"
elif [[ "$OS" == "Linux" ]]; then
    PACKAGE_MANAGER="apt"
    NGINX_CONFIG="/etc/nginx/sites-available/next-app"
else
    echo "❌ 不支持的系统类型: $OS"
    exit 1
fi

# 安装 Nginx
echo "🌐 安装 Nginx..."
if [[ "$PACKAGE_MANAGER" == "brew" ]]; then
    brew install nginx
    brew services start nginx
else
    sudo apt update && sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl restart nginx
fi

# 安装 PM2
echo "⚙️ 安装 PM2..."
npm install -g pm2

# 配置 Nginx
echo "📝 配置 Nginx..."
sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Linux 需要额外配置 Nginx
if [[ "$OS" == "Linux" ]]; then
    sudo ln -s /etc/nginx/sites-available/next-app /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
fi

# 安装 Certbot 并申请 SSL（仅 Linux）
if [[ "$OS" == "Linux" ]]; then
    echo "🔒 申请 SSL 证书..."
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --redirect
    sudo systemctl enable certbot.timer
fi

# 进入 Next.js 目录
cd $NEXT_DIR

# 安装依赖并打包
echo "📦 安装依赖并构建 Next.js..."
npm install
npm run build

# 使用 PM2 启动 Next.js
echo "🚀 启动 Next.js..."
PORT=$PORT pm2 start npm --name "next-app" -- start

# 配置 PM2 开机自启
echo "⚙️ 配置 PM2 开机启动..."
pm2 startup
pm2 save

echo "✅ 部署完成！访问 http://$DOMAIN 🎉"
