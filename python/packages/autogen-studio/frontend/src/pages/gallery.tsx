import * as React from "react";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import GalleryManager from "../components/views/gallery/manager";
import { useLanguage } from "../hooks/useLanguage";

// markup
const GalleryPage = ({ data }: any) => {
  const { t } = useLanguage();
  return (
    <Layout meta={data.site.siteMetadata} title={t("gallery.title")} link={"/gallery"}>
      <main style={{ height: "100%" }} className=" h-full ">
        <GalleryManager />
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

export default GalleryPage;
