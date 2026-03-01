"use client";

import { ChatWindow } from "@/components/constructor";
import { use } from "react";

export default function ConstructorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ChatWindow idNegocio={id} />;
}
