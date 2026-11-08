# 🛡️ Sauvegardes et continuité

Cette page décrit où sont copiées les données, à quelle fréquence, comment leur intégrité est vérifiée et comment les restaurer.

## ⏱️ Rétention et historique {#retention}

| Cible                           | Fréquence   | Rétention | Méthode       |
| ------------------------------- | ----------- | --------- | ------------- |
| Bruxelles - `Donnees`           | Quotidienne | 15 jours  | Snapshots ZFS |
| Luxembourg                      | En cours    | À définir | -             |
| Hetzner storage box - `Donnees` | Quotidienne | 10 jours  | Snapshots     |
| Pristina - `Donnees`            | Quotidienne | 15 jours  | Snapshots ZFS |
| Paris - `Donnees`               | Quotidienne | 15 jours  | Snapshots ZFS |

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

Les copies sont donc réparties entre le site principal, le site secondaire et un hébergeur distant. Un incident limité au bâtiment principal ou à l’annexe ne devrait pas toucher les autres copies, et une copie distante existe hors du pays. Les deux sites restent toutefois proches ; la Storage Box Hetzner est la principale protection documentée contre un sinistre régional.

Cette répartition améliore la reprise après sinistre, mais ne garantit pas la haute disponibilité des services. La récupération dépend de la fraîcheur des copies et de leur possibilité de restauration ; des tests de restauration restent nécessaires.

## 🔄 Réplication et flux {#replication}

| Source                | Cible                 | Méthode / Protocole                    |
| --------------------- | --------------------- | -------------------------------------- |
| Bruxelles - `Donnees` | Paris - `Donnees`     | ZFS send/receive (incrémental) via SSH |
| Bruxelles - `Donnees` | Pristina - `Donnees`  | ZFS send/receive (incrémental) via SSH |
| Bruxelles - `Donnees` | Hetzner storage box   | rclone (chiffrement côté client)       |
| Luxembourg - `/opt`   | Bruxelles - `Donnees` | rclone (Sauvegarde fichiers)           |
| Clients (Nextcloud)   | Bruxelles - `Donnees` | WebDAV                                 |

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

---

## 📝 Résumé des garanties

- **Copies de données** : réplication entre Bruxelles, Paris et Pristina, avec une copie supplémentaire sur la Storage Box Hetzner.
- **Résilience géographique** : copies réparties entre le site principal, le site secondaire et un hébergeur distant dans un autre pays ; les deux sites restent proches.
- **Redondance du stockage** : RAIDZ1 sur Bruxelles, stockage redondé de l’hébergeur pour Luxembourg et la Storage Box.
- **Intégrité des données** : sommes de contrôle vérifiées à chaque lecture, et vérification complète du stockage automatisée au moins **toutes les 2 semaines**.
