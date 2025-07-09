import React from "react";
import AuthProvider from "./src/hooks/provider";

const codeToRunOnClient = `(function() {
  try {
    var mode = localStorage.getItem('darkmode');
    document.getElementsByTagName("html")[0].className === 'dark' ? 'dark' : 'light';
  } catch (e) {}
})();`;

export const onRenderBody = ({ setHeadComponents }) =>
  setHeadComponents([
    <script
      key="myscript"
      dangerouslySetInnerHTML={{ __html: codeToRunOnClient }}
    />,
  ]);

export const wrapRootElement = AuthProvider;
