import { z } from "zod";

// Énumérations pour les options
export const ProductCategory = z.enum([
    "electronics",
    "clothing",
    "food",
    "household",
    "garden",
    "toys",
    "beauty",
    "sports",
    "books",
    "automotive"
]);

export const ProductStatus = z.enum([
    "active",
    "inactive",
    "discontinued",
    "coming_soon"
]);

export const ProductUnit = z.enum([
    "piece",
    "kg",
    "g",
    "l",
    "ml",
    "m",
    "cm",
    "pack",
    "box",
    "bottle"
]);

export const StorageCondition = z.enum([
    "room_temperature",
    "refrigerated",
    "frozen",
    "dry_place",
    "dark_place"
]);

// Schéma principal du produit
export const productSchema = z.object({
    // Étape 1: Informations de base
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    category: ProductCategory,
    brand: z.string().min(1, "La marque est obligatoire"),
    barcode: z.string().min(8, "Le code-barres doit contenir au moins 8 caractères").optional(),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),

    // Étape 2: Détails du produit
    sku: z.string().min(3, "Le SKU doit contenir au moins 3 caractères"),
    weight: z.number().positive("Le poids doit être positif").optional(),
    dimensions: z.object({
        length: z.number().positive().optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
    }).optional(),
    unit: ProductUnit,
    color: z.string().optional(),
    size: z.string().optional(),

    // Étape 3: Prix et inventaire
    price: z.number().positive("Le prix doit être positif"),
    cost: z.number().positive("Le coût doit être positif"),
    currency: z.string().default("EUR"),
    stockQuantity: z.number().int().min(0, "La quantité doit être positive ou nulle"),
    minStockLevel: z.number().int().min(0, "Le niveau minimum doit être positif ou nul"),
    maxStockLevel: z.number().int().min(1, "Le niveau maximum doit être supérieur à 0"),

    // Étape 4: Configuration et options
    status: ProductStatus,
    isPerishable: z.boolean().default(false),
    expiryDate: z.date().optional(),
    storageCondition: StorageCondition.optional(),
    isFragile: z.boolean().default(false),
    requiresAgeVerification: z.boolean().default(false),
    minimumAge: z.number().int().min(0).max(99).optional(),
    tags: z.array(z.string()).default([]),
    supplier: z.string().optional(),
    manufacturingDate: z.date().optional(),
    warrantyPeriod: z.number().int().min(0).optional(), // en mois
    images: z.array(z.string()).default([]),

    // Métadonnées
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
}).refine((data) => {
    // Validation conditionnelle: si périssable, date d'expiration requise
    if (data.isPerishable && !data.expiryDate) {
        return false;
    }
    return true;
}, {
    message: "La date d'expiration est obligatoire pour les produits périssables",
    path: ["expiryDate"],
}).refine((data) => {
    // Validation conditionnelle: si vérification d'âge requise, âge minimum requis
    if (data.requiresAgeVerification && !data.minimumAge) {
        return false;
    }
    return true;
}, {
    message: "L'âge minimum est obligatoire si la vérification d'âge est requise",
    path: ["minimumAge"],
}).refine((data) => {
    // Validation conditionnelle: le coût ne doit pas être supérieur au prix
    return data.cost <= data.price;
}, {
    message: "Le coût ne peut pas être supérieur au prix de vente",
    path: ["cost"],
}).refine((data) => {
    // Validation conditionnelle: le niveau minimum ne doit pas être supérieur au niveau maximum
    return data.minStockLevel <= data.maxStockLevel;
}, {
    message: "Le niveau minimum ne peut pas être supérieur au niveau maximum",
    path: ["minStockLevel"],
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schéma de base pour les étapes (sans les refinements complexes)
export const baseProductSchema = z.object({
    id: z.string().optional(),
    // Étape 1: Informations de base
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    category: ProductCategory,
    brand: z.string().min(1, "La marque est obligatoire"),
    barcode: z.string().min(8, "Le code-barres doit contenir au moins 8 caractères").optional(),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),

    // Étape 2: Détails du produit
    sku: z.string().min(3, "Le SKU doit contenir au moins 3 caractères"),
    weight: z.number().positive("Le poids doit être positif").optional(),
    dimensions: z.object({
        length: z.number().positive().optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
    }).optional(),
    unit: ProductUnit,
    color: z.string().optional(),
    size: z.string().optional(),

    // Étape 3: Prix et inventaire
    price: z.number().positive("Le prix doit être positif"),
    cost: z.number().positive("Le coût doit être positif"),
    currency: z.string().default("EUR"),
    stockQuantity: z.number().int().min(0, "La quantité doit être positive ou nulle"),
    minStockLevel: z.number().int().min(0, "Le niveau minimum doit être positif ou nul"),
    maxStockLevel: z.number().int().min(1, "Le niveau maximum doit être supérieur à 0"),

    // Étape 4: Configuration et options
    status: ProductStatus,
    isPerishable: z.boolean().default(false),
    expiryDate: z.date().optional(),
    storageCondition: StorageCondition.optional(),
    isFragile: z.boolean().default(false),
    requiresAgeVerification: z.boolean().default(false),
    minimumAge: z.number().int().min(0).max(99).optional(),
    tags: z.array(z.string()).default([]),
    supplier: z.string().optional(),
    manufacturingDate: z.date().optional(),
    warrantyPeriod: z.number().int().min(0).optional(),
    images: z.array(z.string()).default([]),

    // Métadonnées
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

// Schémas pour chaque étape
export const step1Schema = baseProductSchema.pick({
    name: true,
    category: true,
    brand: true,
    barcode: true,
    description: true,
});

export const step2Schema = baseProductSchema.pick({
    sku: true,
    weight: true,
    dimensions: true,
    unit: true,
    color: true,
    size: true,
});

export const step3Schema = baseProductSchema.pick({
    price: true,
    cost: true,
    currency: true,
    stockQuantity: true,
    minStockLevel: true,
    maxStockLevel: true,
});

export const step4Schema = baseProductSchema.pick({
    status: true,
    isPerishable: true,
    expiryDate: true,
    storageCondition: true,
    isFragile: true,
    requiresAgeVerification: true,
    minimumAge: true,
    tags: true,
    supplier: true,
    manufacturingDate: true,
    warrantyPeriod: true,
    images: true,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;