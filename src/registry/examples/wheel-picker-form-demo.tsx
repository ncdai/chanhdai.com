"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import type { WheelPickerOption } from "@/registry/components/wheel-picker"
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@/registry/components/wheel-picker"

const formSchema = z.object({
  framework: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

export default function WheelPickerFormDemo() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: "nextjs",
    },
  })

  const onSubmit: SubmitHandler<FormSchema> = (values) => {
    toast.add({
      title: "You submitted the following values:",
      // Toast descriptions render a <p>, so the block uses <code> instead of <pre>.
      description: (
        <code className="mt-2 block w-full rounded-md border p-4 whitespace-pre">
          {JSON.stringify(values, null, 2)}
        </code>
      ),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-56 max-w-full">
      <FieldGroup>
        <Controller
          control={control}
          name="framework"
          render={({ field }) => (
            <Field data-invalid={!!errors.framework}>
              <FieldLabel>Framework</FieldLabel>

              <WheelPickerWrapper>
                <WheelPicker
                  options={options}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </WheelPickerWrapper>

              {errors.framework && (
                <FieldError>{errors.framework.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Field>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const options: WheelPickerOption[] = [
  {
    label: "Vite",
    value: "vite",
  },
  {
    label: "Laravel",
    value: "laravel",
    disabled: true,
  },
  {
    label: "React Router",
    value: "react-router",
  },
  {
    label: "Next.js",
    value: "nextjs",
  },
  {
    label: "Astro",
    value: "astro",
  },
  {
    label: "TanStack Start",
    value: "tanstack-start",
  },
  {
    label: "TanStack Router",
    value: "tanstack-router",
  },
  {
    label: "Gatsby",
    value: "gatsby",
  },
]
