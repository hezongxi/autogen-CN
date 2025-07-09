import * as React from "react";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import { Tabs, TabsProps } from "antd";
import { Globe, Palette } from "lucide-react";

// Test page for tabs functionality
const TestTabsPage = ({ data }: any) => {
  const tabItems: TabsProps["items"] = [
    {
      key: "ui",
      label: (
        <span className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          界面设置
        </span>
      ),
      children: <div className="p-4">这是界面设置面板</div>,
    },
    {
      key: "language",
      label: (
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          语言设置
        </span>
      ),
      children: <div className="p-4">这是语言设置面板</div>,
    },
  ];

  return (
    <Layout meta={data.site.siteMetadata} title="Test Tabs" link={"/test-tabs"} restricted={false}>
      <main style={{ height: "100%" }} className="h-full p-8">
        <h1 className="text-2xl font-bold mb-4">测试 Tabs 组件</h1>
        <div className="max-w-2xl">
          <Tabs
            defaultActiveKey="ui"
            items={tabItems}
            size="large"
            className="settings-tabs"
          />
        </div>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query TestTabsPageQuery {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`;

export default TestTabsPage;