"use client"

import { trpc } from "../lib/trpc/client";

export default function ClientPage() {
  const {data: user} = trpc.test.user.useQuery();
  return <div>{user?.name}</div>;   
}