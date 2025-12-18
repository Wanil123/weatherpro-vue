# WeatherPro (Vue 3)

Application météo moderne : recherche mondiale, météo en temps réel (°C), prévisions 5 jours, géolocalisation, historique, thèmes dynamiques, mode sombre/clair, animations glassmorphism.

## 🚀 Démarrage

```bash
# 1) Créer le projet (si vous n'utilisez pas le ZIP)
npm create vite@latest weatherpro-vue -- --template vue
cd weatherpro-vue

# 2) Remplacer les fichiers par ceux fournis ici (ou extraire le ZIP)

# 3) Installer les dépendances
npm install

# 4) Variables d'environnement (.env)
cp .env.example .env
# Ouvrez .env et définissez VITE_OPENWEATHER_KEY

# 5) Lancer en local
npm run dev
```

## 🔐 ENV & sécurité
- La clé est lue depuis `import.meta.env.VITE_OPENWEATHER_KEY` (Vite). Créez `.env` via l'exemple.
- Ajouté à `.gitignore` pour éviter de commit la vraie clé.
- Note : côté client, une clé ne peut pas être totalement secrète. Pour la prod stricte, utiliser un backend proxy.

## 🔧 Technologies
- Vue 3 (Composition API) + Vite
- Tailwind CSS
- OpenWeatherMap API
- Pinia (prêt pour extension)

## 🧭 Fonctionnalités
- Recherche + géolocalisation
- Météo actuelle + Détails
- Prévisions 5 jours (agrégées)
- Historique LocalStorage (5 derniers)
- Thèmes dynamiques & particules animées
- Mode sombre persistant
