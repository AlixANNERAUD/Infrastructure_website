# 🛡️ Sauvegardes et continuité

Cette page décrit où sont copiées les données, à quelle fréquence, comment leur intégrité est vérifiée et comment les restaurer.

## ⏱️ Rétention et historique {#retention}

| Cible                           | Fréquence   | Rétention                    | Méthode            |
| ------------------------------- | ----------- | ---------------------------- | ------------------ |
| Bruxelles - `Donnees`           | Quotidienne | 15 jours                     | Snapshots ZFS      |
| Luxembourg                      | En cours    | À définir                    | -                  |
| Hetzner storage box - `Donnees` | Quotidienne | 10 jours                     | Snapshots          |
| Pristina - `Donnees`            | Quotidienne | 15 jours                     | Snapshots ZFS      |
| Paris - `Donnees`               | Quotidienne | 15 jours                     | Snapshots ZFS      |
| Google Drive (jeux choisis)     | Quotidienne | 7 jours, 4 semaines, 12 mois | Instantanés restic |

## 🧬 Redondance du stockage {#redondance}

| Cible                 | Configuration matérielle      | Méthode / Technologie             |
| --------------------- | ----------------------------- | --------------------------------- |
| Bruxelles - `Donnees` | RAIDZ1 (4×2 To NVMe)          | ZFS                               |
| Luxembourg            | Redondance Cloud (OCI)        | OCI Block Storage                 |
| Paris - `Donnees`     | Mirror (2×2 To)               | ZFS                               |
| Pristina - `Donnees`  | Stripe (capacité à confirmer) | ZFS _(sans tolérance aux pannes)_ |
| Hetzner Storage Box   | Redondance Hetzner            | RAID géré par l’hébergeur         |

> ⚠️ **Note de sécurité :** La cible `Pristina` est configurée en _Stripe_ (RAID 0). Elle ne présente aucune tolérance à la panne matérielle d’un disque.

## 🌍 Répartition géographique {#repartition}

| Copie / serveur     | Emplacement                       | Séparation et limites                                                                 |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Bruxelles           | Site principal                    | Site principal                                                                        |
| Pristina            | Bâtiment annexe du site principal | Bâtiment distinct, mais même site : exposé aux mêmes risques locaux que Bruxelles     |
| Paris               | Site secondaire                   | Site distinct, mais proche du site principal : pas de séparation régionale à lui seul |
| Hetzner Storage Box | Centre de données de l’hébergeur  | Copie distante chez un hébergeur, dans une autre région et un autre pays              |
| Google Drive        | Centres de données de Google      | Copie distante chiffrée, hors des sites et chez un autre fournisseur que Hetzner      |

Les copies sont donc réparties entre le site principal, le site secondaire et un hébergeur distant. Un incident limité au bâtiment principal ou à l’annexe ne devrait pas toucher les autres copies, et une copie distante existe hors du pays. Les deux sites restent toutefois proches ; la Storage Box Hetzner est la principale protection documentée contre un sinistre régional.

Cette répartition améliore la reprise après sinistre, mais ne garantit pas la haute disponibilité des services. La récupération dépend de la fraîcheur des copies et de leur possibilité de restauration ; des tests de restauration restent nécessaires.

## 🔄 Réplication et flux {#replication}

| Source                   | Cible                 | Méthode / Protocole                     |
| ------------------------ | --------------------- | --------------------------------------- |
| Bruxelles - `Donnees`    | Paris - `Donnees`     | ZFS send/receive (incrémental) via SSH  |
| Bruxelles - `Donnees`    | Pristina - `Donnees`  | ZFS send/receive (incrémental) via SSH  |
| Bruxelles - `Donnees`    | Hetzner storage box   | rclone (chiffrement côté client)        |
| Luxembourg - `/opt`      | Bruxelles - `Donnees` | rclone (Sauvegarde fichiers)            |
| Bruxelles - jeux choisis | Google Drive          | restic par rclone (chiffré, dédupliqué) |
| Clients (Nextcloud)      | Bruxelles - `Donnees` | WebDAV                                  |

## ☁️ Copie chiffrée vers Google Drive {#google-drive}

