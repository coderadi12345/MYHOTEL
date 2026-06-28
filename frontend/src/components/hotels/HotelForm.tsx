import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CreateHotelDto, Hotel } from '../../types/hotel.types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const hotelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  location: z.string().min(1, 'Location is required'),
  rating: z.number().min(0).max(5).optional(),
  ratingCount: z.number().min(0).optional(),
})

type HotelFormData = z.infer<typeof hotelSchema>

interface HotelFormProps {
  hotel?: Hotel
  onSubmit: (data: CreateHotelDto) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function HotelForm({ hotel, onSubmit, onCancel, loading }: HotelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel?.name ?? '',
      address: hotel?.address ?? '',
      location: hotel?.location ?? '',
      rating: hotel?.rating ?? undefined,
      ratingCount: hotel?.ratingCount ?? undefined,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Hotel Name"
        id="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Address"
        id="address"
        error={errors.address?.message}
        {...register('address')}
      />
      <Input
        label="Location"
        id="location"
        error={errors.location?.message}
        {...register('location')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Rating (0–5)"
          id="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          error={errors.rating?.message}
          {...register('rating', { valueAsNumber: true })}
        />
        <Input
          label="Review Count"
          id="ratingCount"
          type="number"
          min="0"
          error={errors.ratingCount?.message}
          {...register('ratingCount', { valueAsNumber: true })}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {hotel ? 'Update Hotel' : 'Create Hotel'}
        </Button>
      </div>
    </form>
  )
}
