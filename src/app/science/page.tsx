import type { Metadata } from "next";
import { KnowledgeChannel } from "@/components/channels/KnowledgeChannel";

export const metadata: Metadata = {
  title: "科学训练",
  description: "肌肥大原理、训练变量、渐进超负荷、训练强度与力竭、训练计划制定的系统知识频道。",
};

export default function Page() {
  return <KnowledgeChannel channelKey="science" />;
}
