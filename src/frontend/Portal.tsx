
import { useContext, useEffect, useState } from 'react';
import { Link } from "react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { deleteBattle, getBattles, sendLog } from '@/services/dataService';

import { UserContext } from "@/contexts/UserContext"
import { Textarea } from "@/components/ui/textarea"
import { LogOutIcon, RefreshCw, Trash } from "lucide-react"

const PortalSchema = z.object({
  battle_id: z.string(),
  my_ship_name: z.string(),
  my_ship_id: z.string(),
  opposing_ship_name: z.string(),
  opposing_ship_id: z.string(),
  start_year: z.string(),
  start_month: z.string(),
  start_day: z.string(),
  start_hour: z.string(),
  start_minute: z.string(),
  end_year: z.string(),
  end_month: z.string(),
  end_day: z.string(),
  end_hour: z.string(),
  end_minute: z.string(),
  damage_report: z.string(),
})


export default function PortalPage() {
  const [userLogs, updateUserLogs] = useState(null)
  const {user, setUser} = useContext(UserContext);

  const currentYear = "2187";
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
  const years = Array.from({ length: 5 }, (_, i) => String(parseInt(currentYear) + i))
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
      start_month: "*month*",
      start_day: "*day*",
      start_hour: "*hour*",
      start_minute: "*minute*",
      end_year: currentYear,
      end_month: "*month*",
      end_day: "*day*",
      end_hour: "*hour*",
      end_minute: "*minute*",
      damage_report: "",
    },
    shouldUnregister: false,
  })

  function onSubmit(data: z.infer<typeof PortalSchema>) {
    console.log(sendLog(data));
    refreshData()

    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  function deleteItem(battleId: String) {
    console.log(deleteBattle(battleId));
    refreshData();
  }

  function refreshData() {
    try {
      // 100 ms delay to allow for the DB to update
      setTimeout(() => {
        getBattles()
        .then(response => {
            updateUserLogs(response!.data)
        })
        .catch(error => {
            console.error('Error:', error); // Handle errors
        });
      }, 100);
    } catch (error) {
      console.warn('Error logging in', error);
      return null;
    }
  }

  function populateById() {
    const data = userLogs!.find(battle => battle.battle_id === form.getValues().battle_id)
    console.log(data);
    
    for (const key in data) {
      const value: any = data[key];

      try {
        switch (key) {
          case "start":
            const start_date = new Date(value)
            form.setValue("start_minute", start_date.getMinutes().toString())
            form.setValue("start_hour", start_date.getHours().toString())
            form.setValue("start_day", start_date.getDate().toString())
            form.setValue("start_month", start_date.getMonth().toString())
            form.setValue("start_year", start_date.getFullYear().toString())
            break;
          case "end":
            const end_date = new Date(value)
            form.setValue("end_minute", end_date.getMinutes().toString())
            form.setValue("end_hour", end_date.getHours().toString())
            form.setValue("end_day", end_date.getDate().toString())
            form.setValue("end_month", end_date.getMonth().toString())
            form.setValue("end_year", end_date.getFullYear().toString())
            break;
          case "battle_id":
            form.setValue("battle_id", value)
            break;
          case "my_ship_name":
            form.setValue("my_ship_name", value)
            break;
          case "my_ship_id":
            form.setValue("my_ship_id", value)
            break;
          case "opposing_ship_name":
            form.setValue("opposing_ship_name", value)
            break;
          case "opposing_ship_id":
            form.setValue("opposing_ship_id", value)
            break;
          case "damage_report":
            form.setValue("damage_report", value)
            break;
          default:
            console.log(`Did not fill any value with name ${key}`)
            break;
        }
      } catch {
        console.log(`Unable to fill element with name ${key}`)
      }
    }
  }

  function DataBlocks({data} : {data: Array<any>}) {
    if (!data) return <></>;

    return (
      <>
        {data.map((element, i) => {
          return (
            <div>
              <p>ARRAY_INDEX {i.toString()}</p>
              <p>{JSON.stringify(element)}</p>
              <Button onClick={() => deleteItem(element.battle_id)}><Trash /></Button>
            </div>
          );
        })}
      </>
    );
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <>
      {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Log Entry Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Log Entry:</h2>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="battle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battle ID:</FormLabel>
                          <Input placeholder="Battle ID" {...field} />
                          <FormDescription>(Leave blank for new battle)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="secondary" className="w-full" onClick={() => populateById()}>
                      Populate from ID
                    </Button>
                  </div>
                </section>

                {/* My Ship Info Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">My Ship Info:</h2>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="my_ship_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ship Name:</FormLabel>
                          <Input placeholder="Ship Name" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="my_ship_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ship ID Number:</FormLabel>
                          <Input placeholder="XX-XXX" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Opposing Force's Info Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Opposing Force's Info:</h2>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="opposing_ship_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ship Name:</FormLabel>
                          <Input placeholder="Ship Name" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="opposing_ship_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ship ID Number:</FormLabel>
                          <Input placeholder="XX-XXX" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Summary Info Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Summary Info:</h2>
                  <div className="space-y-4">
                    {/* Start Date */}
                    <div>
                      <FormLabel>Start Date:</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <FormField
                          control={form.control}
                          name="start_month"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {months.map((month, i) => (
                                    <SelectItem key={i+1} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="start_day"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {days.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="start_year"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Start Time */}
                    <div>
                      <FormLabel>Start Time:</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <FormField
                          control={form.control}
                          name="start_hour"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {hours.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <span className="flex items-center">:</span>
                        <FormField
                          control={form.control}
                          name="start_minute"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minutes.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <FormLabel>End Date:</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <FormField
                          control={form.control}
                          name="end_month"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {months.map((month, i) => (
                                    <SelectItem key={i+1} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="end_day"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {days.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="end_year"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* End Time */}
                    <div>
                      <FormLabel>End Time:</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <FormField
                          control={form.control}
                          name="end_hour"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {hours.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <span className="flex items-center">:</span>
                        <FormField
                          control={form.control}
                          name="end_minute"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minutes.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Damage Report Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Damage Report</h2>
                  <FormField
                    control={form.control}
                    name="damage_report"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea placeholder="begin damage report..." className="min-h-[200px] font-mono" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                {/* Submit Button */}
                <Button type="submit">
                  Submit Log Entry
                </Button>
              </form>
            </Form>
          </div>

          {/* Right Column - Profile and Current Log */}
          <div className="space-y-8">
            {/* My Profile Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">My Profile:</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Username:</span> {user.username}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <Button asChild>
                  <a href="/auth/logout"><LogOutIcon /> Log Out</a>
                </Button>
              </div>
            </section>

            {/* My Current Log Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">My Current Log:</h2>
              <Button onClick={() => refreshData()}>
                <RefreshCw /> Refresh Database
              </Button>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-auto max-h-[600px]">
                <pre className="whitespace-pre-wrap break-words">
                  <DataBlocks data={userLogs} />
                </pre>
              </div>
            </section>
          </div>
        </div>
    </>
  )
}
