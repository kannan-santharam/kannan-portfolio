import { geolocation, next } from '@vercel/functions';

export const config = { matcher: '/' };

export default function middleware(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const hasRegionCookie = /(?:^|;\s*)region=/.test(cookieHeader);

  if (hasRegionCookie) return next();

  const { country } = geolocation(request);
  const region = country === 'IN' ? 'india' : 'dubai';

  return next({
    headers: {
      'set-cookie': `region=${region}; Path=/; Max-Age=31536000`,
    },
  });
}
