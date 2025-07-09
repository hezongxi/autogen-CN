import React from "react";
import { Alert } from "antd";
import { copyToClipboard } from "./guides";
import { Download } from "lucide-react";

const ComponentLab: React.FC = () => {
  return (
    <div className="">
      <h1 className="tdext-2xl font-bold mb-6">
        在Python代码和REST API中使用AutoGen Studio团队
      </h1>

      <Alert
        className="mb-6"
        message="Prerequisites"
        description={
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>AutoGen Studio installed</li>
          </ul>
        }
        type="info"
      />
    </div>
  );
};

export default ComponentLab;
