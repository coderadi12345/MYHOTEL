import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { hotelsApi } from '../api/hotels.api'
import { queryKeys } from '../lib/queryClient'
import { useUiStore } from '../stores'
import { PageHeader } from '../components/common/PageHeader'
import { HotelForm } from '../components/hotels/HotelForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { PageLoader } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import type { CreateHotelDto, Hotel } from '../types/hotel.types'
import { formatRating } from '../utils/formatters'

export function AdminHotelsPage() {
  const queryClient = useQueryClient()
  const { showToast } = useUiStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Hotel | null>(null)

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: queryKeys.hotels.all,
    queryFn: hotelsApi.getAll,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.hotels.all })

  const createMutation = useMutation({
    mutationFn: hotelsApi.create,
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      showToast('Hotel created successfully', 'success')
    },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateHotelDto }) =>
      hotelsApi.update(id, data),
    onSuccess: () => {
      invalidate()
      setEditingHotel(null)
      showToast('Hotel updated successfully', 'success')
    },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: hotelsApi.delete,
    onSuccess: () => {
      invalidate()
      setDeleteConfirm(null)
      showToast('Hotel deleted', 'success')
    },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const handleCreate = async (data: CreateHotelDto) => {
    await createMutation.mutateAsync(data)
  }

  const handleUpdate = async (data: CreateHotelDto) => {
    if (editingHotel) await updateMutation.mutateAsync({ id: editingHotel.id, data })
  }

  return (
    <div>
      <PageHeader
        title="Hotel Management"
        description="Create, edit, and delete hotels via PlainAPI"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Hotel
          </Button>
        }
      />

      {error && (
        <Alert variant="error" className="mb-6">
          {(error as Error).message}
        </Alert>
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">ID</th>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Location</th>
                <th className="px-4 py-3 font-medium text-slate-700">Rating</th>
                <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels?.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">#{hotel.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{hotel.name}</td>
                  <td className="px-4 py-3 text-slate-600">{hotel.location}</td>
                  <td className="px-4 py-3">
                    {hotel.rating ? (
                      <Badge variant="info">{formatRating(hotel.rating)}</Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingHotel(hotel)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(hotel)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!hotels?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    <Building2 className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    No hotels yet. Add your first hotel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Hotel">
        <HotelForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
          loading={createMutation.isPending}
        />
      </Modal>

      <Modal
        open={!!editingHotel}
        onClose={() => setEditingHotel(null)}
        title="Edit Hotel"
      >
        {editingHotel && (
          <HotelForm
            hotel={editingHotel}
            onSubmit={handleUpdate}
            onCancel={() => setEditingHotel(null)}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Hotel"
        size="sm"
      >
        {deleteConfirm && (
          <div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              This is a soft delete.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteConfirm.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
