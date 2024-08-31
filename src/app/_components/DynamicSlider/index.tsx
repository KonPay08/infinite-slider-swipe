'use client'

import Slider from 'react-slick';
import { Content, ContentsResponse } from "../../../shared/type";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from '../../../presentation/Card';
import { useQueryContents } from '../ContentSlider/useQueryContents';
import { useQueriesContents } from '../ContentSlider/useQueriesContents';

type Mode = "1" | '3';

const INITIAL_PAGE = 1;
const INITIAL_TOTAL = 0;
const INITIAL_CONTENTS: Content[] = [];

const DynamicSlider = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [mode, setMode] = useState<Mode>('1');
  const [contents, setContents] = useState<Content[]>(INITIAL_CONTENTS);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [total, setTotal] = useState(INITIAL_TOTAL);
  const limit = mode === '1' ? 1 : 3;
  const [isSlide, setIsSlide] = useState(false);

  const { data: initialFetchContents } = useQueryContents(currentPage, limit);

  const getPageParams = useCallback(() => [
    currentPage,
    currentPage === total ? INITIAL_PAGE : currentPage + 1,
    currentPage === 1 ? total : currentPage - 1,
  ], [currentPage, total]);

  const { data: fetchContents, isFetching, isFetched } = useQueriesContents(getPageParams(), limit, !!initialFetchContents && !!total);

  const handleModeChange = () => {
    setMode(mode === '1' ? '3' : '1');
    setCurrentPage(INITIAL_PAGE);
    setContents(INITIAL_CONTENTS);
    setTotal(INITIAL_TOTAL);
  };

  const handleSliderChange = useCallback((newIndex: number) => {
    setCurrentPage(prev => {
      // next
      if (newIndex === 1) {
        return prev === total ? INITIAL_PAGE : prev + 1;
      
      // prev
      } else {
        return prev === INITIAL_PAGE ? total : prev - 1;
      }
    });
    setIsSlide(true);
  }, [total]);

  const settings = {
    infinite: total > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    afterChange: handleSliderChange,
  };

  const updateContents = useCallback((fetchContents: (ContentsResponse | undefined)[]) => {
    const newContents = fetchContents.flatMap(result => result?.contents ?? []);
    setContents(() => {
      return newContents.reduce((acc, content) => {
        if (!acc.some(existingContent => existingContent.id === content.id)) {
          acc.push(content);
        }
        return acc;
      }, [] as Content[]);
    });
  }, [total]);

  // トータルをセットする
  useEffect(() => {
    if (initialFetchContents) {
      const calculatedTotal = mode === '1' ? initialFetchContents.total : Math.ceil(initialFetchContents.total / limit);
      setTotal(calculatedTotal);
    }
  }, [initialFetchContents, mode, limit]);

  // スライド時に新しいコンテンツをセットする
  useEffect(() => {
    if(isSlide && fetchContents && isFetching) {
      updateContents(fetchContents);
      setIsSlide(false);
      return;
    };
  }, [fetchContents, isFetching, isSlide, updateContents]);

  // // 初回表示データをセットする
  useEffect(() => {
    if(isFetched && contents.length === 0) {
      updateContents(fetchContents);
    }
  }, [fetchContents, isFetching, isSlide, updateContents, contents, isFetched]);

  return isFetched ? (
    <div className="w-[500px] mx-auto mt-10">
      <button
          onClick={handleModeChange}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300"
        >
          モードチェンジ
      </button>
      <h2 className='text-center text-lg font-bold mb-4'>{`${currentPage} / ${total}`}</h2>
      <p className='text-center'>スワイプでスライドできます</p>
      <Slider ref={sliderRef} {...settings} className='min-h-max' key={contents[0]?.id}>
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
  ) : null;
}

export default DynamicSlider;