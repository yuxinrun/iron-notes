import type { Metadata } from "next";
import { KnowledgeChannel } from "@/components/channels/KnowledgeChannel";

export const metadata: Metadata = {
  title: "营养饮食",
  description: "能量摄入、蛋白质、碳水、脂肪、增肌饮食实战与补剂证据分层的中文科学知识库。",
};

export default function Page() {
  return <KnowledgeChannel channelKey="nutrition" />;
}
