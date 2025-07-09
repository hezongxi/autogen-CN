import * as React from "react";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import { SimpleSettingsManager } from "../components/views/settings/SimpleSettingsManager";

// markup
const SettingsPage = ({ data }: any) => {
  return (
    <Layout meta={data.site.siteMetadata} title="Home" link={"/settings"}>
      <main style={{ height: "100%" }} className=" h-full ">
        <SimpleSettingsManager />
      </main>
    </Layout>
  );
};

export const query = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`;

export default SettingsPage;
