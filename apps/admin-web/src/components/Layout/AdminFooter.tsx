
import React from "react";
import { Layout } from "antd";

const AdminFooter = () => (
  <Layout.Footer style={{ textAlign: "center" }}>
    ArmanVarzesh ©{new Date().getFullYear()} All rights reserved.
  </Layout.Footer>
);

export default AdminFooter;
