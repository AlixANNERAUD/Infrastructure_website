# 📖 Documentation

Documentation de l’infrastructure auto-hébergée de la famille Anneraud. Le code qui la déploie est public, dans le [dépôt Infrastructure](https://github.com/AlixANNERAUD/Infrastructure) ; ces pages expliquent son fonctionnement et ses choix. Elles sont classées dans l’ordre de lecture conseillé.

## 🙋 Utiliser {#utiliser}

| Page                                     | Répond à la question                                             |
| ---------------------------------------- | ---------------------------------------------------------------- |
| [🧑‍💻 Accès aux services](exploitation.md) | Comment accéder à un service public ou privé, avec quel compte ? |
| [💚 État des services](/etat)            | Les services fonctionnent-ils en ce moment ?                     |

## 🧭 Comprendre {#comprendre}

| Page                               | Répond à la question                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [🏗️ Architecture](architecture.md) | Quel serveur fait quoi, comment une requête atteint un service, comment se connecter une seule fois ? |
| [🗺️ Réseau](reseau.md)             | Comment les sites, le VPN et les réseaux Docker sont-ils adressés ?                                   |
| [📇 DNS](dns.md)                   | Comment les noms de domaine pointent-ils vers les serveurs ?                                          |
| [🔒 Sécurité](securite.md)         | Quelles protections une requête traverse-t-elle, comment sont gérés les accès et les secrets ?        |

## 🛠️ Exploiter {#exploiter}

| Page                                       | Répond à la question                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| [🚀 Déploiement](deploiement.md)           | Comment un changement passe-t-il du dépôt aux serveurs ?                |
| [🪪 Authentification](authentification.md) | Comment raccorder un service à Zitadel et gérer les comptes ?           |
| [📈 Supervision](supervision.md)           | Comment les pannes et les anomalies sont-elles détectées et signalées ? |
| [🛡️ Sauvegardes](sauvegardes.md)           | Où sont copiées les données et comment les restaurer ?                  |
| [🤖 Assistants IA](assistants.md)          | Comment les assistants IA accèdent-ils aux outils de l’infrastructure ? |

## 📚 Référence {#reference}

| Page                                       | Contenu                                             |
| ------------------------------------------ | --------------------------------------------------- |
| [🧩 Services](services.md)                 | Chaque service : rôle, accès, hôte, déploiement     |
| [🗂️ Inventaire](inventaire.md)             | Matériel : serveurs, réseau, périphériques          |
| [🧭 Feuille de route](feuille-de-route.md) | Travaux en attente de déploiement et travaux prévus |
