# 🚀 Déploiement

Cette page explique comment les services passent du [dépôt Infrastructure](https://github.com/AlixANNERAUD/Infrastructure), public, aux serveurs. Tout ce que déploie Ansible y est décrit, et un changement passe toujours par une pull request vérifiée par l’intégration continue avant d’être appliqué. Ce site a son propre dépôt et sa propre publication (voir [Ce site](#ce-site)).

## 📁 Organisation du dépôt {#organisation}

| Dossier               | Contenu                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `services/<service>/` | Un dossier par service : playbook `deploy.yml`, fichier `compose.yml`, configurations et modèles copiés |
| `hosts/`              | Playbooks propres aux hôtes : compte d’automatisation, réplication, mises à jour                        |
| `dns/`                | Un playbook par zone DNS Cloudflare (voir [DNS](dns.md))                                                |
| `inventory/`          | Hôtes, un groupe par service indiquant l’hôte qui le porte, réglages propres à chaque hôte              |
| `roles/`              | Rôles partagés : `compose_service`, `opentofu`, `zitadel`                                               |
| `opentofu/zitadel/`   | Applications OIDC de Zitadel (voir [Architecture](architecture.md#authentification))                    |
| `vault/`              | Sous-module privé contenant les secrets chiffrés (voir [Sécurité](securite.md#secrets))                 |
| `site.yml`            | Importe le playbook de chaque service, Traefik en premier                                               |

Les dossiers et groupes portent le nom de la fonction du service (`authentification`, `deploiement`, `etat`…), pas celui du logiciel : remplacer un logiciel ne change pas l’organisation.

L’inventaire associe chaque service à un hôte. Déplacer un service revient à changer son groupe dans <RepositoryReference path="inventory/hosts.yml" /> ; les faits propres à un hôte (dossier racine des services, réseau du proxy, noms DNS) sont dans ses variables d’hôte, jamais dans les playbooks.

## 🧱 Rôle `compose_service` {#role-compose-service}

Chaque service Docker Compose est déployé par le même rôle, <RepositoryReference path="roles/compose_service" />. Le playbook d’un service se limite à lui passer des paramètres. Le rôle :

1. crée le dossier du service sous la racine des services de l’hôte (les permissions ne sont posées qu’à la création : les dossiers existants de TrueNAS gardent leurs ACL) ;
2. copie `compose.yml` et les fichiers de configuration, rend les modèles Jinja ;
3. écrit le fichier `.env` (lisible par son seul propriétaire) avec les variables et secrets du service, dont l’utilisateur et le groupe sous lesquels tournent les conteneurs ;
4. crée à l’avance les fichiers montés dans les conteneurs, sinon Docker créerait un dossier à leur place, ainsi que les réseaux externes déclarés ;
5. démarre la pile : les conteneurs ne sont recréés que si leur image ou leur configuration change, et redémarrés quand un fichier de configuration change (sauf pour les fichiers que le service recharge lui-même) ;
6. fait pointer les enregistrements DNS du service vers l’hôte, en public ou en privé (voir [DNS](dns.md#automatisation)).

Le rôle signale aussi un réseau existant qui ne correspond plus à sa déclaration, sans jamais le recréer de lui-même : recréer un réseau déconnecterait tous ses conteneurs.

Un seul service échappe au rôle : le coffre de signature de Xila (OpenBao), qui gère lui-même son certificat et doit rester descellé.

Le rôle est testé par [Molecule](https://ansible.readthedocs.io/projects/molecule/) sur une pile de test locale : création, idempotence, redémarrage quand un fichier change.

## 🛠️ Outils {#outils}

Les versions des outils sont figées : Python, Ansible, ansible-lint et yamllint par [uv](https://docs.astral.sh/uv/) (`pyproject.toml`, `uv.lock`), OpenTofu par [mise](https://mise.jdx.dev/) (`mise.toml`), les collections Ansible dans `requirements.yml`. Les commandes courantes sont des tâches mise :

```bash
mise install && mise run setup                    # outils et collections
mise preview site.yml --limit bruxelles           # ce qui changerait (--check --diff), sans rien changer
mise deploy services/<service>/deploy.yml         # déployer un service
mise deploy site.yml --limit bruxelles            # tous les services d’un hôte
mise lint                                         # yamllint, ansible-lint, docker compose config
mise test                                         # scénarios Molecule des rôles
```

Les zones DNS ne sont pas appliquées par `site.yml` : chacune a son propre playbook, lancé séparément.

Les playbooks lisent leurs secrets dans un coffre chiffré, dont le mot de passe reste dans le trousseau du système (voir [Sécurité](securite.md#secrets)).

## ✅ Intégration continue {#integration-continue}

Chaque pull request et chaque push sur `main` lancent des vérifications sur GitHub Actions. L’intégration continue n’a pas accès aux secrets : les playbooks sont analysés avec des fichiers de coffre vides, ce qui oblige chaque playbook à rester lisible sans eux.

| Vérification           | Contenu                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| yamllint, ansible-lint | Style YAML, bonnes pratiques Ansible (modules complets, `changed_when`, gestionnaires…)                                 |
| Compose                | `docker compose config` sur chaque service, avec des valeurs factices pour les variables                                |
| Molecule               | Rôles `compose_service` et `zitadel` exécutés sur des piles de test                                                     |
| OpenTofu               | Formatage et validation de la configuration Zitadel                                                                     |
| Routes Traefik         | Les routes de Bruxelles sont rendues puis chargées dans un vrai Traefik : chaque routeur doit être actif et conforme    |
| Supervision            | La supervision est démarrée avec des métriques et des journaux d’exemple : alertes, tableaux de bord et serveur MCP     |
| Protection             | CrowdSec et Traefik démarrés ensemble : une adresse bannie est refusée, le réseau local et le VPN passent, l’IPv6 aussi |

Une vérification unique, exigée par les règles de la branche `main`, attend le succès de toutes les autres.

## 🔄 Mises à jour {#mises-a-jour}

Chaque image Docker est figée sur une version exacte : jamais `latest`, jamais d’image sans étiquette. [Dependabot](https://docs.github.com/fr/code-security/dependabot) ouvre chaque lundi une pull request groupée par écosystème (images Docker Compose, actions GitHub, outils Python). Elle passe par les mêmes vérifications que tout autre changement. Les collections Ansible, la version de Python et l’extension CrowdSec de Traefik, que Dependabot ne suit pas, sont mises à jour à la main.

## 🛡️ Principes de sécurité du déploiement {#principes}

- **Branche protégée :** `main` n’accepte que des pull requests dont l’intégration continue est passée, fusionnées en un seul commit.
- **Aperçu avant application :** `mise preview` montre les changements (`--check --diff`) avant tout déploiement réel.
- **Configuration décrite dans le dépôt :** ce que déploie Ansible vient du dépôt ; ce qu’Ansible ne peut pas régler lui-même (interface TrueNAS notamment), il le vérifie et indique les étapes à faire.
- **Ports publiés sous contrôle :** le déploiement de Traefik vérifie qu’aucun autre conteneur n’occupe les ports web et, sur Bruxelles, liste les ports publiés qui ne sont pas attendus (voir [Sécurité](securite.md#cloisonnement)).
- **Compte dédié :** Ansible se connecte avec un compte d’automatisation à clé SSH, distinct des comptes personnels (voir [Sécurité](securite.md#ssh)).

## 🤖 Semaphore {#semaphore}

[Semaphore](https://semaphoreui.com/) est une interface web pour lancer les playbooks depuis Bruxelles, sans passer par l’ordinateur portable. Son service est fusionné dans le dépôt ; sa mise en service est à venir (voir la [feuille de route](feuille-de-route.md#fusionne)).

- Il est privé : accessible uniquement depuis le réseau local ou le VPN.
- Il clone le dépôt public, et le sous-module des secrets avec un accès en lecture seule limité à ce seul dépôt.
- Il se connecte aux hôtes avec sa propre clé SSH, autorisée sur le compte d’automatisation comme celle de l’ordinateur portable.
- Chaque playbook a deux modèles de tâche : un aperçu (`--check --diff`) et une exécution, lancés à la main.
- Le provisionnement de Zitadel (OpenTofu) reste lancé depuis l’ordinateur portable.

## 🌐 Ce site {#ce-site}

Ce site est construit avec [VitePress](https://vitepress.dev/) dans le dépôt [Infrastructure_website](https://github.com/AlixANNERAUD/Infrastructure_website), indépendant du dépôt Infrastructure : aucun déploiement Ansible n’est nécessaire pour le mettre à jour. Après chaque fusion sur `main`, GitHub Actions le construit et le publie sur GitHub Pages ; la publication peut aussi être lancée à la main depuis l’onglet **Actions** du dépôt.

Pour proposer une modification, créer une branche, puis, depuis la racine du dépôt :

```bash
npm ci             # dépendances
npm run docs:dev   # serveur local, qui affiche l’adresse à ouvrir
npm run check      # vérification Prettier, puis construction du site
```

`npm run docs:build` puis `npm run docs:preview` montrent le résultat de production. Les sources sont dans `src` ; une nouvelle page de documentation s’ajoute à `src/documentation/index.md` et à la barre latérale de `.vitepress/config.mts`. Ouvrir ensuite une pull request vers `main`.
