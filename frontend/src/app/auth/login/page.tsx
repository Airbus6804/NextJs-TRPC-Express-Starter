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
const loginSchema = z.object({
  email: z.string()
    .email("Inserisci un indirizzo email valido")
    .min(1, "L'email è obbligatoria"),
  password: z.string()
    .min(8, "La password deve essere di almeno 8 caratteri")
    .max(100, "La password non può superare i 100 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: LoginFormData) => {

    const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
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
    <CardHeader className="text-2xl font-bold">Login</CardHeader>
    <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Inserisci il tuo indirizzo email"
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
                {form.formState.isSubmitting ? "Login..." : "Login"}
              </Button>
            </form> 
        </Form>
    </CardContent>
  </Card>;
}