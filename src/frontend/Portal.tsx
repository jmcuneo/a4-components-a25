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

import { sendLog } from '@/services/dataService';

import { UserContext } from "@/contexts/UserContext"
import { useContext } from 'react';
import { Link } from "react-router"

const PortalSchema = z.object({
  battle_id: z.string().min(1).default(() => crypto.randomUUID()),
  my_ship_name: z.string(),
  my_ship_id: z.string(),
  opposing_ship_name: z.string(),
  opposing_ship_id: z.string(),
  start_year: z.number(),
  start_day: z.number(),
  start_hour: z.number(),
  start_minute: z.number(),
  end_year: z.number(),
  end_month: z.number(),
  end_day: z.number(),
  end_hour: z.number(),
  end_minute: z.number(),
  damage_report: z.string(),
})

export default function PortalPage() {
  const currentYear = 2187;
  const months = [
    "*month*",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const days = ["*day*", ...Array.from({ length: 31 }, (_, i) => String(i + 1))]
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear + i))
  const hours = ["*hour*", ...Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))]
  const minutes = ["*minute*", ...Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))]

  const form = useForm<z.infer<typeof PortalSchema>>({
    resolver: zodResolver(PortalSchema),
    defaultValues: {
      battle_id: "",
      my_ship_name: "",
      my_ship_id: "",
      opposing_ship_name: "",
      opposing_ship_id: "",
      start_year: currentYear,
      start_month: undefined,
      start_day: undefined,
      start_hour: undefined,
      start_minute: undefined,
      end_year: currentYear,
      end_month: undefined,
      end_day: undefined,
      end_hour: undefined,
      end_minute: undefined,
      damage_report: "",
    },
  })

  function onSubmit(data: z.infer<typeof PortalSchema>) {
    sendLog(data);

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
