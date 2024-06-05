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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/components/ui';
import { registerUserSchema } from '@/db/schema';
import { useTeams } from '@/modules/teams';

const fallback = '/dashboard';

export const Route = createFileRoute('/_auth/register')({
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect ?? fallback });
    }
  },
  component: Register,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
});

function Register() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth }),
  });
  const register = auth.useRegister({
    onSettled: () => navigate({ to: search.redirect ?? fallback }),
  });
  const [chooseTeam, setChooseTeam] = useState(false);

  const teamsQuery = useTeams({
    queryConfig: {
      enabled: chooseTeam,
    },
  });

  const form = useForm<z.infer<typeof registerUserSchema>>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      teamName: '',
    },
    resolver: zodResolver(registerUserSchema),
    shouldUnregister: true,
  });

  async function handleRegister(values: z.infer<typeof registerUserSchema>) {
    setIsSubmitting(true);
    try {
      register.mutate(values);
      await router.invalidate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRegistering = isLoading || isSubmitting;

  return (
    <>
      <Head description="Register page" title="Register" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your information below to register for an account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="john" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="flex items-center space-x-2">
                <Switch
                  checked={chooseTeam}
                  id="choose-team"
                  onCheckedChange={(value) => {
                    setChooseTeam(value);
                  }}
                />
                <Label htmlFor="choose-team">Join Existing Team</Label>
              </div>
              {chooseTeam && teamsQuery.data ? (
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamsQuery?.data.length > 0 ? (
                            teamsQuery?.data?.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="0">No Options</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ACME Inc." type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" loading={isRegistering} type="submit">
                Sign up
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Button
                  variant="link"
                  onClick={() => navigate({ to: '/login' })}
                >
                  Sign in
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
