# Correction du tunnel POWER — 1 octobre 2026

Branche : `fix/commande-auth-creneaux`.

## Changements

- Le middleware conserve le chemin et la query lors du passage à la connexion. Connexion et inscription reprennent cette destination ; les URL externes et chemins ambigus sont refusés.
- Le créneau choisi au panier est transmis à la commande puis revalidé depuis les créneaux disponibles. Les changements de date ou de mode effacent la sélection. Les réponses tardives du calendrier sont ignorées.
- Demain est sélectionnable sans comparaison erronée avec l'heure actuelle. Les dates inexistantes sont refusées.
- Le serveur exige un identifiant de créneau actif et vérifie sa date, son horaire, le mode de livraison et la date minimale dans le fuseau Europe/Paris.
- Les erreurs de fusion du panier invité conservent son cookie pour permettre une reprise. Un échec de chargement n'est plus présenté comme un panier vide.
- Les comptes désactivés sont refusés par la validation de commande. Téléphone et types des champs sont contrôlés ; les champs de livraison ont des labels associés et l'autocomplétion.
- La modale d'inscription vérifie le résultat de la connexion automatique.
- La CI inclut désormais le build, en plus des tests et de TypeScript.

## Vérifications

- `npm run verify` : TypeScript et 238 tests réussis ; 8 tests préexistants ignorés.
- `npm run build` : build local de production exécuté (voir résultat remis avec la correction).
- `NODE_USE_ENV_PROXY=1 npm run seo` : tous les contrôles passent sur le site public existant (HTTPS, canonical accueil et professionnels, vérification Google, GroceryStore, robots et sitemap).
- Playwright, viewport 375 × 812 : connexion, panier et contact sans débordement horizontal ; `/commande?date=2099-08-10&slot=s1` redirige vers la connexion en conservant toute la destination.
- Revue des protections admin, de la revalidation JWT, de la validation du formulaire contact et des en-têtes HTTP. Aucun envoi de formulaire ni commande réelle effectué.
- Aucun produit, prix ou stock existant édité. Pas de migration, seed ou script de catalogue exécuté. Les tests utilisent des données simulées.

## Limites avant production

L'environnement n'a pas de DATABASE_URL ou de secrets d'authentification/paiement configurés. Connexion réelle, fusion réelle du panier, disponibilité de la base, réception des notifications et commande complète doivent encore être vérifiées dans un environnement de recette isolé. Le test mobile du parcours authentifié est couvert par les tests de composants, pas par une commande en navigateur.

Le traitement existant des commandes utilise des écritures successives avec Neon HTTP, sans transaction : une panne intermédiaire ou deux validations concurrentes restent un risque de commande partielle ou de réservation concurrente. Cette architecture doit être éprouvée avant production ; elle n'a pas été modifiée dans cette correction.

Les contrôles SEO publics portent sur la version déjà déployée. Ils ne prouvent pas le fonctionnement serveur des modifications locales. Les liens des pages parcourues ont été inspectés, sans crawl exhaustif du catalogue dynamique.

GitHub refuse création de branche distante et push (HTTP 403, intégration non autorisée). La branche et le commit restent locaux, avec un patch exporté. Aucun déploiement ni publication sur les réseaux sociaux.
