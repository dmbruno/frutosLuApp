import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listReplacementDays, createDay, deleteDay, uploadReplacementCoverImage } from '../api';

interface CreateReplacementInput {
  title: string;
  coverImageUrl: string | null;
}

export function useReplacementLibrary() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['replacement-days'], queryFn: listReplacementDays });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['replacement-days'] });

  const create = useMutation({
    mutationFn: ({ title, coverImageUrl }: CreateReplacementInput) =>
      createDay({ program_id: null, title, position: 1, format: 'intervalos', cover_image_url: coverImageUrl }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteDay(id),
    onSuccess: invalidate,
  });

  const uploadCoverImage = useMutation({
    mutationFn: (file: File) => uploadReplacementCoverImage(file),
  });

  return { ...query, create, remove, uploadCoverImage };
}
