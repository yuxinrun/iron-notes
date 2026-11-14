"use client";

import { CalorieTool, ProteinTool, MacrosTool } from "@/components/tools/NutritionTools";
import { VolumeTool, OneRMTool, BmiTool } from "@/components/tools/TrainingTools";
import { ProgressTool, GeneratorTool } from "@/components/tools/RecordTools";

/** 按工具 key 分发到具体计算器；新增工具只需在此登记一次。 */
export function ToolRunner({ toolKey }: { toolKey: string }) {
  switch (toolKey) {
    case "calorie":
      return <CalorieTool />;
    case "protein":
      return <ProteinTool />;
    case "macros":
      return <MacrosTool />;
    case "volume":
      return <VolumeTool />;
    case "onerm":
      return <OneRMTool />;
    case "bmi":
      return <BmiTool />;
    case "progress":
      return <ProgressTool />;
    case "generator":
      return <GeneratorTool />;
    default:
      return null;
  }
}
