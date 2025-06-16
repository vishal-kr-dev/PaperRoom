Here are the two `.md` files as requested:

---

### 📄 `logger-setup.md` – Logger with Winston Setup

````md
# 🔧 Winston Logger Setup for Express.js

This guide sets up a robust logging system using `winston` that:

✅ Logs all HTTP requests  
✅ Shows IP address, method, path, status, and duration  
✅ Logs to both console and file  
✅ Includes timestamp for every log  
✅ Supports user ID (if available)

---

## 📦 Installation

```bash
npm install winston
````

---

## 📁 1. Create Logger Utility

**File:** `utils/logger.js`

```js
import winston from "winston";
import path from "path";
import fs from "fs";

// Create logs directory if missing
const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.colorize({ all: true }),
        }),
        new winston.transports.File({
            filename: path.join(logDir, "app.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

export default logger;
```

---

## 📁 2. Request Logger Middleware

**File:** `middlewares/requestLogger.js`

```js
import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms | IP: ${req.ip} | ${
            req.user?.id || "Guest"
        }`;
        logger.info(log);
    });

    next();
};
```

---

## 🔧 3. Use in `app.js`

```js
import { requestLogger } from "./middlewares/requestLogger.js";

app.use(requestLogger);
```

---

## 📂 Output Example

```
2025-06-15T18:53:12.123Z [INFO] GET /api/v1/auth/login 200 - 20ms | IP: ::1 | Guest
```

---

## ✅ Benefits

* Traceable logs for debugging
* Helpful in production for monitoring
* Cleaner than `console.log()`

You can later extend this with:

* Daily rotating files
* Error logs
* Request/response payloads

````

---

### 📄 `middleware-setup.md` – Request Logger + Timer + Rate Limiter

```md
# 🚦 Middleware Setup for Express

This guide includes essential middlewares to improve observability and security:

✅ Request logger (in dev + prod)  
✅ Request timing  
✅ Basic rate limiter for auth routes

---

## 🕒 1. Request Timing Middleware

Add before any route:

```js
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
````

---

## 🧾 2. Request Logger Middleware

```js
import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms | IP: ${req.ip} | ${
            req.user?.id || "Guest"
        }`;
        logger.info(log);
    });

    next();
};
```

Add to app:

```js
app.use(requestLogger);
```

---

## 🔐 3. Rate Limiter for Auth Routes

Install:

```bash
npm install express-rate-limit
```

Then add:

```js
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // limit each IP to 20 requests per window
    message: "Too many requests from this IP, please try again later",
});

app.use("/api/v1/auth", authLimiter, authRoutes);
```

---

## ✅ Summary

| Middleware      | Description                           |
| --------------- | ------------------------------------- |
| `requestTime`   | Adds timestamp to requests            |
| `requestLogger` | Logs method, path, IP, user, duration |
| `rateLimiter`   | Prevents abuse on sensitive endpoints |

This setup is ideal for production-ready Express apps. You can plug these into any app with minimal changes.

```

---

Let me know if you want both files in a downloadable `.zip` or copy-paste-ready as project boilerplate!
```
