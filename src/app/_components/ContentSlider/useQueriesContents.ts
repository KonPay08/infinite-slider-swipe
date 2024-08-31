import { useQueries } from "@tanstack/react-query";
import { fetchContents } from "../../../api/fetchContents";

export const useQueriesContents = (pageParams: number[], limit: number, enabled: boolean = true) => {
  console.log(pageParams)
  return useQueries({
    queries: pageParams.map(pageParam => ({
      queryKey: ['contents', pageParam, limit],
      queryFn: () => fetchContents({ pageParam, limit }),
      staleTime: Infinity,
      enabled,
    })),
    combine: (results) => {
      return {
        data: results.map(result => result.data),
        isFetching: results.some(result => result.isFetching),
        isFetched: results.every(result => result.isFetched),
      }
    }
  });
}