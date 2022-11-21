import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import WalletContext from "../../context/WalletContext";
import Layout from "../components/Layout";
import { CONTRACT_ID } from "../../lib/constants";

const GroupCategory = () => {
  const router = useRouter();
  const contractId = CONTRACT_ID;

  const { wallet } = useContext(WalletContext);

  const { group, category } = router.query;
  const [getItemsInfo, setGetItemsInfo] = useState([{}]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    let items = await wallet.viewMethod({
      method: "get_items",
      args: { group: group === "jobs" ? "job" : group },
      contractId,
    });

    console.log(items);

    let filtered = items.filter((item) => item.category === category);

    setGetItemsInfo(filtered);
  };

  const convertDateToHumanReadable = (date) => {
    let newDate = new Date(date);
    return newDate.toDateString().substring(4, 11);
  };
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mt-4">
        <h1 className="text-3xl font-bold">{category}</h1>
        {getItemsInfo.length >= 1 ? (
          getItemsInfo.map((item, i) => {
            return (
              <div
                key={i}
                className="flex font-medium text-xl w-2/3 mt-10 justify-between"
              >
                <p>{convertDateToHumanReadable(item.date)}</p>
                <Link
                  className="text-secondary underline decoration-2"
                  href={`/${group}/${category}/${item.post_id}`}
                >
                  {item.title}
                </Link>
                <div className="w-24">
                  {item.location ? <p>{item.location}</p> : <p></p>}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <h2 className="text-xl font-semibold my-10">Nothing listed yet</h2>
            <p className="text-lg font-semibold">Be the First!!</p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default GroupCategory;
