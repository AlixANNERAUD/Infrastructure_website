# 🗂️ Inventaire

Cette page liste le matériel : serveurs, équipements réseau, périphériques et postes de travail. La répartition des services entre les serveurs est décrite dans la page [Architecture](architecture.md#hotes), les réseaux dans la page [Réseau](reseau.md).

## 🖥️ Serveurs

### Bruxelles

Ce serveur, installé sur le site principal, héberge la majorité des services. TrueNAS Apps et Ansible sont utilisés pour le déploiement et la gestion. Il a été conçu dans une logique d’efficacité énergétique (~20 W au repos) et de fiabilité.

Home Assistant y fonctionne dans un conteneur Docker (<RepositoryReference path="services/maison" />, avec sa base de données et HA-Linky), joint par Traefik sur son réseau proxy et doté de sa propre adresse sur le réseau local (macvlan) pour découvrir les appareils. Sa base de données est réglée dans le paquet `packages/infrastructure.yaml` de sa configuration, écrit par le déploiement ; ses réglages HTTP (port 8080, sous-réseau de `proxy-maison` comme proxy de confiance) se font dans son interface, Paramètres → Système → Réseau. Le déploiement installe aussi HACS s’il manque (version épinglée dans le playbook) ; HACS se met ensuite à jour depuis son interface.

- Système d’exploitation : [TrueNAS Community Edition](https://www.truenas.com/truenas-community-edition/) (basé sur Debian)
- Carte mère : ASRock B550M-ITX/ac (format Mini-ITX, socket AM4)
- Processeur : AMD Ryzen 3 PRO 4350G avec Radeon Graphics (4 cœurs, 8 threads, fréquence maximale de 4,1 GHz)
- Refroidissement : AMD Wraith Spire (ventirad d’origine du processeur, suffisant pour le TDP de 65 W)
- Mémoire : 32 Go DDR4 ECC Samsung (1 × 32 Go, 2667 MT/s, un emplacement libre)
- Alimentation : Cooler Master MWE 600 White 230V (alimentation avec un excellent rendement à très faible charge pour un prix abordable)
- Boîtier : MSI Pro Shield M100P (petit format, peu coûteux, avec une bonne ventilation)
- Stockage :
  - Pool ZFS RAIDZ1 (Donnees - 4,53 To) :
    - WD_BLACK SN750 (SSD - 2 To - NVMe - Pool de données ZFS)
    - WD_BLACK SN770 (SSD - 2 To - NVMe - Pool de données ZFS)
    - WD_BLACK SN7100 (SSD - 2 To - NVMe - Pool de données ZFS)
    - Micron 5200 PRO (MTFDDAK1T9TDD - SSD - 1,9 To - SATA - Pool de données ZFS)
  - Western Digital WD Green (WDS120G2G0A-00JH30 - SSD - 120 Go - SATA - Système TrueNAS)

### Luxembourg

Ce serveur est hébergé sur Oracle Cloud Infrastructure (OCI) et sert aux services nécessitant une haute disponibilité et un accès externe.

- Système d’exploitation : Ubuntu 24.04 LTS
- Modèle : Instance Oracle Cloud
- Processeur : ARM Ampere A1 (4 cœurs)
- Mémoire : 24 Go
- Stockage : 200 Go

### Pristina

Serveur Debian de sauvegarde virtualisé sur l’ordinateur [Athènes](#athenes), dans le bâtiment annexe du site principal. Il reçoit une réplication des données de Bruxelles ; son emplacement dans un bâtiment distinct ne le protège pas d’un sinistre touchant tout le site.

## 🌐 Réseau

### Berlin

Routeur fibre du site principal (FTTH, 1 Gbit/s symétrique) ; sert le DHCP du site.

### Minsk

Routeur du site secondaire ; sert le DHCP du site.

### Budapest

Routeur Wi-Fi du bâtiment annexe, en pont : il relie au réseau local les équipements de l’annexe.

### Sofia

Switch (L2) qui relie le bâtiment annexe au routeur [Berlin](#berlin).

## 📷 Caméras {#cameras}

Des caméras de surveillance extérieures sont reliées au réseau local du site principal.

## 🖨️ Imprimantes

### Madrid

Imprimante à jet d’encre pour les impressions occasionnelles.

### Kiev

Imprimante laser du bâtiment annexe, pour les impressions plus fréquentes.

## 💻 Ordinateurs

### Paris

Ordinateur de bureau du site secondaire, utilisé pour les tâches quotidiennes et le développement. Il reçoit aussi une copie des données de Bruxelles sur un pool ZFS en miroir (voir [sauvegardes](./sauvegardes.md)).

### Belgrade

Ordinateur portable.

### Londres

Ordinateur portable utilisé pour les déplacements, le développement et la bureautique.

### Athènes

Ordinateur fixe du bâtiment annexe ; il héberge la machine virtuelle [Pristina](#pristina).

### Rome

Ordinateur portable.

## ➕ Autres équipements

### 📺 Bucarest

Boîtier TV.

### 📺 Berne

Boîtier TV.

### 🌞 Bratislava

Module de collecte des données de production d’énergie solaire.
