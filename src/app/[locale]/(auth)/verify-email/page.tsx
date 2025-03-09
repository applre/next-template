import { verifyToken } from '@/server/actions/auth';
import { redirect } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string; identifier?: string };
}) {
  const { token, identifier } = searchParams;
  const locale = useLocale();

  if (!token || !identifier) {
    redirect({
      href: '/error?error=MissingParameters',
      locale,
    });
    return;
  }

  const result = await verifyToken(token, identifier);

  if (result.error) {
    redirect({
      href: '/error?error=InvalidToken',
      locale,
    });
    return;
  }

  redirect({
    href: '/dashboard',
    locale,
  });
}
