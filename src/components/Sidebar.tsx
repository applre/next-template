import { Link } from '@/i18n/routing';
import SidebarItems from './SidebarItems';
import { Avatar, AvatarFallback } from './ui/avatar';
import { auth } from '@/lib/auth';

const Sidebar = async () => {
  const session = await auth();

  if (session === null) return null;

  return (
    <aside className="hidden h-screen min-w-52 border-border border-r bg-muted p-4 pt-8 shadow-inner md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4">
          <h3 className="ml-4 font-semibold text-lg">Logo</h3>
          <SidebarItems />
        </div>
        <UserDetails user={session.user} />
      </div>
    </aside>
  );
};

export default Sidebar;

const UserDetails = ({
  user,
}: { user: { id: string; name?: string | null; email?: string | null } }) => {
  if (!user?.name || user.name.length === 0) return null;

  return (
    <Link href="/account">
      <div className="flex w-full items-center justify-between border-border border-t px-2 pt-4">
        <div className="text-muted-foreground">
          <p className="text-xs">{user.name ?? 'John Doe'}</p>
          <p className="pr-4 font-light text-xs">{user.id ?? 'john@doe.com'}</p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="border-2 border-border text-muted-foreground">
            {user.name
              ? user.name
                  .split(' ')
                  .map((word: string) => word[0].toUpperCase())
                  .join('')
              : '~'}
          </AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
};
