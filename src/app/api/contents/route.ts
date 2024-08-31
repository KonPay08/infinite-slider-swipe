import { NextResponse } from 'next/server';
import { ContentsResponse } from '../../../shared/type';
import { Content } from '../../../shared/type';

// 最大30件までしか取得しない
const TOTAL_CONTENTS = 30;

export async function GET(request: Request): Promise<NextResponse<ContentsResponse>> {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const start = (page - 1) * limit;
  const end = Math.min(start + limit, TOTAL_CONTENTS);

  const contents: Content[] = Array.from({ length: end - start }, (_, i) => ({
    id: start + i + 1,
    content: `Content ${start + i + 1}`,
  }));

  // nextPage を null に設定して、これ以上のページがないことを示す
  const nextPage = end < TOTAL_CONTENTS ? page + 1 : null;

  return NextResponse.json(
    { contents, nextPage, total: TOTAL_CONTENTS },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}