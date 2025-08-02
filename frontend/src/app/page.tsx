

import { serverClient } from "./lib/trpc/server";

export default async function Home() {
  const trpc = await serverClient();

  const user = await trpc.test.user.query();
  
  return (
    <div className="">
     {user?.name}
    </div>
  );
}
