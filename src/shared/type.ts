export type Content = {
  id: number;
  content: string;
};

export type ContentsResponse = {
  contents: Content[];
  nextPage: number | null;
  total: number;
};