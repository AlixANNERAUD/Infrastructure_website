# 📇 DNS

Les zones DNS sont hébergées chez [Cloudflare](https://www.cloudflare.com/). Leurs enregistrements sont décrits dans le dépôt Infrastructure et appliqués par Ansible, plutôt que saisis à la main dans l’interface.

## 🎯 Noms des hôtes {#noms-hotes}

La plupart des services utilisent des enregistrements CNAME pointant vers le nom de l’hôte qui les sert :

| Domaine                       | Description                      | Accès  | Serveur    | Mise à jour |
| ----------------------------- | -------------------------------- | ------ | ---------- | ----------- |
| local.bruxelles.anneraud.fr   | Accès réseau local à Bruxelles   | Privé  | Bruxelles  | Statique    |
| local.luxembourg.anneraud.fr  | Accès réseau local à Luxembourg  | Privé  | Luxembourg | Statique    |
| global.bruxelles.anneraud.fr  | Accès réseau global à Bruxelles  | Public | Bruxelles  | Dynamique   |
| global.luxembourg.anneraud.fr | Accès réseau global à Luxembourg | Public | Luxembourg | Statique    |

Un service **public** pointe vers `global.<hôte>.anneraud.fr`, joignable depuis Internet. Un service **privé** pointe vers `local.<hôte>.anneraud.fr`, une adresse du réseau local : il n’est joignable que depuis le réseau local ou le [VPN NetBird](reseau.md#vpn-mesh-netbird), et Traefik le protège en plus par une [liste d’accès interne](securite.md#services-prives). L’adresse publique de Bruxelles change : un client DNS dynamique tient `global.bruxelles.anneraud.fr` à jour.

## ⚙️ Automatisation {#automatisation}

Les enregistrements sont répartis en deux endroits :

- **Les enregistrements d’un service** (CNAME vers son hôte) sont déclarés dans son playbook de déploiement et créés par le rôle `compose_service` à chaque déploiement, avec une visibilité publique ou privée (voir [Déploiement](deploiement.md#role-compose-service)). Les routes de Bruxelles déclarées dans l’inventaire suivent la même logique.
- **Les autres enregistrements** de chaque zone (noms des hôtes, messagerie, vérifications de domaine, sites hébergés ailleurs) sont dans un playbook par zone, appliqué séparément, jamais par `site.yml` :
  - <RepositoryReference path="dns/anneraud.yml" />
  - <RepositoryReference path="dns/guenola_sahut.yml" />
  - <RepositoryReference path="dns/minitrainstore.yml" />
  - <RepositoryReference path="dns/xila.yml" />

Les sites `minitrainstore.fr` et `guenola-sahut.fr` passent par le proxy de Cloudflare ; les autres domaines pointent directement vers les serveurs (voir [Architecture](architecture.md#parcours-requete)).

Le domaine `dera.page` est un domaine distinct : seuls quelques sous-domaines y sont gérés par cette infrastructure.

Traefik obtient les certificats TLS auprès de Let’s Encrypt avec un défi DNS sur Cloudflare : la validation passe par un enregistrement TXT temporaire, sans dépendre de l’accès HTTP au serveur.
