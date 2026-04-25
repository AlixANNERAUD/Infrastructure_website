import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { pagefindPlugin } from "vitepress-plugin-pagefind";

// https://vitepress.dev/reference/site-config
const configuration = defineConfig({
  title: "Anneraud",
  description: "Bienvenue sur les services souverains de la famille Anneraud !",
  srcDir: "./src",
  sitemap: {
    hostname: "https://www.anneraud.fr",
  },
  vite: {
    plugins: [pagefindPlugin()],
  },
  locales: {
    root: {
      label: "Français",
      lang: "fr",
    },
  },
  lastUpdated: true,
  head: [
    [
      "script",
      {
        defer: "",
        src: "https://s.anneraud.fr/script.js",
        "data-website-id": "8daf8262-d0a0-4bfa-a1b9-b1cfca50fee6",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Acceuil", link: "/" },
      { text: "État", link: "/etat/" },
      {
        text: "Documentation",
        link: "/documentation/",
        activeMatch: "^/documentation/",
      },
    ],

    sidebar: {
      "/documentation": [
        { text: "Inventaire", link: "/documentation/inventaire" },
        { text: "DNS", link: "/documentation/dns" },
        { text: "Réseau", link: "/documentation/reseau" },
        { text: "Sauvegardes", link: "/documentation/sauvegardes" },
      ],
    },
    search: {
      provider: "local",
    },
    footer: {
      message:
        "Administré par <a href='https://alix.anneraud.fr'>Alix ANNERAUD</a> - Sous licence <a href='https://mit-license.org/'>MIT</a> - Conçu avec <a href='https://vitepress.dev/'>VitePress</a>",
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/AlixANNERAUD/Infrastructure",
      },
    ],
    editLink: {
      pattern:
        "https://github.com/AlixANNERAUD/Infrastructure/edit/main/services/website/src/:path",
      text: "Proposer une modification sur GitHub",
    },
  },
});

export default withMermaid(configuration);
