# 🧩 Services

La liste des services de l’infrastructure, avec leur accès, leur hôte et leur mode de déploiement. Un service **privé** n’est accessible que depuis le réseau local ou le VPN (voir [Accès aux services](exploitation.md)) ; la colonne Déploiement indique s’il vient du [dépôt Infrastructure](https://github.com/AlixANNERAUD/Infrastructure) (Ansible) ou du catalogue d’applications de TrueNAS. L’état de chacun est sur la page [État des services](/etat).

Ajouter un service au dépôt, c’est lui ajouter une ligne ici et une vérification dans Gatus (voir [Supervision](supervision.md#gatus)).

## 🙋 Au quotidien {#quotidien}

| Service                                                         | Rôle                                          | Accès   | Hôte      | Déploiement  |
| --------------------------------------------------------------- | --------------------------------------------- | ------- | --------- | ------------ |
| [Accueil](https://www.anneraud.fr/)                             | Ce site                                       | Public  | —         | GitHub Pages |
| [Nuage](https://nuage.anneraud.fr/)                             | Fichiers, agendas, contacts (Nextcloud)       | Public  | Bruxelles | TrueNAS Apps |
| [Collabora](https://collabora.anneraud.fr/)                     | Suite bureautique en ligne, pour Nextcloud    | Public  | Bruxelles | TrueNAS Apps |
| [Bitwarden](https://bitwarden.anneraud.fr/)                     | Gestionnaire de mots de passe (Vaultwarden)   | Public  | Bruxelles | TrueNAS Apps |
| [Archive](https://archive.anneraud.fr/)                         | Documents numérisés (Paperless-ngx)           | Privé   | Bruxelles | TrueNAS Apps |
| [Bichon](https://archive-courriel.anneraud.fr/)                 | Archive des courriels                         | Privé   | Bruxelles | TrueNAS Apps |
| [Maison](https://maison.anneraud.fr/)                           | Domotique (Home Assistant)                    | Public  | Bruxelles | TrueNAS Apps |
| HA-Linky                                                        | Relevés du compteur Linky pour Home Assistant | Interne | Bruxelles | Ansible      |
| [Matrix](https://matrix.anneraud.fr/)                           | Messagerie (Synapse, `@nom:anneraud.fr`)      | Public  | Bruxelles | Ansible      |
| [Notes](https://notes.anneraud.fr/)                             | Documentation partagée (Docmost)              | Public  | Bruxelles | Ansible      |
| [Recettes](https://recettes.anneraud.fr/)                       | Recettes de cuisine (Mealie)                  | Privé   | Bruxelles | TrueNAS Apps |
| [Finances](https://finances.anneraud.fr/)                       | Finances personnelles (Firefly III)           | Privé   | Bruxelles | TrueNAS Apps |
| [Importateur finances](https://importeur-finances.anneraud.fr/) | Import des relevés dans Firefly III           | Privé   | Bruxelles | TrueNAS Apps |
| [Assistant](https://assistant.anneraud.fr/)                     | Assistant IA (Open WebUI)                     | Privé   | Bruxelles | TrueNAS Apps |
| [Recherche](https://recherche.anneraud.fr/)                     | Moteur de recherche (SearXNG)                 | Privé   | Bruxelles | TrueNAS Apps |
| [PDF](https://pdf.anneraud.fr/)                                 | Outils PDF (BentoPDF)                         | Privé   | Bruxelles | TrueNAS Apps |
| [Automatisation](https://automatisation.anneraud.fr/)           | Flux automatisés (n8n)                        | Privé   | Bruxelles | TrueNAS Apps |
| [Git](https://git.anneraud.fr/)                                 | Forge Git et miroirs de GitHub (Gitea)        | Privé   | Bruxelles | TrueNAS Apps |
| [Wakapi](https://wakapi.anneraud.fr/)                           | Temps passé à coder                           | Public  | Bruxelles | Ansible      |
| [Statistiques](https://s.anneraud.fr/)                          | Statistiques de visite des sites (Umami)      | Public  | Bruxelles | TrueNAS Apps |

## 🎬 Médias {#medias}

| Service                                               | Rôle                                | Accès  | Hôte      | Déploiement  |
| ----------------------------------------------------- | ----------------------------------- | ------ | --------- | ------------ |
| [Médiathèque](https://mediatheque.anneraud.fr/)       | Films, séries et musique (Jellyfin) | Public | Bruxelles | TrueNAS Apps |
| [Jellyseerr](https://jellyseerr.anneraud.fr/)         | Demandes de films et de séries      | Privé  | Bruxelles | TrueNAS Apps |
| [Radarr](https://radarr.anneraud.fr/)                 | Collection de films                 | Privé  | Bruxelles | TrueNAS Apps |
| [Sonarr](https://sonarr.anneraud.fr/)                 | Collection de séries                | Privé  | Bruxelles | TrueNAS Apps |
| [Prowlarr](https://prowlarr.anneraud.fr/)             | Indexeurs                           | Privé  | Bruxelles | TrueNAS Apps |
| [Bazarr](https://bazarr.anneraud.fr/)                 | Sous-titres                         | Privé  | Bruxelles | TrueNAS Apps |
| [Téléchargement](https://telechargement.anneraud.fr/) | Téléchargements (qBittorrent)       | Privé  | Bruxelles | Ansible      |
| [MeTube](https://metube.anneraud.fr/)                 | Téléchargement de vidéos            | Privé  | Bruxelles | TrueNAS Apps |

## 🔐 Identité et accès {#identite}

| Service                                                   | Rôle                                                                     | Accès  | Hôte       | Déploiement |
| --------------------------------------------------------- | ------------------------------------------------------------------------ | ------ | ---------- | ----------- |
| [Authentification](https://authentification.anneraud.fr/) | Connexion unique (Zitadel, voir [Authentification](authentification.md)) | Public | Bruxelles  | Ansible     |
| [VPN](https://netbird.anneraud.fr/)                       | VPN maillé (NetBird) et sa console                                       | Public | Luxembourg | Ansible     |
| [MCPHub](https://mcphub.anneraud.fr/)                     | Serveurs MCP des assistants IA (voir [Assistants IA](assistants.md))     | Privé  | Bruxelles  | Ansible     |

## 🛠️ Administration {#administration}

| Service                                                                | Rôle                                                                                                    | Accès  | Hôte                  | Déploiement  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------ | --------------------- | ------------ |
| [Déploiement](https://deploiement.anneraud.fr/)                        | Lancement des playbooks (Semaphore)                                                                     | Privé  | Bruxelles             | Ansible      |
| [Proxy Bruxelles](https://traefik.bruxelles.anneraud.fr/)              | Tableau de bord de Traefik                                                                              | Privé  | Bruxelles             | Ansible      |
| [Bruxelles console](https://bruxelles.anneraud.fr/)                    | Administration du serveur (TrueNAS)                                                                     | Privé  | Bruxelles             | TrueNAS      |
| [Conteneurs Bruxelles](https://conteneurs.bruxelles.anneraud.fr/)      | Conteneurs (Portainer)                                                                                  | Privé  | Bruxelles             | TrueNAS Apps |
| [Cockpit Luxembourg](https://cockpit.luxembourg.anneraud.fr/)          | Administration du serveur (Cockpit)                                                                     | Privé  | Luxembourg            | Ansible      |
| [DNS dynamique Bruxelles](https://ddns-updater.bruxelles.anneraud.fr/) | Mise à jour de l’adresse publique du site principal                                                     | Privé  | Bruxelles             | TrueNAS Apps |
| [Databasus](https://databasus.anneraud.fr/)                            | Sauvegarde des bases de données                                                                         | Privé  | Bruxelles             | TrueNAS Apps |
| [MeshCentral](https://parc.anneraud.fr/)                               | Gestion à distance des appareils                                                                        | Privé  | Bruxelles             | TrueNAS Apps |
| [Vault Xila](https://vault.xila.dev/ui/)                               | Coffre de signature de Xila (OpenBao)                                                                   | Privé  | Bruxelles             | Ansible      |
| [Vigie](https://vigie.anneraud.fr/)                                    | Supervision (VictoriaMetrics, VictoriaLogs, Grafana)                                                    | Privé  | Luxembourg            | Ansible      |
| [Trousseau](https://trousseau.anneraud.fr/ui)                          | Certificats SSH d’une journée après connexion par Zitadel (OpenBao, voir [Trousseau](trousseau.md))     | Privé  | Luxembourg            | Ansible      |
| Métriques                                                              | Métriques des hôtes et des conteneurs, envoi des journaux d’accès                                       | Privé  | Luxembourg, Bruxelles | Ansible      |
| Protection                                                             | Détection et bannissement des adresses hostiles (CrowdSec)                                              | Privé  | Luxembourg, Bruxelles | Ansible      |
| Sauvegarde                                                             | Copie chiffrée de Bruxelles vers Google Drive (restic, voir [Sauvegardes](sauvegardes.md#google-drive)) | Privé  | Bruxelles             | Ansible      |
| [État](https://etat.anneraud.fr/)                                      | Page d’état des services (Gatus)                                                                        | Public | Luxembourg            | Ansible      |

## 🌐 Autres domaines {#autres-domaines}

| Service                                             | Rôle                                                                     | Accès  | Hôte       | Déploiement  |
| --------------------------------------------------- | ------------------------------------------------------------------------ | ------ | ---------- | ------------ |
| [Mini Train Store](https://minitrainstore.fr/)      | Gestion d’entreprise (Odoo), derrière Cloudflare                         | Public | Bruxelles  | TrueNAS Apps |
| [Translation](https://translate.anneraud.fr/)       | Traduction de projets (Tolgee)                                           | Public | Luxembourg | Ansible      |
| [Vulnérabilités](https://vulnerabilities.xila.dev/) | Vulnérabilités des dépendances des projets, d’après leurs SBOM (nanobom) | Public | Luxembourg | Ansible      |
| [Matrix (insa.lol)](https://matrix.insa.lol/)       | Messagerie d’une communauté (Synapse)                                    | Public | Luxembourg | Ansible      |
| [Status (dera.page)](https://status.dera.page/)     | Page d’état du domaine `dera.page` (Gatus)                               | Public | Luxembourg | Ansible      |
| [Star History](https://star-history.dera.page/)     | Historique des étoiles de dépôts GitHub (simrepo)                        | Public | Luxembourg | Ansible      |
| [Portfolio](https://alix.anneraud.fr/)              | Portfolio d’Alix                                                         | Public | —          | GitHub Pages |
