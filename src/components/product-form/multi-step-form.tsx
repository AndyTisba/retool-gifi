import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreate, useUpdate, useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import {
  baseProductSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "@/schemas/product";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Stepper,
  Step,
  StepButton,
  StepLabel,
  StepContent,
  StepSeparator,
} from "@/components/ui/stepper";
import { ProductStep1 } from "./step1";
import { ProductStep2 } from "./step2";
import { ProductStep3 } from "./step3";
import { ProductStep4 } from "./step4";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react";

interface ProductFormProps {
  mode: "create" | "edit";
}

const steps = [
  {
    id: 1,
    label: "Informations de base",
    description: "Nom, catégorie, marque",
  },
  { id: 2, label: "Détails produit", description: "SKU, poids, dimensions" },
  { id: 3, label: "Prix & inventaire", description: "Prix, coûts, stock" },
  { id: 4, label: "Configuration", description: "Options avancées" },
];

const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

export function ProductMultiStepForm({ mode }: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepsWithErrors, setStepsWithErrors] = useState<number[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutate: createProduct } = useCreate();
  const isCreating = false; // Temporaire pour la démo

  const { mutate: updateProduct } = useUpdate();
  const isUpdating = false; // Temporaire pour la démo

  const productDataQuery = useOne({
    resource: "products",
    id: id as string,
    queryOptions: {
      enabled: mode === "edit" && !!id,
    },
  });

  const productData = productDataQuery.query.data;
  const isLoadingProduct = productDataQuery.query.isLoading;

  const form = useForm({
    resolver: zodResolver(baseProductSchema),
    mode: "onBlur", // Valider quand l'utilisateur quitte un champ
    defaultValues: {
      name: "",
      category: "electronics",
      brand: "",
      barcode: "",
      description: "",
      sku: "",
      weight: undefined,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
      },
      unit: "piece",
      color: "",
      size: "",
      price: 0,
      cost: 0,
      currency: "EUR",
      stockQuantity: 0,
      minStockLevel: 0,
      maxStockLevel: 100,
      status: "active",
      isPerishable: false,
      expiryDate: undefined,
      storageCondition: undefined,
      isFragile: false,
      requiresAgeVerification: false,
      minimumAge: undefined,
      tags: [],
      supplier: "",
      manufacturingDate: undefined,
      warrantyPeriod: undefined,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(productData?.data
        ? { ...productData.data, id: productData.data.id?.toString() }
        : {}),
    },
  });

  // Validation d'étape
  const validateStep = async (stepNumber: number) => {
    const schema = stepSchemas[stepNumber - 1];
    const currentData = form.getValues();

    try {
      await schema.parseAsync(currentData);
      // Étape valide : ajouter aux complétées et retirer des erreurs
      if (!completedSteps.includes(stepNumber)) {
        setCompletedSteps((prev) => [...prev, stepNumber]);
      }
      setStepsWithErrors((prev) => prev.filter((step) => step !== stepNumber));
      return true;
    } catch (error) {
      // Étape avec erreurs : ajouter aux erreurs et retirer des complétées
      if (!stepsWithErrors.includes(stepNumber)) {
        setStepsWithErrors((prev) => [...prev, stepNumber]);
      }
      setCompletedSteps((prev) => prev.filter((step) => step !== stepNumber));

      // Déclencher la validation React Hook Form pour afficher les erreurs
      await form.trigger();

      // Message d'erreur plus informatif
      const stepName = steps[stepNumber - 1]?.label || `étape ${stepNumber}`;
      const errorCount = error.errors?.length || 1;
      toast.error(
        `${stepName}: ${errorCount} erreur${
          errorCount > 1 ? "s" : ""
        } à corriger`
      );
      return false;
    }
  };

  const nextStep = async () => {
    // Valider uniquement l'étape courante
    const isCurrentStepValid = await validateStep(currentStep);

    if (isCurrentStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = async (stepNumber: number) => {
    // Valider toutes les étapes précédentes
    for (let i = 1; i < stepNumber; i++) {
      if (!(await validateStep(i))) {
        return;
      }
    }
    setCurrentStep(stepNumber);
  };

  const onSubmit = async (data: Record<string, any>) => {
    try {
      // Valider toutes les étapes
      for (let i = 1; i <= steps.length; i++) {
        if (!(await validateStep(i))) {
          setCurrentStep(i);
          return;
        }
      }

      const processedData = {
        ...data,
        updatedAt: new Date(),
      };

      if (mode === "create") {
        createProduct(
          {
            resource: "products",
            values: processedData,
          },
          {
            onSuccess: () => {
              navigate("/products");
            },
          }
        );
      } else {
        updateProduct(
          {
            resource: "products",
            id: id as string,
            values: processedData,
          },
          {
            onSuccess: () => {
              navigate("/products");
            },
          }
        );
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement du produit");
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProductStep1 form={form} />;
      case 2:
        return <ProductStep2 form={form} />;
      case 3:
        return <ProductStep3 form={form} />;
      case 4:
        return <ProductStep4 form={form} />;
      default:
        return null;
    }
  };

  // Validation automatique de l'étape courante quand les données changent
  useEffect(() => {
    const subscription = form.watch(() => {
      // Valider l'étape courante silencieusement (sans toast)
      const schema = stepSchemas[currentStep - 1];
      const currentData = form.getValues();

      schema
        .parseAsync(currentData)
        .then(() => {
          // Étape valide
          if (!completedSteps.includes(currentStep)) {
            setCompletedSteps((prev) => [...prev, currentStep]);
          }
          setStepsWithErrors((prev) =>
            prev.filter((step) => step !== currentStep)
          );
        })
        .catch(() => {
          // Étape avec erreurs
          setCompletedSteps((prev) =>
            prev.filter((step) => step !== currentStep)
          );
          if (!stepsWithErrors.includes(currentStep)) {
            setStepsWithErrors((prev) => [...prev, currentStep]);
          }
        });
    });

    return () => subscription.unsubscribe();
  }, [currentStep, form, completedSteps, stepsWithErrors]);

  if (mode === "edit" && isLoadingProduct) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "create" ? "Créer un produit" : "Modifier le produit"}
          </CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />

            <Stepper className="w-full justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <Step>
                    <StepButton
                      isActive={currentStep === step.id}
                      isCompleted={completedSteps.includes(step.id)}
                      isError={stepsWithErrors.includes(step.id)}
                      onClick={() => goToStep(step.id)}
                      className="cursor-pointer"
                    >
                      {completedSteps.includes(step.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </StepButton>
                    <div className="ml-3">
                      <StepLabel
                        isActive={currentStep === step.id}
                        isCompleted={completedSteps.includes(step.id)}
                        isError={stepsWithErrors.includes(step.id)}
                        className="cursor-pointer"
                        onClick={() => goToStep(step.id)}
                      >
                        {step.label}
                      </StepLabel>
                      <div
                        className={`text-xs ${
                          stepsWithErrors.includes(step.id)
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stepsWithErrors.includes(step.id)
                          ? "Erreurs à corriger"
                          : step.description}
                      </div>
                    </div>
                  </Step>
                  {index < steps.length - 1 && (
                    <StepSeparator
                      className="mx-4 w-16"
                      isCompleted={completedSteps.includes(step.id)}
                    />
                  )}
                </div>
              ))}
            </Stepper>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <StepContent>{renderStepContent()}</StepContent>

              {/* Récapitulatif des erreurs */}
              {/* {stepsWithErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    Erreurs à corriger
                  </div>
                  <ul className="text-sm text-destructive space-y-1">
                    {stepsWithErrors.map((stepNum) => (
                      <li
                        key={stepNum}
                        className="cursor-pointer hover:underline"
                        onClick={() => setCurrentStep(stepNum)}
                      >
                        • {steps[stepNum - 1]?.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>

                <div className="flex gap-2">
                  {currentStep < steps.length ? (
                    <Button type="button" onClick={nextStep}>
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        isCreating || isUpdating || stepsWithErrors.length > 0
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {mode === "create" ? "Créer le produit" : "Sauvegarder"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
