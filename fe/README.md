# SmartQueue — Frontend

Application React (Create React App) branchée sur l’API Spring Boot.

## Démarrage

1. Démarrer MySQL et le backend (`BE/`) sur le port **8080**.
2. Variables dans `FE/.env.development` : `REACT_APP_API_URL`, `REACT_APP_WS_URL`.
3. `npm install` puis `npm start` → [http://localhost:3000](http://localhost:3000)

## Rôles

L’inscription crée un compte **USER**. Pour tester **Guichet** ou **Admin**, assigner le rôle **AGENT** ou **ADMIN** en base de données.
