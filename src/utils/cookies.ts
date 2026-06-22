"use server";
import { cookies } from "next/headers";

export const setCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const removeCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};
