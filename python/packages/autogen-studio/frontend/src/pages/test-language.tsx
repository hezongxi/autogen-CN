import * as React from "react";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import { SimpleLanguageSettings } from "../components/views/settings/view/SimpleLanguageSettings";

// Test page for language settings
const TestLanguagePage = ({ data }: any) => {
  return (
    <Layout meta={data.site.siteMetadata} title="Test Language" link={"/test-language"} restricted={false}>
      <main style={{ height: "100%" }} className="h-full p-8">
        <h1 className="text-2xl font-bold mb-4">Language Settings Test</h1>
        <div className="max-w-2xl">
          <SimpleLanguageSettings />
        </div>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query TestLanguagePageQuery {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`;

export default TestLanguagePage;