import type { Metadata } from "next";
import { KnowledgeChannel } from "@/components/channels/KnowledgeChannel";

export const metadata: Metadata = {
  title: "增肌入门",
  description: "给完全没有训练经验的人：肌肥大、训练容量、强度、频率、RIR、RPE、渐进超负荷与新手行动指南。",
};

export default function Page() {
  return <KnowledgeChannel channelKey="getting-started" />;
}
