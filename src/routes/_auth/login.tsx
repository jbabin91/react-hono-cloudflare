import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

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
import { useLogin } from '@/modules/auth';

export const Route = createFileRoute('/_auth/login')({
  component: Login,
});

function Login() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const login = useLogin();

  const form = useForm<z.infer<typeof loginUserSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginUserSchema),
  });

  async function handleLogin(values: z.infer<typeof loginUserSchema>) {
    login.mutate(values);
    await router.invalidate();
  }

  return (
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
  );
}
