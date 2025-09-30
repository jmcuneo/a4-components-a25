import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { register } from '@/services/authService'

import { UserContext } from "@/contexts/UserContext"
import { useContext } from 'react';
import { Link } from "react-router"

const PortalSchema = z.object({
  username: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  password_conf: z.string().min(1),
})

export default function PortalPage() {
  let userContext = useContext(UserContext)

  const form = useForm<z.infer<typeof PortalSchema>>({
    resolver: zodResolver(PortalSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_conf: ""
    },
  })

  function onSubmit(data: z.infer<typeof PortalSchema>) {
    register(data.username, data.email, data.password, data.password_conf, userContext);

    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is your username.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  This is your email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  This is your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_conf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is your password again.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Sign Up</Button>
        </form>
      </Form>
      <Button asChild className="focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80">
        <Link to="/login">Log In</Link>
      </Button>
      <Button asChild className="focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80">
        <a href="/auth/github"><GitHubLogoIcon /> Sign Up with Github</a>
      </Button>
    </>
  )
}
