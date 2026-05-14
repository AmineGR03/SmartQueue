# SmartQueue - Seed Test Credentials

Ce fichier contient les identifiants créés par le `TestDataSeeder` pour tester l'application en local.

## Comptes Disponibles

| Rôle | Email | Mot de passe | Nom Complet |
|------|-------|--------------|------------|
| **ADMIN** | `admin@smartqueue.test` | `Test1234!` | Admin SmartQueue |
| **AGENT** | `agent@smartqueue.test` | `Test1234!` | Agent Guichet |
| **USER** | `user@smartqueue.test` | `Test1234!` | Jean Usager |

## Notes

- Le seeder s'active avec la propriété `app.data.seed=true` dans `application.properties`
- Il est idempotent : si `admin@smartqueue.test` existe déjà, il saute le seed
- Tous les comptes sont **activés** et prêts à être utilisés
- **À CHANGER EN PRODUCTION** ⚠️

## Services Créés (Demo)

- **Permis de conduire** (25 min moyenne)
- **Carte d'identité** (20 min moyenne)

## Données de Test

- 1 rendez-vous confirmé pour Jean Usager (dans 2 jours à 10h)
- 1 ticket en attente pour Jean Usager
- 2 notifications de bienvenue
