# Configuration Base de Données Locale

## Description

Ce projet utilise maintenant une base de données locale JSON Server au lieu de l'API NestJS externe. Les données sont stockées dans le fichier `db.json` à la racine du projet.

## Démarrage

### Option 1: Démarrage manuel (2 terminaux)

1. **Terminal 1** - Démarrer la base de données locale :

```bash
npm run db
```

Cela démarre JSON Server sur http://localhost:3001

2. **Terminal 2** - Démarrer l'application :

```bash
npm run dev
```

Cela démarre l'application Refine/Vite (généralement sur http://localhost:5173 ou 5174)

### Option 2: Démarrage automatique (1 terminal)

```bash
npm run dev:full
```

Cela démarre automatiquement la base de données ET l'application en parallèle.

## Endpoints de l'API locale

- **Base URL**: http://localhost:3001
- **Produits**: http://localhost:3001/products
- **Catégories**: http://localhost:3001/categories

## Données initiales

La base de données contient 2 produits d'exemple :

1. **Aspirateur sans fil Dyson V15** (ID: 1)

   - Catégorie: Électronique
   - Prix: 599.99 €
   - Stock: 15 unités

2. **Lait entier Bio 1L** (ID: 2)
   - Catégorie: Alimentation
   - Prix: 2.49 €
   - Stock: 3 unités (stock faible)

## Structure des données

### Produit

```json
{
  "id": "string",
  "name": "string",
  "category": "electronics|food|clothing|household|...",
  "brand": "string",
  "sku": "string",
  "price": "number",
  "cost": "number",
  "currency": "EUR",
  "stockQuantity": "number",
  "minStockLevel": "number",
  "maxStockLevel": "number",
  "status": "active|inactive|discontinued|coming_soon",
  "description": "string",
  "isPerishable": "boolean",
  "expiryDate": "ISO date string | null",
  "storageCondition": "string | null",
  "isFragile": "boolean",
  "requiresAgeVerification": "boolean",
  "tags": ["array", "of", "strings"],
  "images": ["array", "of", "image", "urls"],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Fonctionnalités disponibles

- ✅ Liste des produits
- ✅ Création de nouveaux produits
- ✅ Modification des produits existants
- ✅ Suppression des produits
- ✅ Recherche et filtrage
- ✅ Gestion du stock
- ✅ Formulaire multi-étapes avec validation

## Notes techniques

- Le fichier `db.json` est surveillé automatiquement par JSON Server
- Les changements dans `db.json` sont reflétés immédiatement dans l'API
- JSON Server fournit automatiquement les endpoints REST standard (GET, POST, PUT, DELETE)
- Les données persistent entre les redémarrages
- Backup recommandé du fichier `db.json` avant modifications importantes
