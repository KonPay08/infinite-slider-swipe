import { useQuery } from "@tanstack/react-query"
import { fetchContents } from "../../../api/fetchContents"

export const useQueryContents = (pageParam: number, limit: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['contents', pageParam, limit],
    queryFn: () => fetchContents({ pageParam, limit }),
    staleTime: Infinity,
    enabled,
  })
};
