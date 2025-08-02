"use client"

import { authClient } from "@/app/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the validation schema
const registerSchema = z.object({
  name: z.string()
    .min(2, "Il nome deve essere di almeno 2 caratteri")
    .max(50, "Il nome non può superare i 50 caratteri")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Il nome può contenere solo lettere e spazi"),
  surname: z.string()
    .min(2, "Il cognome deve essere di almeno 2 caratteri")
    .max(50, "Il cognome non può superare i 50 caratteri")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Il cognome può contenere solo lettere e spazi"),
  email: z.string()
    .email("Inserisci un indirizzo email valido")
    .min(1, "L'email è obbligatoria"),
  password: z.string()
    .min(8, "La password deve essere di almeno 8 caratteri")
    .max(100, "La password non può superare i 100 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: RegisterFormData) => {
    const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        lastname: data.surname,
    })
    if (response.error) {
            form.setError("root", {
                message: response.error.message ?? "Errore durante la registrazione",
                type: "manual",
        })
    } else {
    }
  }

  return <Card className="w-full max-w-md">
    <CardHeader className="text-2xl font-bold">Registrati</CardHeader>
    <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nome</FormLabel>
                    <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Inserisci il tuo nome"
                          {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Cognome</FormLabel>
                    <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Inserisci il tuo cognome"
                          {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                        <Input 
                          type="email" 
                          placeholder="esempio@email.com"
                          {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Inserisci la password"
                          {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Registrazione..." : "Registrati"}
              </Button>
            </form> 
        </Form>
    </CardContent>
  </Card>;
}