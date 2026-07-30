import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePhoto, listPhotos, uploadProgressPhoto } from '../api';

export function useProgressPhotos(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['progress-photos', userId],
    queryFn: () => listPhotos(userId),
    enabled: !!userId,
  });

  const upload = useMutation({
    mutationFn: ({ file, pose, stage }: { file: File; pose: string; stage: string }) =>
      uploadProgressPhoto(userId, file, pose, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress-photos', userId] }),
  });

  const remove = useMutation({
    mutationFn: ({ photoId, storagePath }: { photoId: string; storagePath: string }) =>
      deletePhoto(photoId, storagePath),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress-photos', userId] }),
  });

  return { photos: query.data, loading: query.isLoading, upload, remove };
}
