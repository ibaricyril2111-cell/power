# Reprise POWER — 21 octobre 2026

## État relu et périmètre

- main : `bdd76b22313de0c42d8fa94dfe49f554b34bb0d1`.
- Reprise de la PR #22, tête `8ae31cedcdea01f98a0e1ebb01d11fada51614b3`, sans nouvelle PR ni écrasement des changements de présentation de main.
- PR #3 distincte (SEO/CGV), non modifiée. Contrôles GitHub verify et commentaires Vercel réussis pour les deux anciennes têtes.
- Charte et notes du dépôt relues ; aucun AGENTS.md dans l'arbre consulté. Tête de #22 revérifiée avant sauvegarde.

## Correction

Une remise valide était décomptée avant validation de l'adresse et lecture des frais. Une adresse incomplète ou une panne de lecture pouvait ainsi consommer une utilisation sans créer de commande.

L'incrément est maintenant différé après ces validations, sans changer les calculs, la configuration des promotions ou les données commerciales. Quatre tests couvrent les trois champs d'adresse et la panne de configuration ; le test de succès exige exactement un incrément.

Le test des 100 mascottes dépassait 20 secondes lors de deux exécutions locales (parallélisme normal puis limité à deux workers). Les boutons sont désormais résolus une seule fois : mêmes 100 clics, titres, liens et boutons d'achat contrôlés, limite inchangée de 20 secondes. Aucune assertion retirée ; contrôle supplémentaire de l'unicité des 100 boutons. Aucun composant visuel modifié.

## Vérifications réellement exécutées

- Node 24.19.0, Yarn 4.9.4 ; `yarn install --immutable` réussi avec avertissements de peer dependencies. Lockfile inchangé. L'état local généré `.yarn/install-state.gz` n'est pas inclus dans le commit.
- Tests commande : 47 réussis.
- TypeScript : réussi via `yarn verify`, puis pendant le build.
- Premier passage complet et reprise avec deux workers : 508 réussis, 1 timeout mascottes, 8 ignorés préexistants. Ces échecs ne sont pas occultés.
- Après optimisation du test : 7 tests mascottes réussis ; suite complète normale `yarn test` : 509 réussis, 8 ignorés préexistants, 18,63 s.
- `yarn build` réussi ; avertissements middleware obsolète et variables d'environnement absentes. Aucune connexion à une base réelle. URL locale factice uniquement pour la génération Prisma lors de l'installation.
- `git diff --check` réussi.

## Limites et prochaine étape minimale

Non fusionné et non publié en production. CI de la nouvelle tête à vérifier après sauvegarde. Aucun test visuel navigateur ni test d'intégration sur une base isolée exécuté.

Les écritures restent séquentielles avec PrismaNeonHttp : une panne APRÈS les validations peut encore laisser une remise consommée ou une commande partielle. Concurrence, idempotence, capacité des créneaux et usage unique par client ne sont pas résolus par ce lot. POWER10 n'est ni activé ni annoncé actif.

Avant fusion : exécuter sur une base de recette isolée les scénarios de stock cumulé et de remise refusée, puis éprouver une stratégie atomique/idempotente compatible avec la base existante. Aucun accès de recette configuré ici. Aucun changement d'adaptateur, migration, secret, prix, stock, commande réelle, paiement ou envoi de message.
