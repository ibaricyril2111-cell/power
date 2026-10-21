# Stock cumulé du panier — 20 octobre 2026

Base inspectée : `6e873a4d18b9722773cb8a1f17aa3d7027462040` (`main`).
La PR ouverte #3 concerne les pages légales/SEO, sans chevauchement avec ces fichiers.

## Correction préparée

- Contrôler la quantité totale d'un produit présent sur plusieurs lignes avant toute écriture.
- Déduire cette quantité totale en une seule mise à jour par produit au lieu d'écraser les déductions successives depuis le même stock initial.
- Conserver les lignes de commande, les prix et les quantités fractionnaires.
- Ajouter deux tests : dépassement du stock cumulé sans écriture et épuisement exact du stock par deux lignes fractionnaires.

## Vérifications locales

- Tests ciblés de commande : 43 réussis.
- TypeScript : réussi après génération du client Prisma avec une URL locale factice (aucune connexion à une base réelle).
- Suite complète : 505 réussis, 8 ignorés préexistants.
- `git diff --check` : réussi.
- Dépendances locales installées par npm sans modifier le lockfile Yarn ; la CI avec Yarn reste la référence pour l'installation verrouillée.

## Limites et prochaine étape

Cette correction ne rend pas les commandes atomiques et ne résout pas les commandes simultanées ou interrompues. Les écritures restent successives avec PrismaNeonHttp. Aucun changement d'adaptateur, migration, donnée commerciale ou secret ; aucune commande réelle, aucun paiement, aucun e-mail envoyé.

Conserver en PR : tests d'intégration sur une base isolée nécessaires avant fusion. Vérifier notamment deux lignes du même produit, puis traiter séparément concurrence, idempotence et reprise après interruption.

Les créneaux réels et l'activation de POWER10 ne sont pas confirmés. L'accès Vercel connecté refuse le périmètre de l'équipe POWER (403) ; aucune publication revendiquée pour cette correction.
