import UserSettings from './UserSettings';
import PlanSettings from './PlanSettings';

export default async function Account() {
  return (
    <main>
      <h1 className="my-4 font-semibold text-2xl">Account</h1>
      <div className="space-y-4">
        <PlanSettings />
        {/* <UserSettings /> */}
      </div>
    </main>
  );
}