Chaque nuit, Bruxelles envoie une copie chiffrée des jeux de données choisis vers Google Drive, avec [restic](https://restic.net/) (<RepositoryReference path="services/sauvegarde" />). La synchronisation intégrée de TrueNAS envoie les fichiers un par un, alors que Google Drive n’accepte que quelques nouveaux fichiers par seconde ; restic les regroupe en paquets de 64 Mio, déduplique, compresse et n’envoie que ce qui a changé. Tout est chiffré avant de quitter Bruxelles : Google ne voit que des paquets illisibles.

- **Ce qui est copié :** les jeux de données de <RepositoryReference path="inventory/host_vars/bruxelles/sauvegarde.yml" /> (motifs, enfants compris) : applications, applications chiffrées, sauvegardes, utilisateurs, musique, vidéos personnelles, réglages et volumes des applications TrueNAS, et les sauvegardes de configuration de TrueNAS. La médiathèque (que Radarr et Sonarr retéléchargent), les images Docker et les enregistrements des caméras n’en font pas partie.
- **Déroulement :** à 1 h 30, une tâche cron de TrueNAS (créée par le playbook, **System → Advanced → Cron Jobs**) lance `sauvegarde.sh` dans le dossier du service. Il prend un instantané ZFS atomique de tous les jeux, le monte en lecture seule sous `/run/sauvegarde` (les mêmes chemins chaque nuit) et lance restic dessus depuis la stack, puis supprime l’instantané. Rien n’est installé sur TrueNAS : restic et rclone tournent dans des conteneurs.
- **Envoi :** restic écrit son dépôt par rclone (`rclone serve restic`), dans `Sauvegardes/Bruxelles` du Drive, avec le droit `drive.file` : le jeton ne voit que les fichiers qu’il a créés. Le débit est limité à 8 Mio/s, Google refusant plus de 750 Go envoyés par jour : le premier envoi (environ 1,2 To) prend deux jours, et les nuits suivantes le laissent finir.
- **Historique et vérification :** le dimanche, restic oublie les vieux instantanés (7 quotidiens, 4 hebdomadaires, 12 mensuels) et relit 2 % du dépôt.
- **Supervision :** chaque passage écrit son résultat pour node*exporter (collecteur \_textfile* de <RepositoryReference path="services/metriques" />) ; Vigie alerte quand un passage échoue et quand la dernière réussite date de plus de 36 heures (voir [Supervision](supervision.md#alertes)). Les journaux sont dans `logs/` du dossier du service.

### Mise en place {#google-drive-mise-en-place}

Une fois :

1. **Console Google Cloud**, avec le compte du Drive : créer un projet, activer **Google Drive API** (**API et services → Bibliothèque**), configurer l’écran de consentement (**Google Auth Platform**, audience **Externe**) et le **publier** (**Audience → Publier l’application**, statut **En production** : tant qu’il est **En test**, Google révoque le jeton au bout de 7 jours), puis créer un **ID client OAuth** de type **Application de bureau**. Le droit `drive.file` n’étant pas sensible, Google ne demande pas de validation.
2. **Jeton**, sur un poste avec un navigateur : `mise exec rclone@1.75.2 -- rclone config create sauvegarde drive client_id <id> client_secret <secret> scope drive.file`, se connecter (l’avertissement « Google n’a pas validé cette application » est attendu : **Paramètres avancés → Accéder à…**), puis copier le JSON de la ligne `token` de `rclone config show sauvegarde`.
3. **Coffre** : `mise vault:create vault/sauvegarde/vault.yml` avec `sauvegarde_drive_client_id`, `sauvegarde_drive_client_secret`, `sauvegarde_drive_token` (le JSON, sur une ligne) et `sauvegarde_restic_password` (`openssl rand -hex 32`). **Garder une copie du mot de passe de restic hors de Bruxelles**, sur papier aussi : sans lui, la sauvegarde est illisible.
4. **Déploiement**, dans l’ordre : `mise deploy services/metriques/deploy.yml` (collecteur _textfile_), `mise deploy services/sauvegarde/deploy.yml` (crée le dépôt restic au premier passage, puis la tâche cron) et `mise deploy services/vigie/deploy.yml` (alertes).

### Exploitation {#google-drive-exploitation}

Sur Bruxelles, pour lancer un passage sans attendre la nuit (ou **Run Now** sur la tâche cron), puis le suivre :

```bash
sudo bash /mnt/Donnees/Applications_chiffrees/Sauvegarde/sauvegarde.sh &
sudo tail -f /mnt/Donnees/Applications_chiffrees/Sauvegarde/logs/*.log
```

Pour lister ou restaurer, depuis le dossier du service (restic y lit son mot de passe et son dépôt) :

```bash
cd /mnt/Donnees/Applications_chiffrees/Sauvegarde
sudo docker compose run --rm restic snapshots
sudo docker compose run --rm restic ls latest /source/Applications_chiffrees/Vaultwarden
sudo docker compose run --rm --cap-add CHOWN --cap-add FOWNER -v /mnt/Donnees/Temporaire:/restore \
  restic restore latest --include /source/Applications_chiffrees/Vaultwarden --target /restore
```

Dans le dépôt, les chemins sont `/source/<jeu de données sans Donnees/>`. Sans Bruxelles, restic et rclone lisent le même dépôt depuis n’importe quel poste, avec le même client OAuth, le même jeton et le même mot de passe (`restic -r rclone:sauvegarde:Sauvegardes/Bruxelles`).

## ♻️ Reprise et restauration {#restauration}

Les réplications de Bruxelles vers Paris et Pristina sont déclenchées par des tâches de réplication TrueNAS. Un minuteur systemd les déclenche sur les deux hôtes toutes les 12 heures. Cette automatisation déclenche la réplication ; elle ne remplace pas une procédure de restauration testée.

<RepositoryReference path="hosts/replication.yml" /> donne à chaque client du groupe `replication` un compte `replication` et sa clé, et installe sur Bruxelles une commande forcée qui ne lance que la tâche de réplication de ce client : la clé d’API de TrueNAS ne quitte jamais Bruxelles. Mise en place, une fois :

1. `mise deploy hosts/replication.yml` : tant que l’utilisateur `replication` n’existe pas dans TrueNAS, le playbook explique comment le créer.
2. Coller les lignes `command="…",restrict ssh-ed25519 …` qu’il affiche dans les clés autorisées de cet utilisateur ; il ne les affiche que tant qu’elles manquent.

En cas de perte de données ou d’un serveur :

1. Identifier le jeu de données et la date de restauration souhaitée, puis vérifier sur la destination que le snapshot correspondant est présent et exploitable.
2. Ne pas restaurer par-dessus les données d’origine avant d’avoir évalué l’incident. Si possible, restaurer vers un nouvel emplacement afin de vérifier le contenu sans écraser la source.
3. Utiliser les snapshots/réplications ZFS disponibles sur la destination de sauvegarde. La commande et les options exactes dépendent du jeu de données et ne sont pas définies dans ce dépôt ; vérifier la configuration TrueNAS avant toute restauration.
4. Contrôler les données restaurées et le fonctionnement du service avant de remettre la copie en production.
5. Après l’incident, noter la date du dernier snapshot restaurable, les données récupérées et les éventuelles pertes.

Les restaurations doivent être testées périodiquement. Ce dépôt ne consigne actuellement ni résultats de tests de restauration ni procédure détaillée propre à chaque service.

## 🔍 Intégrité et vérification {#integrite}

| Cible                 | Fréquence de test     | Méthode de vérification                      |
| --------------------- | --------------------- | -------------------------------------------- |
| Bruxelles - `Donnees` | Toutes les 2 semaines | Scrub ZFS et sommes de contrôle à la lecture |
| Paris - `Donnees`     | Toutes les 2 semaines | Scrub ZFS et sommes de contrôle à la lecture |
| Pristina - `Donnees`  | Toutes les 2 semaines | Scrub ZFS et sommes de contrôle à la lecture |
| Luxembourg            | Automatique           | Géré par l’infrastructure OCI                |
| Hetzner storage box   | Automatique           | Géré par l’infrastructure Hetzner            |
| Google Drive          | Chaque semaine        | `restic check` : relecture de 2 % du dépôt   |

---

## 📝 Résumé des garanties

- **Copies de données** : réplication entre Bruxelles, Paris et Pristina, avec une copie supplémentaire sur la Storage Box Hetzner.
- **Résilience géographique** : copies réparties entre le site principal, le site secondaire et un hébergeur distant dans un autre pays ; les deux sites restent proches.
- **Redondance du stockage** : RAIDZ1 sur Bruxelles, stockage redondé de l’hébergeur pour Luxembourg et la Storage Box.
- **Intégrité des données** : sommes de contrôle vérifiées à chaque lecture, et vérification complète du stockage automatisée au moins **toutes les 2 semaines**.
