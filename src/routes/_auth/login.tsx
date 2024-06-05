import { zodResolver } from '@hookform/resolvers/zod';
import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Head } from '@/components/seo';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { loginUserSchema } from '@/db/schema';

const fallback = '/dashboard';

export const Route = createFileRoute('/_auth/login')({
  beforeLoad: ({ context, search }) => {
    console.log();
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect ?? fallback });
    }
  },
  component: Login,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
});

function Login() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth }),
  });
  const login = auth.useLogin({
    onSettled: () => navigate({ to: search.redirect ?? fallback }),
  });

  const form = useForm<z.infer<typeof loginUserSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginUserSchema),
  });

  async function handleLogin(values: z.infer<typeof loginUserSchema>) {
    setIsSubmitting(true);
    try {
      login.mutate(values);
      await router.invalidate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <>
      <Head description="Login page" title="Login" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your information below to login to your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit">
                Sign in
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Button
                  loading={isLoggingIn}
                  variant="link"
                  onClick={() => navigate({ to: '/register' })}
                >
                  Sign up
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
