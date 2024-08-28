'use client'

import { useState, useRef, useEffect, useMemo } from "react";
import Slider from "react-slick";
import { useQueryContents } from "./useQueryContents";
import { Content } from "../../../shared/type";
import Card from "../../../presentation/Card";
import { useSliderSettings } from "./useSliderSettings";

type Mode = "1" | '3';

const ContentSlider = () => {
  const [mode, setMode] = useState<Mode>('1');
  const limit = mode === '1' ? 1 : 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [contents, setContents] = useState<Content[]>([]);
  const sliderRef = useRef<Slider>(null);

  const { data: currentData, isLoading, isFetching: isCurrentFetching } = useQueryContents(currentPage, limit);
  const { data: prevData, isFetching: isPrevFetching } = useQueryContents(
    currentPage === 1 ? Math.ceil(total / limit) : currentPage - 1,
    limit,
    !!total
  );
  const { data: nextData, isFetching: isNextFetching } = useQueryContents(
    currentPage === Math.ceil(total / limit) ? 1 : currentPage + 1, // 最後のページが現在のページなら次は1に戻る
    limit,
    !!total
  );

  const isFetching = useMemo(() => isCurrentFetching || isPrevFetching || isNextFetching, [isCurrentFetching, isPrevFetching, isNextFetching]);

  useEffect(() => {
    if (currentData) {
      if (total === 0) {
        const totalItems = currentData.total;
        const adjustedTotal = mode === "3" ? Math.ceil(totalItems / 3) : totalItems;
        setTotal(adjustedTotal);
        const initialContents = Array.from({ length: currentData.total }, (_, i) => ({
          id: i + 1,
          content: '',
        }));
        setContents(initialContents);
      }
    }
  }, [currentData, total]);

  useEffect(() => {
    if (!isFetching && currentData && nextData && prevData) {
      setContents((prevContents) => {
        const newContents = [...prevContents];
        // 現在のデータをセット
        currentData.contents.forEach((item) => {
            newContents[item.id - 1] = item;
        });
        // 次のデータをセット
        nextData.contents.forEach((item) => {
            newContents[item.id - 1] = item;
        });
        // 前のデータをセット
        prevData.contents.forEach((item) => {
            newContents[item.id - 1] = item;
        });
        return newContents;
      });
    }
}, [currentData, prevData, nextData, isFetching]);

  const settings = useSliderSettings(total, isFetching, setCurrentPage);

  const handleModeChange = () => {
    setMode(mode === '1' ? '3' : '1');
    setCurrentPage(1);
  }

  if (isLoading && contents.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[500px] mx-auto mt-10">
      <div className="flex justify-end">
        <button
          onClick={handleModeChange}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300"
        >
          モードチェンジ
        </button>
      </div>
      <h2 className='text-center text-lg font-bold mb-4'>{`${currentPage} / ${mode === '1' ? total : Math.ceil(total / 3)}`}</h2>
      <p className='text-center'>スワイプでスライドできます</p>
      <Slider ref={sliderRef} {...settings} className='min-h-max' key={mode}>
        {mode === '1'
          ? contents.map((content) => (
              <Card key={content.id} content={content.content} />
            ))
          : Array.from({ length: Math.ceil(contents.length / 3) }).map((_, slideIndex) => (
              <div key={slideIndex}>
                <div className="flex flex-col text-center min-h-max">
                  {contents.slice(slideIndex * 3, slideIndex * 3 + 3).map((content) => (
                    <Card key={content.id} content={content.content} />
                  ))}
                </div>
              </div>
            ))}
      </Slider>
    </div>
  );
};

export default ContentSlider;