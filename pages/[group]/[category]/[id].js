import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout";
import WalletContext from "../../../context/WalletContext";
import { CONTRACT_ID } from "../../../lib/constants";

const CategoryWithId = () => {
  const router = useRouter();
  const contractId = CONTRACT_ID;

  const { wallet } = useContext(WalletContext);

  const { group, category, id } = router.query;
  const [getItemInfo, setGetItemInfo] = useState({});
  const [details, setDetails] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    getItemByPostId();
  }, []);

  const getItemByPostId = async () => {
    let item = await wallet.viewMethod({
      method: "get_item",
      args: { group: group, post_id: Number(id) },
      contractId,
    });

    setGetItemInfo(item);
    let insideDetails;
    if (!!item.details.for_sale) {
      insideDetails = item.details?.for_sale;
    } else if (!!item.details.community) {
      insideDetails = item.details?.community;
    } else if (!!item.details.jobs) {
      insideDetails = item.details?.jobs;
    } else if (!!item.details.housing) {
      insideDetails = item.details?.housing;
    } else {
      insideDetails = {};
    }
    setDetails(insideDetails);
  };

  const howLongAgo = (date) => {
    let oldDate = new Date(date);
    let newDate = new Date();

    const diffTime = Math.abs(Number(newDate) - Number(oldDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime / (1000 * 60 * 60 * 24) < 0.9) {
      return (diffTime / 60000).toFixed() + " minutes ago";
    } else if (diffDays === 1) {
      return diffDays + " day ago";
    }

    return diffDays + " days ago";
  };

  const removePost = async () => {
    setIsDisabled(true);

    // Same issue as in the post page
    let item = await wallet.callMethod({
      method: "remove_items",
      args: { group: group, account_id: wallet.accountId, post_id: Number(id) },
      contractId,
    });

    if (!!item) {
      alert("Post was successfully deleted");
    } else {
      alert("Post was not deleted try again");
    }
    setIsDisabled(false);
  };

  console.log(getItemInfo);
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mt-4">
        {!!getItemInfo ? (
          <>
            <h1 className="my-10 text-3xl font-bold">{getItemInfo.title}</h1>
            <p className="text-xl my-4">{getItemInfo.description}</p>

            {Object.entries(details).map(([keyDetails, valueDetails], i) => {
              return valueDetails !== null ? (
                valueDetails === true ? (
                  <p key={i} className="btn my-4">
                    {keyDetails}
                  </p>
                ) : Array.isArray(valueDetails) && valueDetails.length ? (
                  <p key={i} className="btn my-4">
                    {keyDetails}:
                    <span className="mx-2">
                      {valueDetails[0]} - {valueDetails[1]}
                    </span>
                  </p>
                ) : (
                  <p key={i} className="btn my-4">
                    {keyDetails}:<span className="mx-2">{valueDetails}</span>
                  </p>
                )
              ) : null;
            })}

            <div className="flex w-1/2 my-8 justify-evenly">
              <p>post_id: {getItemInfo.post_id}</p>
              <p>posted: {howLongAgo(getItemInfo.date)}</p>
            </div>

            {getItemInfo.creator === wallet.accountId ? (
              <button
                className="my-8 btn btn-error"
                disabled={isDisabled}
                onClick={() => {
                  removePost();
                }}
              >
                Remove Post
              </button>
            ) : null}
          </>
        ) : (
          <h2 className="text-xl font-semibold my-10">Post does not exist</h2>
        )}
      </div>
    </Layout>
  );
};

export default CategoryWithId;
