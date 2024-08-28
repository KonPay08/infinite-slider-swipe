import { useMemo } from "react";

export const useSliderSettings = (total: number, isFetching: boolean, setCurrentPage: (page: number) => void) => {
  return useMemo(() => ({
    infinite: total > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (newIndex: number) => {
      setCurrentPage(newIndex + 1);
    },
    draggable: !isFetching,
    centerMode: true,
  }), [total, isFetching]);
};