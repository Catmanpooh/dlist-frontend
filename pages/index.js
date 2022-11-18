import {
  FOR_SALE_CATEGORIES,
  COMMUNITY_CATEGORIES,
  JOBS_CATEGORIES,
  HOUSING_CATEGORIES,
} from "../lib/constants";

import FrontPageList from "./components/FrontPageList";
import Layout from "./components/Layout";

export default function Home() {
  return (
    <div>
      <Layout title="Home Page | Lookup">
        <div className="flex flex-col justify-evenly">
          <FrontPageList title={"For Sale"} categories={FOR_SALE_CATEGORIES} />
          <FrontPageList
            title={"Community"}
            categories={COMMUNITY_CATEGORIES}
          />
          <FrontPageList title={"Housing"} categories={HOUSING_CATEGORIES} />
          <FrontPageList title={"Jobs"} categories={JOBS_CATEGORIES} />
        </div>
      </Layout>
    </div>
  );
}
