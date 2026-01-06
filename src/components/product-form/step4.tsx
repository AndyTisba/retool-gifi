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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Step4Props {
  form: UseFormReturn<any>;
}

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  discontinued: "Arrêté",
  coming_soon: "Bientôt disponible",
};

const storageConditionLabels = {
  room_temperature: "Température ambiante",
  refrigerated: "Réfrigéré",
  frozen: "Congelé",
  dry_place: "Endroit sec",
  dark_place: "Endroit sombre",
};

export function ProductStep4({ form }: Step4Props) {
  const [newTag, setNewTag] = useState("");
  const isPerishable = form.watch("isPerishable");
  const requiresAgeVerification = form.watch("requiresAgeVerification");
  const tags = form.watch("tags") || [];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      form.setValue("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Configuration et options</h2>
        <p className="text-sm text-muted-foreground">
          Paramètres avancés et options spéciales du produit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">Statut et état</h3>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut du produit *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isPerishable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Produit périssable
                    </FormLabel>
                    <FormDescription>
                      Ce produit a une date de péremption
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isPerishable && (
              <>
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'expiration *</FormLabel>
                      <FormControl>
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Ex: 31122025 pour 31/12/2025"
                        />
                      </FormControl>
                      <FormDescription>
                        Format: jjmmaaaa (ex: 31122025)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storageCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conditions de stockage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez les conditions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(storageConditionLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium">Options spéciales</h3>

          <FormField
            control={form.control}
            name="isFragile"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Produit fragile</FormLabel>
                  <FormDescription>
                    Nécessite des précautions de manipulation
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiresAgeVerification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Vérification d'âge
                  </FormLabel>
                  <FormDescription>
                    Produit soumis à restriction d'âge
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {requiresAgeVerification && (
            <FormField
              control={form.control}
              name="minimumAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge minimum *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="99"
                      placeholder="18"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="warrantyPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garantie (mois)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="12"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined
                      )
                    }
                  />
                </FormControl>
                <FormDescription>Durée de garantie en mois</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Informations supplémentaires</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fournisseur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du fournisseur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fabrication</FormLabel>
                <FormControl>
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Ex: 15012024 pour 15/01/2024"
                  />
                </FormControl>
                <FormDescription>
                  Format: jjmmaaaa (ex: 15012024)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <Button type="button" onClick={addTag} variant="outline">
              Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
