<h1 align="center">Infrastructure website</h1>

<p align="center">
  <strong>The documentation of my self-hosted infrastructure, at <a href="https://www.anneraud.fr">www.anneraud.fr</a>.</strong><br>
  How about forty family services run on a home server and a cloud VM: architecture, network,
  security, monitoring, backups and the runbooks to operate them.
</p>

<p align="center">
  <a href="https://github.com/AlixANNERAUD/Infrastructure_website/actions/workflows/deploy.yml"><img alt="Deploy" src="https://github.com/AlixANNERAUD/Infrastructure_website/actions/workflows/deploy.yml/badge.svg"></a>
  <a href="https://www.anneraud.fr/documentation/"><img alt="Website" src="https://img.shields.io/badge/site-anneraud.fr-blue"></a>
  <a href="https://github.com/AlixANNERAUD/Infrastructure"><img alt="Infrastructure repository" src="https://img.shields.io/badge/code-Infrastructure-181717?logo=github"></a>
  <img alt="VitePress" src="https://img.shields.io/badge/VitePress-646CFF?logo=vitepress&logoColor=white">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

---

The [Infrastructure](https://github.com/AlixANNERAUD/Infrastructure) repository holds the code
that deploys everything: Ansible playbooks, Docker Compose stacks and OpenTofu. This site explains
it: what runs where, how a request reaches a service, which protections it goes through, how
failures are detected and how each part is operated. It is written in French, for the people who
use the services as much as for whoever operates them.

## What it covers

| Section        | Pages                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use**        | [Accessing the services](https://www.anneraud.fr/documentation/exploitation), [live status](https://www.anneraud.fr/etat)                                                                                                                                                                                                                   |
| **Understand** | [Architecture](https://www.anneraud.fr/documentation/architecture), [network](https://www.anneraud.fr/documentation/reseau), [DNS](https://www.anneraud.fr/documentation/dns), [security](https://www.anneraud.fr/documentation/securite)                                                                                                   |
| **Operate**    | [Deployment](https://www.anneraud.fr/documentation/deploiement), [single sign-on](https://www.anneraud.fr/documentation/authentification), [monitoring](https://www.anneraud.fr/documentation/supervision), [backups](https://www.anneraud.fr/documentation/sauvegardes), [AI assistants](https://www.anneraud.fr/documentation/assistants) |
| **Reference**  | [Services](https://www.anneraud.fr/documentation/services), [hardware inventory](https://www.anneraud.fr/documentation/inventaire), [roadmap](https://www.anneraud.fr/documentation/feuille-de-route)                                                                                                                                       |

Each page answers one question, with diagrams (Mermaid) for the flows, tables for what can be
looked up, and links to the exact files of the Infrastructure repository it describes.

## How it is built

- [VitePress](https://vitepress.dev/), with [Mermaid](https://mermaid.js.org/) diagrams and
  [Pagefind](https://pagefind.app/) full-text search.
- A small `RepositoryReference` component turns a path into a link to that file in the
  Infrastructure repository, so the documentation points at the code it describes.
- Every push to `main` is built and published to GitHub Pages by GitHub Actions; Prettier keeps
  the sources formatted, and the build fails on a dead link.

## Working on it

```sh
npm ci             # dependencies
npm run docs:dev   # local server, prints the address to open
npm run check      # Prettier check, then a production build
```

Sources are in `src/`; a new documentation page goes in `src/documentation/`, in the overview
table of `src/documentation/index.md` and in the sidebar of `.vitepress/config.mts`.

## License

[MIT](LICENSE).
