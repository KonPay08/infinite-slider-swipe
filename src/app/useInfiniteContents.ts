import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ContentsResponse } from './shared/type';

const LIMIT = 10;

const fetchContents = async ({ pageParam }: { pageParam: number }): Promise<ContentsResponse> => {
  const response = await axios.get<ContentsResponse>(`/api/reviews?page=${pageParam}&limit=${LIMIT}`);
  return response.data;
};

export const useInfiniteContents = () => {
  return useInfiniteQuery({
    queryKey: ['contents'],
    queryFn: fetchContents,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};