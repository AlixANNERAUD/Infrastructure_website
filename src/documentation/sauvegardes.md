# 🛡️ Plan de Continuité d'Activité

## ⏱️ Rétention & Historique

| Cible                           | Fréquence   | Rétention | Méthode       |
| ------------------------------- | ----------- | --------- | ------------- |
| Bruxelles - `Donnees`           | Quotidienne | 15 jours  | Snapshots ZFS |
| Luxembourg                      | En cours    | À définir | -             |
| Hetzner storage box - `Donnees` | Quotidienne | 10 jours  | Snapshots     |
| Pristina - `Donnees`            | Quotidienne | 15 jours  | Snapshots ZFS |
| Paris - `Donnees`               | Quotidienne | 15 jours  | Snapshots ZFS |

## 🧬 Redondance & Stockage matériel

| Cible                 | Configuration matérielle      | Méthode / Technologie             |
| --------------------- | ----------------------------- | --------------------------------- |
| Bruxelles - `Donnees` | RAIDZ1 (4×2 To NVMe)          | ZFS                               |
| Luxembourg            | Redondance Cloud (OCI)        | OCI Block Storage                 |
| Paris - `Donnees`     | Mirror (2×2 To)               | ZFS                               |
| Pristina - `Donnees`  | Stripe (capacité à confirmer) | ZFS _(sans tolérance aux pannes)_ |
| Hetzner storage box   | Redondance Hetzner            | Raid managé par l'hébergeur       |

> ⚠️ **Note de sécurité :** La cible `Pristina` est configurée en _Stripe_ (RAID 0). Elle ne présente aucune tolérance à la panne matérielle d'un disque.

## 🔄 Réplication & Flux

| Source                | Cible                 | Méthode / Protocole                    |
| --------------------- | --------------------- | -------------------------------------- |
| Bruxelles - `Donnees` | Paris - `Donnees`     | ZFS send/receive (incrémental) via SSH |
| Bruxelles - `Donnees` | Pristina - `Donnees`  | ZFS send/receive (incrémental) via SSH |
| Bruxelles - `Donnees` | Hetzner storage box   | rclone (chiffrement côté client)       |
| Luxembourg - `/opt`   | Bruxelles - `Donnees` | rclone (Sauvegarde fichiers)           |
| Clients (Nextcloud)   | Bruxelles - `Donnees` | WebDAV                                 |

## ♻️ Reprise et restauration

Les réplications de Bruxelles vers Paris et Pristina sont déclenchées par des tâches de réplication TrueNAS. Un minuteur systemd les déclenche sur les deux hôtes toutes les 12 heures. Cette automatisation déclenche la réplication ; elle ne remplace pas une procédure de restauration testée.

En cas de perte de données ou d'un serveur :

1. Identifier le jeu de données et la date de restauration souhaitée, puis vérifier sur la destination que le snapshot correspondant est présent et exploitable.
2. Ne pas restaurer par-dessus les données d'origine avant d'avoir évalué l'incident. Si possible, restaurer vers un nouvel emplacement afin de vérifier le contenu sans écraser la source.
3. Utiliser les snapshots/réplications ZFS disponibles sur la destination de sauvegarde. La commande et les options exactes dépendent du jeu de données et ne sont pas définies dans ce dépôt ; vérifier la configuration TrueNAS avant toute restauration.
4. Contrôler les données restaurées et le fonctionnement du service avant de remettre la copie en production.
5. Après l'incident, noter la date du dernier snapshot restaurable, les données récupérées et les éventuelles pertes.

Les restaurations doivent être testées périodiquement. Ce dépôt ne consigne actuellement ni résultats de tests de restauration ni procédure détaillée propre à chaque service.

## 🔍 Intégrité & Vérification

| Cible                 | Fréquence de test | Méthode de vérification                     |
| --------------------- | ----------------- | ------------------------------------------- |
| Bruxelles - `Donnees` | Bi-hebdomadaire   | Scrub ZFS + Vérification checksum à l'accès |
| Paris - `Donnees`     | Bi-hebdomadaire   | Scrub ZFS + Vérification checksum à l'accès |
| Pristina - `Donnees`  | Bi-hebdomadaire   | Scrub ZFS + Vérification checksum à l'accès |
| Luxembourg            | Automatique       | Géré par l'infrastructure OCI               |
| Hetzner storage box   | Automatique       | Géré par l'infrastructure Hetzner           |

---

## 📝 Résumé des garanties

- **Haute disponibilité** : Données répliquées sur **3 hôtes distincts** au minimum.
- **Résilience géographique** : Répartition sur **2 sites géographiques** distincts au minimum.
- **Continuité** : Redondance à chaud activée sur les serveurs de Bruxelles et Luxembourg.
- **Sécurité des données** : Intégrité vérifiée en temps réel lors des accès, et vérification totale du stockage automatisée au minimum **tous les 15 jours**.
