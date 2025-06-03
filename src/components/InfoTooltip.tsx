
import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, side = "left" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-4 h-4 text-blue-400 hover:text-blue-300 cursor-help ml-2" />
    </TooltipTrigger>
    <TooltipContent 
      side={side}
      className="max-w-xs p-3 bg-gray-900 border border-gray-700 text-white text-sm z-50"
    >
      {content}
    </TooltipContent>
  </Tooltip>
);

export default InfoTooltip;
