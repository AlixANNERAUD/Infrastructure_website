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

| Cible                 | Configuration matérielle | Méthode / Technologie             |
| --------------------- | ------------------------ | --------------------------------- |
| Bruxelles - `Donnees` | RAIDZ1 (4×2 To NVMe)     | ZFS                               |
| Luxembourg            | Redondance Cloud (OCI)   | OCI Block Storage                 |
| Paris - `Donnees`     | Mirror (2×2 To)          | ZFS                               |
| Pristina - `Donnees`  | Stripe (1×1 To)          | ZFS _(Sans tolérance aux pannes)_ |
| Hetzner storage box   | Redondance Hetzner       | Raid managé par l'hébergeur       |

> ⚠️ **Note de sécurité :** La cible `Pristina` est configurée en _Stripe_ (RAID 0). Elle ne présente aucune tolérance à la panne matérielle d'un disque.

## 🔄 Réplication & Flux

| Source                | Cible                 | Méthode / Protocole                    |
| --------------------- | --------------------- | -------------------------------------- |
| Bruxelles - `Donnees` | Paris - `Donnees`     | ZFS send/receive (incrémental) via SSH |
| Bruxelles - `Donnees` | Pristina - `Donnees`  | ZFS send/receive (incrémental) via SSH |
| Bruxelles - `Donnees` | Hetzner storage box   | rclone (chiffrement côté client)       |
| Luxembourg - `/opt`   | Bruxelles - `Donnees` | rclone (Sauvegarde fichiers)           |
| Clients (Nextcloud)   | Bruxelles - `Donnees` | WebDAV                                 |

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
