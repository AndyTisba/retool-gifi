import { useState } from "react";
import { useNavigation, useDelete, useList } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

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
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  discontinued: "bg-red-100 text-red-800 hover:bg-red-200",
  coming_soon: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

export function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { create, edit, show } = useNavigation();
  const { mutate: deleteProduct } = useDelete();

  // Récupération des données depuis l'API locale
  const {
    result: { data: productData },
    query: { isLoading },
  } = useList({
    resource: "products",
  });

  // Filtrage simple
  const filteredProducts = productData.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistiques
  const totalProducts = productData.length;
  const activeProducts = productData.filter(
    (p) => p.status === "active"
  ).length;
  const lowStockProducts = productData.filter(
    (p) => p.stockQuantity <= p.minStockLevel
  ).length;
  const totalValue = productData.reduce(
    (acc, p) => acc + p.price * p.stockQuantity,
    0
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des produits</h1>
          <p className="text-muted-foreground">
            Gérez l'inventaire de votre supermarché Gifi
          </p>
        </div>
        <Button onClick={() => create("products")}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produits actifs
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts > 0
                ? ((activeProducts / totalProducts) * 100).toFixed(1)
                : 0}
              % du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Nécessitent un réapprovisionnement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur stock</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toFixed(0)}€</div>
            <p className="text-xs text-muted-foreground">
              Valeur totale de l'inventaire
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, SKU, marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => show("products", product.id)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.sku}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {
                            categoryLabels[
                              product.category as keyof typeof categoryLabels
                            ]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {product.price.toFixed(2)} {product.currency}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-2 ${
                            product.stockQuantity <= product.minStockLevel
                              ? "text-orange-600"
                              : ""
                          }`}
                        >
                          {product.stockQuantity <= product.minStockLevel && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {product.stockQuantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            statusColors[
                              product.status as keyof typeof statusColors
                            ]
                          }
                        >
                          {
                            statusLabels[
                              product.status as keyof typeof statusLabels
                            ]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(product.sku)
                              }
                            >
                              Copier le SKU
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => show("products", product.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => edit("products", product.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Êtes-vous sûr de vouloir supprimer ce produit ?"
                                  )
                                ) {
                                  deleteProduct({
                                    resource: "products",
                                    id: product.id,
                                  });
                                }
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {isLoading
                        ? "Chargement des produits..."
                        : searchQuery
                        ? "Aucun produit trouvé."
                        : "Aucun produit dans l'inventaire."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
