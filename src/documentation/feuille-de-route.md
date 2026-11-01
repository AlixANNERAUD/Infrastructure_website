# 🧭 Feuille de route

État au 1er novembre 2026. Les travaux sont listés dans l’ordre prévu ; chacun passe par une pull request du [dépôt Infrastructure](https://github.com/AlixANNERAUD/Infrastructure) avant d’être déployé.

## ✅ Fusionné, à déployer {#fusionne}

1. **Protection CrowdSec sur Luxembourg :** un moteur CrowdSec lit les journaux de Traefik et bannit les adresses hostiles ; Traefik refuse ces adresses sur toutes les routes, internes comprises. Le LAN et le VPN ne sont jamais bannis. Voir [Sécurité](securite.md#crowdsec).
2. **Limitation des connexions :** les formulaires de connexion des services publics (Zitadel, Vaultwarden, Nextcloud, Jellyfin, Home Assistant, Tolgee, NetBird) sont limités par adresse, sur les deux hôtes. La synchronisation des applications n’est pas concernée. Voir [Sécurité](securite.md#limitation).
3. **MeshCentral devient privé :** `parc.anneraud.fr` n’est plus accessible que depuis le LAN ou le VPN ; les agents des appareils passent eux aussi par le LAN ou le VPN.
4. **Semaphore :** une interface web, accessible depuis le LAN ou le VPN, lance les playbooks depuis Bruxelles. Voir [Déploiement](deploiement.md#semaphore).

## 🗓️ Prévu {#prevu}

### 🐳 Réseaux Docker {#reseaux}

1. **Aligner les pools d’adresses des deux hôtes** sur le [plan commun](reseau.md#reseaux-docker) (`172.16.0.0/13` en `/24`, `172.24.0.0/13` réservé), le pool de Luxembourg étant géré par Ansible. Les réseaux existants sont ensuite recréés dans ce plan.
2. **Réseaux proxy par application** sur les deux hôtes, en commençant par les services publics (Nextcloud, Jellyfin, Home Assistant, Vaultwarden, Matrix), puis les autres. Chaque application ne partage qu’avec Traefik un réseau `/29` interne ; celles qui font confiance aux en-têtes du proxy ne font plus confiance qu’à ce réseau. Voir [Réseau](reseau.md#isolation-des-applications).
3. **Un réseau par base de données**, à la place du réseau partagé avec l’outil de sauvegarde des bases (Databasus) : l’outil rejoint chaque réseau, mais les bases ne se voient plus entre elles.

### 🛡️ Protection et accès {#protection}

1. **CrowdSec sur Bruxelles**, sur le même modèle que Luxembourg.
2. **Connexion à Semaphore par Zitadel**, à la place de son compte local.
