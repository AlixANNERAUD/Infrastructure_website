# 🪪 Authentification

Cette page explique comment l’organisation Zitadel est décrite et provisionnée, comment raccorder un service à la connexion unique et comment gérer les comptes. Le principe (pourquoi Zitadel, comment un service s’y raccorde) est présenté dans la page [Architecture](architecture.md#authentification).

## 🧾 Ce que décrit le dépôt {#perimetre}

[OpenTofu](https://opentofu.org/), avec le fournisseur officiel de Zitadel, possède toute l’organisation **Anneraud** : <RepositoryReference path="opentofu/zitadel" /> décrit

- l’organisation elle-même (celle par défaut de l’instance) et son domaine `anneraud.fr` : les identifiants de connexion sont de la forme `<utilisateur>@anneraud.fr` ;
- ses politiques de connexion, de mot de passe, de verrouillage, de domaine et d’apparence ;
- ses utilisateurs et leurs rôles ;
- les projets et applications OIDC de <RepositoryReference path="opentofu/zitadel/applications.auto.tfvars" />.

Les réglages par défaut de l’instance ne sont pas gérés : l’administrateur de l’organisation ZITADEL reste un accès de secours, quoi que fasse le code.

L’ensemble s’applique avec `mise deploy services/authentification/applications.yml` ; les déploiements qui ont besoin d’une application (Vigie, MCPHub, Semaphore…) l’appliquent aussi. L’état d’OpenTofu est chiffré dans le coffre (`vault/authentification/opentofu.tfstate`) : après chaque changement, il faut le valider dans le dépôt des secrets, puis mettre à jour le sous-module.

## 🗝️ Secrets {#secrets}

Le coffre `vault/authentification/vault.yml` contient :

| Clé                                                               | Rôle                                                                                                                                   |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `zitadel_automation_token`                                        | Jeton d’accès personnel de l’utilisateur de service `opentofu` de l’organisation ZITADEL, gestionnaire de l’instance (`IAM_OWNER`)     |
| `zitadel_state_passphrase`                                        | Phrase de passe de l’état d’OpenTofu (`openssl rand -base64 32`)                                                                       |
| `zitadel_smtp_host`, `zitadel_smtp_user`, `zitadel_smtp_password` | Compte SMTP2GO des courriels de Zitadel, envoyés depuis `authentification@anneraud.fr` ; sans serveur, Zitadel n’envoie aucun courriel |
| `zitadel_users`                                                   | Les personnes, hors du dépôt public (voir ci-dessous)                                                                                  |

Sans jeton ni phrase de passe, les déploiements continuent sans connexion unique (seul le compte local de chaque service fonctionne) et indiquent comment créer l’utilisateur de service : console Zitadel, organisation ZITADEL, **Users → Service Users → New**, puis **Default settings → Managers** avec le rôle `IAM_OWNER`, et enfin un jeton d’accès personnel sur cet utilisateur.

## 👥 Comptes {#comptes}

Les utilisateurs sont décrits dans le coffre, par nom d’utilisateur. Le rôle refuse de s’exécuter sans eux : une liste vide supprimerait tous les comptes.

```yaml
zitadel_users:
  alix:
    email: alix@anneraud.fr
    first_name: Alix
    last_name: Anneraud
    owner: true # ORG_OWNER de l’organisation Anneraud
    temporary_password: true # écrit dans ~/.config/infrastructure/zitadel/alix.password, à changer à la première connexion
    roles: { Vigie: [vigie-admin] }
    service_accounts: { nextcloud: Alix ANNERAUD } # métadonnée nextcloud_account, pour relier un compte existant
  exemple:
    email: exemple@anneraud.fr # une redirection vers sa propre boîte
    first_name: Prénom
    last_name: Nom
```

- Un utilisateur sans `temporary_password` reçoit le courriel d’invitation de Zitadel.
- L’un comme l’autre n’a lieu qu’à la création : ajouter `temporary_password` à un compte existant ne change rien ; le mot de passe se réinitialise alors depuis la console.
- Les rôles d’un projet (`roles`) décident des droits dans le service correspondant, par exemple administrateur ou lecteur de la [supervision](supervision.md#connexion).

## 🔌 Raccorder un service {#raccorder}

### Service déployé par le dépôt {#service-ansible}

Le service reçoit une entrée dans `applications.auto.tfvars` (projet, adresses de retour, mode d’authentification : PKCE par défaut, `client_secret` ou `client_secret_post` quand le service exige un secret). Son playbook appelle ensuite le point d’entrée `login` du rôle <RepositoryReference path="roles/zitadel" /> dans ses `pre_tasks`, qui provisionne l’application et rend l’identifiant et le secret client pour le fichier `.env` du service :

```yaml
- name: Get MCPHub's Zitadel login
  ansible.builtin.include_role:
    name: zitadel
    tasks_from: login
  vars:
    zitadel_login_application: mcphub # clé dans applications.auto.tfvars
    zitadel_login_environment_file: "{{ services_root }}/MCPHub/.env"
    zitadel_login_client_id_variable: OIDC_CLIENT_ID # noms dans ce .env
    zitadel_login_client_secret_variable: OIDC_CLIENT_SECRET # omis pour un client PKCE
```

Sans les secrets de Zitadel, l’identifiant et le secret sont vides et le service garde sa seule connexion locale ; si le provisionnement échoue, le service garde les valeurs de son déploiement précédent. Le provisionnement a besoin d’OpenTofu : il se lance depuis le poste de travail avec `mise deploy` ; les exécutions de Semaphore, sans OpenTofu, gardent le client précédent.

### Service géré hors du dépôt {#service-externe}

Pour un service configuré ailleurs, l’entrée de `applications.auto.tfvars` indique aussi `configured_in` (où reporter le résultat). `mise deploy services/authentification/applications.yml` affiche alors l’émetteur, l’identifiant client et `configured_in`, et écrit les secrets clients dans `~/.config/infrastructure/zitadel/<application>.secret`.

### Applications TrueNAS {#truenas}

Les applications installées depuis l’interface de TrueNAS gardent leur configuration dans TrueNAS, connexion Zitadel comprise : TrueNAS ne sait remplacer la section de réglages d’une application qu’en entier (mots de passe et clés compris), si bien que le dépôt ne l’écrit pas. Le playbook du service provisionne son application Zitadel et donne les variables d’environnement à reporter.

Pour **Paperless** (`services/archive`), `mise deploy services/archive/deploy.yml` indique trois entrées à ajouter dans **TrueNAS → Apps → paperless-ngx → Edit → Additional Environment Variables**, avec le conteneur `paperless` :

- `PAPERLESS_APPS`, avec sa valeur ;
- `PAPERLESS_SOCIALACCOUNT_PROVIDERS`, dont la valeur contient le secret client : elle est écrite seule dans `~/.config/infrastructure/zitadel/archive-providers.json` (lisible par son seul propriétaire) plutôt qu’affichée, à copier dans le champ ;
- `PAPERLESS_SOCIALACCOUNT_ALLOW_SIGNUPS=false` : Paperless ne relie jamais de lui-même une connexion Zitadel à un compte existant, et refuse ainsi une connexion non reliée au lieu de créer un compte vide en double.

Les autres entrées restent en place ; Paperless redémarre à l’enregistrement. Il ne faut relancer le playbook que si l’application Zitadel change. Chaque utilisateur existant relie son compte une fois : connexion avec son mot de passe Paperless, puis **Profil → Connecter un compte social → Zitadel**.

## 🧩 Services raccordés {#services}

| Service                 | Application Zitadel | Droits                                                      |
| ----------------------- | ------------------- | ----------------------------------------------------------- |
| Vigie (Grafana)         | `grafana`           | rôle `vigie-admin` : administrateur ; sinon lecteur         |
| MCPHub                  | `mcphub`            | compte créé à la première connexion, à promouvoir à la main |
| Paperless               | `paperless`         | compte Paperless existant, relié par l’utilisateur          |
| Déploiement (Semaphore) | `deploiement`       | compte créé à la première connexion, à promouvoir à la main |

Chaque service garde son compte administrateur local en secours, en particulier Semaphore, qui déploie Zitadel lui-même.
