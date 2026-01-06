import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/schemas/product";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Step3Props {
  form: UseFormReturn<any>;
}

export function ProductStep3({ form }: Step3Props) {
  const watchedPrice = form.watch("price");
  const watchedCost = form.watch("cost");
  const margin =
    watchedPrice && watchedCost
      ? (((watchedPrice - watchedCost) / watchedPrice) * 100).toFixed(2)
      : "0";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Prix et inventaire</h2>
        <p className="text-sm text-muted-foreground">
          Gérez les prix, coûts et niveaux de stock du produit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">Tarification</h3>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de vente * (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coût d'achat * (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedPrice && watchedCost && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">
                Marge bénéficiaire: {margin}%
              </p>
              <p className="text-xs text-muted-foreground">
                Bénéfice: {(watchedPrice - watchedCost).toFixed(2)}€
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium">Inventaire</h3>

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité en stock *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau minimum *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : 0
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Seuil d'alerte pour le réapprovisionnement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxStockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau maximum *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : 100
                      )
                    }
                  />
                </FormControl>
                <FormDescription>Capacité maximale de stockage</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Devise</FormLabel>
              <FormControl>
                <Input placeholder="EUR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
