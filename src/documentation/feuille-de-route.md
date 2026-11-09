# 🧭 Feuille de route

État au 8 novembre 2026. Chaque changement passe par une pull request du [dépôt Infrastructure](https://github.com/AlixANNERAUD/Infrastructure), puis est déployé. Les travaux prévus sont listés dans l’ordre envisagé.

## ✅ Fusionné, à déployer {#fusionne}

- **Sauvegarde chiffrée vers Google Drive** (voir [Sauvegardes](sauvegardes.md#google-drive-mise-en-place)) : client OAuth Google, jeton et mot de passe restic dans le coffre, puis déployer les métriques, la sauvegarde et Vigie.

## 🗓️ Prévu {#prevu}

### 🐳 Réseaux Docker {#reseaux}

1. **Aligner les pools d’adresses des deux hôtes** sur le [plan commun](reseau.md#reseaux-docker) (`172.16.0.0/13` en `/24`, `172.24.0.0/13` réservé), le pool de Luxembourg étant géré par Ansible. Les réseaux existants sont ensuite recréés dans ce plan.
2. **Réseaux proxy par application** sur les deux hôtes, en commençant par les services publics (Nextcloud, Jellyfin, Home Assistant, Vaultwarden, Matrix), puis les autres. Chaque application ne partage qu’avec Traefik un réseau `/29` interne ; celles qui font confiance aux en-têtes du proxy ne font plus confiance qu’à ce réseau. Voir [Réseau](reseau.md#isolation-des-applications).
3. **Un réseau par base de données**, à la place du réseau partagé avec l’outil de sauvegarde des bases (Databasus) : l’outil rejoint chaque réseau, mais les bases ne se voient plus entre elles.

### 💾 Sauvegardes et dépôts {#sauvegardes}

1. **Miroirs GitHub automatiques dans Gitea :** chaque dépôt (hors forks) des comptes `AlixANNERAUD` et `xila-project` est copié dans Gitea et resynchronisé, les nouveaux dépôts compris, décrits avec OpenTofu.
