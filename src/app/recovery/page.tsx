import type { Metadata } from "next";
import { KnowledgeChannel } from "@/components/channels/KnowledgeChannel";

export const metadata: Metadata = {
  title: "恢复与进步",
  description: "睡眠、训练疲劳、延迟性肌肉酸痛、减量周、平台期、体重围度监测与长期依从性。",
};

export default function Page() {
  return <KnowledgeChannel channelKey="recovery" />;
}
