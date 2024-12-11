"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as React from "react"
import { Check, ChevronsUpDown, SquarePlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image"


const criticalityEnum = z.enum(["Low", "Medium", "High", "Critical"]);
const dataClassification = z.enum(["Unrestricted", "Confidential", "Protected", "Restricted"]);
const supportHours = z.enum(["Unsupported", "12x5", "24/7"]);
const dataRetentionPeriod = z.enum(["Unsupported", "12x5", "24/7"]);
const RTO = z.enum(["Unsupported", "12x5", "24/7"]);
const appType = z.enum(["API", "Cron"]);

const owners = [
    {
        value: "platformteam",
        label: "Platform Team",
    },
    {
        value: "digitalteam",
        label: "Digital Team",
    },
    {
        value: "identityteam",
        label: "Identity Team",
    },
    {
        value: "customerexperienceteam",
        label: "Customer Experience Team",
    },
    {
        value: "dataengineeringteam",
        label: "Data Engineering Team",
    },
]


const formSchema = z.object({
    gitRepositoryLocation: z.string().url({
        message: "Must be a valid URL",
    }),
    backstageFileLocation: z.string().optional(),
    applicationName: z.string(),
    owner: z.string(),
    // criticality: criticalityEnum,
})

export function CreateApplicationForm() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gitRepositoryLocation: "",
            backstageFileLocation: "",
            applicationName: "testing",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("submitted")
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h1>Add an application</h1>
                <Separator />
                <h2>1. Connect a Git Repository</h2>
                <FormField
                    control={form.control}
                    name="gitRepositoryLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Git Repository URL:</FormLabel>
                            <FormControl>
                                <Input placeholder="https://www.github.com/<yourorg>/<reponame>" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the URL to where the Git repository is hosted.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="backstageFileLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Backstage File Location</FormLabel>
                            <FormControl>
                                <Input placeholder="/catalog-info.yaml" {...field} />
                            </FormControl>
                            <FormDescription>
                                If you already use Backstage, this is the location of the Entity Description file within the above linked Git repository.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <h2>2. Application Details</h2>
                <FormField
                    control={form.control}
                    name="applicationName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Application Name</FormLabel>
                            <FormControl>
                                <Input placeholder="My App" {...field} />
                            </FormControl>
                            <FormDescription>
                                What you want to call the application. If a Backstage file was found, the name is taken from there.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormLabel>Owner:</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className=" justify-between bg-transparent"
                        >
                            {value
                                ? owners.find((owner) => owner.value === value)?.label
                                : "Select owner..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-max p-0">
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem><SquarePlus
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === value ? "opacity-100" : "opacity-0"
                                        )}
                                    />Create new team</CommandItem>
                                </CommandGroup></CommandList>
                        </Command>
                        <Command>
                            <CommandInput placeholder="Search owner..." />
                            <CommandList>
                                <CommandEmpty>No owner found.</CommandEmpty>
                                <CommandGroup>
                                    {owners.map((owner) => (
                                        <CommandItem
                                            key={owner.value}
                                            value={owner.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === owner.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {owner.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FormLabel>Criticality:</FormLabel>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {criticalityEnum.options.map((criticality) => (
                            <SelectItem key={criticality} value={criticality}>
                                {criticality}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormLabel>Data Classification:</FormLabel>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {dataClassification.options.map((dataClassification) => (
                            <SelectItem key={dataClassification} value={dataClassification}>
                                {dataClassification}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormLabel>Support Hours:</FormLabel>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {supportHours.options.map((supportHours) => (
                            <SelectItem key={supportHours} value={supportHours}>
                                {supportHours}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormLabel>Data Retention Period:</FormLabel>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {dataRetentionPeriod.options.map((dataRetentionPeriod) => (
                            <SelectItem key={dataRetentionPeriod} value={dataRetentionPeriod}>
                                {dataRetentionPeriod}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormLabel>Disaster Recovery Time Objective:</FormLabel>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {RTO.options.map((RTO) => (
                            <SelectItem key={RTO} value={RTO}>
                                {RTO}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Separator />
                <h2>3. Architecture</h2>
                <FormLabel>Application Type:</FormLabel>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {appType.options.map((appType) => (
                            <SelectItem key={appType} value={appType}>
                                {appType}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Image src="/architectureDemo.png" width={1200} height={900} alt={""} />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
