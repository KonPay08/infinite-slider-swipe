import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchContents } from "../../../api/fetchContents"

export const useInfiniteContents = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ['infiniteContents'],
    queryFn: ({ pageParam }) => fetchContents({ pageParam, limit }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};