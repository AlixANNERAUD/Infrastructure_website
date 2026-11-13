# 🧭 Feuille de route

État au 11 novembre 2026. Chaque changement passe par une pull request du [dépôt Infrastructure](https://github.com/AlixANNERAUD/Infrastructure), puis est déployé. Les travaux prévus sont listés dans l’ordre envisagé.

## 🗓️ Prévu {#prevu}

### 🐳 Réseaux Docker {#reseaux}

1. **Aligner le pool d’adresses de Luxembourg** sur celui de Bruxelles (`172.16.0.0/13` en `/24`, plus un pool IPv6), géré par Ansible.
2. **Un réseau par base de données**, à la place du réseau partagé avec l’outil de sauvegarde des bases (Databasus) : l’outil rejoint chaque réseau, mais les bases ne se voient plus entre elles.

### 💾 Sauvegardes et dépôts {#sauvegardes}

1. **Miroirs GitHub automatiques dans Gitea :** chaque dépôt (hors forks) des comptes `AlixANNERAUD` et `xila-project` est copié dans Gitea et resynchronisé, les nouveaux dépôts compris, décrits avec OpenTofu.
