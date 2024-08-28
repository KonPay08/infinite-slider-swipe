'use client';

import Slider, { Settings } from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useRef, useState } from 'react';
import { useInfiniteContents } from './useInfiniteContents';
import Card from '../../../presentation/Card';

const LIMIT = 10;

const InfiniteContentSlider: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteContents(LIMIT);
  
  const contents = data?.pages.flatMap(page => page.contents) || [];
  const totalContents = data?.pages[0]?.total || 0;

  const settings: Settings = {
    infinite: !hasNextPage,
    speed: 500,
    // swipe: mode === 'single',
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: mode === 'single', // 中央のスライドを強調表示
    centerPadding: '60px', // 左右にパディングを追加して次のスライドを少し表示
    arrows: false,
    afterChange: async (index: number) => {
      setCurrentSlide(index);

      // もうすぐ最後のスライドに到達する場合、次のページをプリフェッチ
      if (mode === 'single') {
        // シングルモードの場合、最後の3スライド前にフェッチ
        if (index >= contents.length - 3 && hasNextPage && !isFetchingNextPage) {
          await fetchNextPage();
          
        }
      } else {
        // マルチモードの場合、最後のスライドの3つ前のグループでフェッチ
        if ((index >= (Math.floor(contents.length / 3)) -3) && hasNextPage && !isFetchingNextPage) {
          await fetchNextPage();
          
        }
      }
    },
  };

  const handleModeChange = () => {
    setMode(() => mode === 'single' ? 'multi' : 'single');
    setCurrentSlide(0);
    sliderRef.current?.slickGoTo(0);
  };

  if (contents.length === 0) return null;

  return (
    <section className="w-[500px] mx-auto py-5">
      <div className="flex justify-end">
        <button
          onClick={handleModeChange}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300"
        >
          モードチェンジ
        </button>
      </div>
      {/* 現在のスライド位置と合計スライド数を表示 */}
      {totalContents > 0 && (
        <>
          <h2 className='text-center mb-4 text-lg font-bold'>{`${currentSlide + 1} / ${Math.ceil(totalContents / (mode === 'single' ? 1 : 3))}`}</h2>
          <p className='text-center'>スワイプでスライドできます</p>
        </>
      )}
      <Slider ref={sliderRef} {...settings} className='min-h-max' key={mode}>
        {mode === 'single'
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
    </section>
  );
};

export default InfiniteContentSlider;