import { useOne } from "@refinedev/core";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, ArrowLeft, Package, Euro, Warehouse } from "lucide-react";
import { ProductFormData } from "@/schemas/product";
// Fonction pour formater une date en dd/mm/yyyy
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Date invalide";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

const categoryLabels = {
  electronics: "Électronique",
  clothing: "Vêtements",
  food: "Alimentation",
  household: "Maison",
  garden: "Jardin",
  toys: "Jouets",
  beauty: "Beauté",
  sports: "Sport",
  books: "Livres",
  automotive: "Automobile",
};

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  discontinued: "Arrêté",
  coming_soon: "Bientôt disponible",
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  discontinued: "bg-red-100 text-red-800",
  coming_soon: "bg-blue-100 text-blue-800",
};

export function ProductShow() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    result: data,
    query: { isLoading, error },
  } = useOne<ProductFormData>({
    resource: "products",
    id: String(id) as string,
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error || !data) {
    return <div>Produit non trouvé</div>;
  }

  const product = data;
  const margin =
    product.price && product.cost
      ? (((product.price - product.cost) / product.price) * 100).toFixed(2)
      : "0";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              {product.brand} •{" "}
              {categoryLabels[product.category as keyof typeof categoryLabels]}
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/products/edit/${id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations principales */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations produit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  SKU
                </label>
                <p className="text-sm">{product.sku}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Code-barres
                </label>
                <p className="text-sm">{product.barcode || "Non défini"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Poids
                </label>
                <p className="text-sm">
                  {product.weight ? `${product.weight} kg` : "Non défini"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Couleur
                </label>
                <p className="text-sm">{product.color || "Non défini"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Taille
                </label>
                <p className="text-sm">{product.size || "Non défini"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Statut
                </label>
                <Badge
                  className={
                    statusColors[product.status as keyof typeof statusColors]
                  }
                >
                  {statusLabels[product.status as keyof typeof statusLabels]}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm mt-1">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prix et inventaire */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Tarification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Prix de vente
                </label>
                <p className="text-lg font-semibold">
                  {product.price?.toFixed(2)} {product.currency}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Coût d'achat
                </label>
                <p className="text-sm">
                  {product.cost?.toFixed(2)} {product.currency}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Marge: {margin}%</p>
                <p className="text-xs text-muted-foreground">
                  Bénéfice:{" "}
                  {((product.price || 0) - (product.cost || 0)).toFixed(2)}{" "}
                  {product.currency}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Inventaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Stock actuel
                </label>
                <p className="text-lg font-semibold">{product.stockQuantity}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Minimum
                  </label>
                  <p>{product.minStockLevel}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Maximum
                  </label>
                  <p>{product.maxStockLevel}</p>
                </div>
              </div>

              {product.stockQuantity <= product.minStockLevel && (
                <Badge className="bg-orange-100 text-orange-800 w-full justify-center">
                  Stock faible
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.isPerishable && (
          <Card>
            <CardHeader>
              <CardTitle>Informations de péremption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.expiryDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date d'expiration
                  </label>
                  <p className="text-sm">{formatDate(product.expiryDate)}</p>
                </div>
              )}
              {product.storageCondition && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Conditions de stockage
                  </label>
                  <p className="text-sm">{product.storageCondition}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Autres informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {product.supplier && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fournisseur
                </label>
                <p className="text-sm">{product.supplier}</p>
              </div>
            )}
            {product.warrantyPeriod && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Garantie
                </label>
                <p className="text-sm">{product.warrantyPeriod} mois</p>
              </div>
            )}
            {product.isFragile && <Badge variant="destructive">Fragile</Badge>}
            {product.requiresAgeVerification && (
              <Badge variant="secondary">
                Vérification d'âge requise ({product.minimumAge}+ ans)
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
