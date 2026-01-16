import { headers } from "next/headers";

export async function getAuthUser() {
  const headersList = await headers();
  const userHeader = headersList.get("x-user");

  if (!userHeader) return null;

  return JSON.parse(userHeader);
}