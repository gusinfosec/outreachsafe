"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function FactorTwo() {
  const router = useRouter();
  useEffect(() => { router.replace("/extension-auth"); }, []);
  return null;
}
