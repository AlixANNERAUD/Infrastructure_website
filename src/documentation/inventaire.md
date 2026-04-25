# 🗂️ Inventaire

Ce document fournit un inventaire des composants de l'infrastructure, notamment les serveurs, les services et leurs configurations respectives.

## 🖥️ Serveurs

### Bruxelles

Ce serveur héberge la majorité de mes services personnels. TrueNAS Apps et Ansible sont utilisés pour le déploiement et la gestion. Il a été conçu dans une logique d'efficacité énergétique (~20 W au repos) et de fiabilité.

- Système d'exploitation : [TrueNAS Community Edition](https://www.truenas.com/truenas-community-edition/) (basé sur Debian)
- Carte mère : ASRock B550M-ITX/ac (petit format, compatible avec les processeurs AMD Ryzen, très économe en énergie)
- Processeur : AMD Ryzen 3 PRO 4350G avec Radeon Graphics (4 cœurs, 8 threads, TDP de 65 W, consommation réduite grâce à l'architecture monolithique des séries G)
- Refroidissement : AMD Wraith Spire (ventirad d'origine du processeur, suffisant pour le TDP de 65 W)
- Mémoire : 32 Go DDR4 ECC (ECC nécessaire pour la stabilité du pool de données ZFS)
- Alimentation : Cooler Master MWE 600 White 230V (alimentation avec un excellent rendement à très faible charge pour un prix abordable)
- Boîtier : MSI Pro Shield M100P (petit format, peu coûteux, avec une bonne ventilation)
- Stockage :
  - Western Digital Black SN750 (SSD - 2 To - NVMe - Pool de données ZFS)
  - Western Digital Black SN770 (SSD - 2 To - NVMe - Pool de données ZFS)
  - Western Digital Black SN7100 (SSD - 2 To - NVMe - Pool de données ZFS)
  - Micron 5200 (SSD - 1,9 To - SATA - Pool de données ZFS)
  - Crucial C300 (SSD - 64 Go - SATA - Système TrueNAS)

### Luxembourg

Ce serveur est hébergé sur Oracle Cloud Infrastructure (OCI) et sert aux services nécessitant une haute disponibilité et un accès externe.

- Système d'exploitation : Ubuntu 24.04 LTS
- Modèle : Instance Oracle Cloud
- Processeur : ARM Ampere A1 (4 cœurs)
- Mémoire : 24 Go
- Stockage : 200 Go

## 🌐 Réseau

### Berlin

Routeur de l'opérateur de boucle locale (Livebox S, Orange) avec ONT intégré pour de la FTTH (1 Gbps symétrique).

### Chisinau

Routeur Wi-Fi pour l'atelier, situé en dehors de la maison. Il est également utilisé pour connecter Skopje, Kiev et Athènes au réseau local.

- Modèle : TP-Link AX1500
- Connectivité : Wi-Fi 6 (802.11ax) + 4 ports Gigabit Ethernet

### Oslo

Antenne Wi-Fi extérieure déportée, à propagation conique, pour fournir une connexion à Amsterdam (caméra de surveillance).

- Modèle : TP-Link CPE610
- Fréquence : 5 GHz
- Portée : Jusqu'à 10 km (en ligne de vue)

### Sofia

Switch (L2) pour connecter les caméras de surveillance et Chisinau à Berlin.

- Modèle : Linksys
- Ports : 5 ports Gigabit Ethernet

## 📷 Caméras

### Nicosie

Caméra de surveillance extérieure pour surveiller le jardin.

- Modèle : Reolink RLC-540A
- Résolution : 4 MP (2560 x 1440)
- Connectivité : Ethernet (PoE)

### Amsterdam

Caméra de surveillance extérieure pour surveiller le portail.

- Modèle : Reolink RLC-410W
- Résolution : 4 MP (2560 x 1440)
- Connectivité : Wi-Fi

### Skopje

Caméra de surveillance extérieure pour surveiller la cour.

- Modèle : Reolink RLC-410W
- Résolution : 4 MP (2560 x 1440)
- Connectivité : Wi-Fi

## 🖨️ Imprimantes

### Madrid

Imprimante à jet d'encre pour les impressions occasionnelles à la maison.

- Modèle : Epson EcoTank ET-2600
- Connectivité : Wi-Fi, USB

### Kiev

Imprimante laser monochrome pour les impressions plus fréquentes dans l'atelier.

- Modèle : HP LaserJet P2055dn
- Connectivité : Ethernet, USB

## 💻 Ordinateurs

### Paris

Ordinateur de bureau utilisé pour les tâches quotidiennes, le développement et d'autres activités nécessitant davantage de puissance de calcul.

- Système d'exploitation : Debian 13 "Trixie"
- Processeur : AMD Ryzen 9 3900X
- Carte mère : MSI X570 Gaming Plus
- Mémoire : 64 Go DDR4
- Boîtier : Cooler Master
- Stockage :
  - Crucial P3 Plus (SSD - 1 To - NVMe - Système d'exploitation)
  - HGST (HDD - 1 To - Stockage de données)
  - Western Digital Green (HDD - 2 To - Sauvegarde Bruxelles)
  - Seagate Barracuda (HDD - 2 To - Sauvegarde Bruxelles)

### Londres

Ordinateur portable pour les déplacements, tout en restant suffisamment puissant pour les tâches de développement et de bureautique.

- Système d'exploitation : Debian 13 "Trixie"
- Modèle : HP HP ProBook 445
- Processeur : AMD Ryzen 5 7530U
- Mémoire : 16 Go DDR4
- Stockage : SSSTC CL4-8D512 (SSD - 256 Go - NVMe)

### Athènes

Ordinateur fixe de l'atelier.

- Système d'exploitation : Windows 11 Pro
- Modèle : Dell Optiplex 3050 SFF
- Processeur : Intel Core i5-6500
- Mémoire : 8 Go DDR4
- Stockage :
  - Crucial BX500 (SSD - 240 Go - SATA - Système d'exploitation)
  - Seagate Barracuda (HDD - 2 To - Sauvegarde Bruxelles)

### Rome

Ordinateur portable.

- Système d'exploitation : Windows 11 Pro
- Modèle : Xiaomi RedmiBook 14 II
- Processeur : Intel Core i5-11300H
- Mémoire : 16 Go DDR4
- Stockage : Samsung 980 (SSD - 512 Go - NVMe)
