# Launch Meme — Test App

Современное Next.js-приложение, которое в реальном времени отображает новые мем-токены и обновления существующих через WebSocket-подключение к:

```
wss://launch.meme/connection/websocket
```

UI launch.meme: тёмная тема, 3D-эффекты, плавные анимации, графики, аналитика токенов.

---

## 🚀 Технологии

### **Frontend**

- **Next.js 16** (App Router)
- **React 19**
- **TailwindCSS 4**
- **Radix UI** (Tooltip, Avatar, DropdownMenu, Progress)
- **Motion** (анимации)
- **Recharts** (графики)
- **phosphor-icons / lucide-react / web3icons**

### **Инструменты**

- TypeScript 5.9
- ESLint 9
- Prettier 3
- Knip — анализ неиспользуемого кода

---

## 📡 WebSocket-соединение

Приложение подписывается на два канала:

### **1. Обновление токена**

`channel: pumpfun-tokenUpdates`

### **2. Создание токена**

`channel: pumpfun-mintTokens`

## 🛠 Установка и запуск

```bash
npm install
npm run dev
```

Продакшн:

```bash
npm run build
npm start
```
