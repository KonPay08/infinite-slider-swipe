import axios from 'axios';
import { ContentsResponse } from '../shared/type';

export const fetchContents = async ({ pageParam, limit }: { pageParam: number; limit: number }): Promise<ContentsResponse> => {
  const response = await axios.get<ContentsResponse>(`/api/contents?page=${pageParam}&limit=${limit}`);
  return response.data;
};