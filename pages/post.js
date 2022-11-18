import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "./components/Layout";
import WalletContext from "../context/WalletContext";
import Input from "./components/Input";
import Select from "./components/Select";

import {
  CONTRACT_ID,
  FOR_SALE_CATEGORIES,
  COMMUNITY_CATEGORIES,
  HOUSING_CATEGORIES,
  JOBS_CATEGORIES,
  POSTINGTYPES,
  CONDITIONITEMS,
  COMMUNITYITEMS,
  EMPLOYMENTITEMS,
  HOUSINGTYPEITEMS,
  HOUSINGPERTIMEITEMS,
} from "../lib/constants";

const ITEMINFO = {
  creator: "",
  post_id: 0,
  date: 0,
  category: "",
  title: "",
  description: "",
  image: "",
  location: "",
  price: "",
  details: "",
};

const Post = () => {
  const router = useRouter();
  const contractId = CONTRACT_ID;
  const { wallet } = useContext(WalletContext);
  const [itemInfo, setItemInfo] = useState(ITEMINFO);
  const [group, setGroup] = useState({
    value: "",
    categoryEnabled: true,
    whichCategoryArray: [],
  });
  const [disabledForSubmit, setdisabledForSubmit] = useState(false);
  const [detailsItems, setDetailsItems] = useState("");
  const [forSale, setForSale] = useState({
    make_or_manufacturer: "",
    model_name_or_number: "",
    size_dimensions: "",
    condition: "",
  });
  const [community, setCommunity] = useState({
    garage_sale: {
      garage_sale_start_time: "",
      garage_sale_dates: "null",
    },
    class_or_event: {
      event_venue: "",
      event_start_date: "",
      event_duration: "",
      event_features: "",
    },
    lost_or_found: "",
    rideshare: "",
  });
  const [housing, setHousing] = useState({
    rent: "",
    per_time_range: "",
    sqft: "",
    pet: "",
    air_conditioning: "",
    private_room: "",
    housing_type: "",
    laundry: "",
    parking: "",
    available_date: "",
    open_house_dates: "",
  });
  const [jobs, setJobs] = useState({
    employment_type: "",
    job_title: "",
    compensation: "",
    company_name: "",
  });

  const [communityValue, setCommunityValue] = useState("");

  //could be one thing Housing || Community selected
  const [communityDate, setCommunityDate] = useState([]);
  const [housingDate, setHousingDate] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setdisabledForSubmit(true);
    const formData = Object.fromEntries(new FormData(e.target));

    let details;

    if (detailsItems === "for_sale") {
      details = {
        for_sale: {
          make_or_manufacturer: formData.make_or_manufacturer || null,
          model_name_or_number: formData.model_name_or_number || null,
          size_dimensions: formData.size_dimensions || null,
          condition: formData.condition || null,
        },
        housing: null,
        community: null,
        jobs: null,
      };
    } else if (detailsItems === "housing") {
      details = {
        for_sale: null,
        housing: {
          rent: Number(formData.rent) || null,
          per_time_range: formData.per_time_range || null,
          sqft: Number(formData.sqft) || null,
          pet: formData.pet === "true" || null,
          air_conditioning: formData.air_conditioning === "true" || null,
          private_room: formData.private_room === "true" || null,
          housing_type: formData.housing_type || null,
          laundry: formData.laundry === "true" || null,
          parking: formData.parking === "true" || null,
          available_date: formData.available_date || null,
          open_house_dates: housingDate || null,
        },
        community: null,
        jobs: null,
      };
    } else if (detailsItems === "job") {
      details = {
        for_sale: null,
        housing: null,
        community: null,
        jobs: {
          employment_type: formData.employment_type || null,
          job_title: formData.job_title || null,
          compensation: Number(formData.compensation) || null,
          company_name: formData.company_name || null,
        },
      };
    } else {
      let class_or_event, garage_sale;
      if (communityValue === "Class or Event") {
        let event_features =
          formData.event_features.toString().split(",") || null;
        class_or_event = {
          event_venue: formData.event_venue.toString() || null,
          event_start_date: formData.event_start_date.toString() || null,
          event_duration: Number(formData.event_duration) || null,
          event_features: event_features,
        };
      } else if (communityValue === "Garage Sale") {
        garage_sale = {
          garage_sale_start_time:
            formData.garage_sale_start_time.toString() || null,
          garage_sale_dates: communityDate || null,
        };
      }

      details = {
        for_sale: null,
        housing: null,
        community: {
          garage_sale: garage_sale || null,
          class_or_event: class_or_event || null,
          lost_or_found: formData.lost_or_found === "true" || null,
          rideshare: formData.rideshare === "true" || null,
        },
        jobs: null,
      };
    }
    const sendItemInfo = {
      creator: wallet.accountId,
      post_id: Number(Math.floor(Math.random() * 3654651989125135)),
      date: Date.now(),
      category: formData.category.toString().trim(),
      title: formData.title.toString().trim(),
      description: formData.description.toString(),
      image: null,
      location: formData.location || null,
      price: Number(formData.price) || null,
      details: details || null,
    };

    // Not sure what is going with the reponse. The post is entered
    // but redirecting from the wallet is refreshing the page.
    try {
      if (detailsItems === "job") {
        await wallet.callMethod({
          method: "set_items",
          args: { group: detailsItems, item_info_in: sendItemInfo },
          contractId,
          gas: "30000000000000",
          deposit: "1000000000000000000000000",
        });
      } else {
        await wallet.callMethod({
          method: "set_items",
          args: { group: detailsItems, item_info_in: sendItemInfo },
          contractId,
          gas: "30000000000000",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGroup = (e) => {
    let group = e.target.value;
    let arr, name;

    if (group === POSTINGTYPES[1] || group === POSTINGTYPES[2]) {
      arr = HOUSING_CATEGORIES;
      name = "housing";
    } else if (
      group === POSTINGTYPES[3] ||
      group === POSTINGTYPES[4] ||
      group === POSTINGTYPES[5] ||
      group === POSTINGTYPES[6]
    ) {
      arr = FOR_SALE_CATEGORIES;
      name = "for_sale";
    } else if (group === POSTINGTYPES[7]) {
      arr = COMMUNITY_CATEGORIES;
      name = "community";
    } else {
      arr = JOBS_CATEGORIES;
      name = "job";
    }

    setDetailsItems(name);

    setGroup({
      value: e.target.value,
      categoryEnabled: false,
      whichCategoryArray: arr,
    });
  };

  return (
    <Layout title="Post to the world">
      {detailsItems === "job" ? (
        <h1 className="text-3xl font-medium text-center my-2">
          Create A Post | Cost To Post Job Is 1 Near
        </h1>
      ) : (
        <h1 className="text-3xl font-medium text-center my-2">Create A Post</h1>
      )}

      <div className="lg:container mx-auto h-full w-full p-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full justify-center"
        >
          <div className="flex flex-wrap gap-x-8 gap-y-8  w-full my-8">
            <Select
              title="Where would you like to post"
              name="group"
              disabled={false}
              required={true}
              value={group.value}
              postTypes={POSTINGTYPES}
              onChange={handleGroup}
            />

            <Select
              title="Which category"
              name="category"
              disabled={group.categoryEnabled}
              required={true}
              value={itemInfo.category}
              postTypes={group.whichCategoryArray}
              onChange={(e) =>
                setItemInfo({ ...itemInfo, category: e.target.value })
              }
            />
            <Input
              title="Enter Post Title"
              value={itemInfo.title}
              onChange={(e) =>
                setItemInfo({ ...itemInfo, title: e.target.value })
              }
              required={true}
              type="text"
              name={"title"}
            />

            <Input
              title="Enter Price"
              value={itemInfo.price}
              onChange={(e) =>
                setItemInfo({ ...itemInfo, price: e.target.value })
              }
              required={false}
              type="number"
              name="price"
              min="1"
              max="10000000"
            />

            <Input
              title="Enter Location"
              value={itemInfo.location}
              onChange={(e) =>
                setItemInfo({ ...itemInfo, location: e.target.value })
              }
              required={false}
              type="text"
              name="location"
            />
          </div>
          <div className="form-control w-full my-8">
            <textarea
              value={itemInfo.description}
              onChange={(e) =>
                setItemInfo({ ...itemInfo, description: e.target.value })
              }
              className="textarea textarea-bordered w-full h-64"
              placeholder="Enter Description"
              required
              name="description"
            />
          </div>
          {(() => {
            if (detailsItems === "housing") {
              return (
                <div className="flex flex-wrap gap-x-8 gap-y-8  w-full my-8">
                  <Input
                    title="When is the place available"
                    value={housing.available_date}
                    onChange={(e) =>
                      setHousing({ ...housing, available_date: e.target.value })
                    }
                    required={false}
                    type="date"
                    name="available_date"
                  />
                  <Input
                    title="Begin Date Open House"
                    value={housingDate[0]}
                    onChange={(e) =>
                      setHousingDate([...housingDate, e.target.value])
                    }
                    required={false}
                    type="date"
                    name="begin_open_house"
                  />
                  <Input
                    title="End Date Open House"
                    value={housingDate[1]}
                    onChange={(e) =>
                      setHousingDate([...housingDate, e.target.value])
                    }
                    required={false}
                    type="date"
                    name="end_open_house"
                  />

                  <Input
                    title="Rent Amount"
                    value={housing.rent}
                    onChange={(e) =>
                      setHousing({ ...housing, rent: e.target.value })
                    }
                    required={false}
                    type="number"
                    name="rent"
                  />

                  <Input
                    title="How many Sqft "
                    value={housing.sqft}
                    onChange={(e) =>
                      setHousing({ ...housing, sqft: e.target.value })
                    }
                    required={false}
                    type="number"
                    name="sqft"
                  />

                  <Select
                    title=" Housing Type"
                    name="housing_type"
                    disable={false}
                    required={false}
                    value={housing.housing_type}
                    postTypes={HOUSINGTYPEITEMS}
                    onChange={(e) =>
                      setHousing({ ...housing, housing_type: e.target.value })
                    }
                  />

                  <Select
                    title="TimeFrame Of Payments"
                    name="per_time_range"
                    disable={false}
                    required={false}
                    value={housing.per_time_range}
                    postTypes={HOUSINGPERTIMEITEMS}
                    onChange={(e) =>
                      setHousing({ ...housing, per_time_range: e.target.value })
                    }
                  />
                  <Input
                    title="Bring the pets"
                    value={housing.pet}
                    onChange={(e) =>
                      setHousing({ ...housing, pet: !e.target.value })
                    }
                    required={false}
                    type="checkbox"
                    name="pet"
                  />
                  <Input
                    title="Has Air Conditioning"
                    value={housing.air_conditioning}
                    onChange={(e) =>
                      setHousing({
                        ...housing,
                        air_conditioning: !e.target.value,
                      })
                    }
                    required={false}
                    type="checkbox"
                    name="air_conditioning"
                  />
                  <Input
                    title="Is Private Room"
                    value={housing.private_room}
                    onChange={(e) =>
                      setHousing({ ...housing, private_room: !e.target.value })
                    }
                    required={false}
                    type="checkbox"
                    name="private_room"
                  />
                  <Input
                    title="Has Laundry"
                    value={housing.laundry}
                    onChange={(e) =>
                      setHousing({ ...housing, laundry: !e.target.value })
                    }
                    required={false}
                    type="checkbox"
                    name="laundry"
                  />
                  <Input
                    title="Has Parking"
                    value={housing.parking}
                    onChange={(e) =>
                      setHousing({ ...housing, parking: !e.target.value })
                    }
                    required={false}
                    type="checkbox"
                    name="parking"
                  />
                </div>
              );
            } else if (detailsItems === "for_sale") {
              return (
                <div className="flex flex-wrap gap-x-8 gap-y-8  w-full my-8">
                  <Input
                    title="Enter The Make or Manufacturer"
                    value={forSale.make_or_manufacturer}
                    onChange={(e) =>
                      setForSale({
                        ...forSale,
                        make_or_manufacturer: e.target.value,
                      })
                    }
                    required={false}
                    type="text"
                    name="make_or_manufacturer"
                  />

                  <Input
                    title="Enter Model Name or Number"
                    value={forSale.model_name_or_number}
                    onChange={(e) =>
                      setForSale({
                        ...forSale,
                        model_name_or_number: e.target.value,
                      })
                    }
                    required={false}
                    type="text"
                    name="model_name_or_number"
                  />

                  <Input
                    title="Enter Size Dimensions"
                    value={forSale.size_dimensions}
                    onChange={(e) =>
                      setForSale({
                        ...forSale,
                        size_dimensions: e.target.value,
                      })
                    }
                    required={false}
                    type="text"
                    name="size_dimensions"
                  />

                  <Select
                    title="Pick the Condition"
                    name="condition"
                    disabled={false}
                    required={false}
                    value={forSale.condition}
                    postTypes={CONDITIONITEMS}
                    onChange={(e) =>
                      setForSale({ ...forSale, condition: e.target.value })
                    }
                  />
                </div>
              );
            } else if (detailsItems === "community") {
              return (
                <div className="flex flex-wrap gap-x-8 gap-y-8  w-full my-8">
                  <Select
                    title="Pick the Condition"
                    disabled={false}
                    required={false}
                    value={communityValue}
                    postTypes={COMMUNITYITEMS}
                    onChange={(e) => setCommunityValue(e.target.value)}
                  />
                  {(() => {
                    if (communityValue === "Garage Sale") {
                      return (
                        <>
                          <Input
                            title="Enter Garage Sale Start Time"
                            value={community.garage_sale.garage_sale_start_time}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                garage_sale_start_time: e.target.value,
                              })
                            }
                            required={false}
                            type="time"
                            name="garage_sale_start_time"
                          />

                          <Input
                            title="Enter Garage Sale Start Date"
                            value={communityDate[0]}
                            onChange={(e) =>
                              setCommunityDate([
                                ...communityDate,
                                e.target.value,
                              ])
                            }
                            required={false}
                            type="date"
                            name="garage_start_date"
                          />

                          <Input
                            title="Enter Garage Sale End Date"
                            value={communityDate[1]}
                            onChange={(e) =>
                              setCommunityDate([
                                ...communityDate,
                                e.target.value,
                              ])
                            }
                            required={false}
                            type="date"
                            name="garage_end_date"
                          />
                        </>
                      );
                    } else if (communityValue === "Class or Event") {
                      return (
                        <>
                          {" "}
                          {/* //////////////      Event       /////////////  */}
                          <Input
                            title="Enter Event Venue"
                            value={community.class_or_event.event_venue}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                event_venue: e.target.value,
                              })
                            }
                            required={false}
                            type="text"
                            name="event_venue"
                          />
                          <Input
                            title="Start Date Of The Event"
                            value={community.class_or_event.event_start_date}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                event_start_date: e.target.value,
                              })
                            }
                            required={false}
                            type="date"
                            name="event_start_date"
                          />
                          <Input
                            title="Event Duration"
                            value={community.class_or_event.event_duration}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                event_duration: e.target.value,
                              })
                            }
                            required={false}
                            min={1}
                            max={254}
                            type="number"
                            name="event_duration"
                          />
                          <Input
                            title="Enter Event Features Sperate with a comma"
                            value={community.class_or_event.event_features}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                event_features: e.target.value,
                              })
                            }
                            required={false}
                            type="text"
                            name="event_features"
                          />
                        </>
                      );
                    } else if (communityValue === "Lost or Found") {
                      return (
                        <>
                          {" "}
                          {/* //////////////      Lost & Found       /////////////  */}
                          <Input
                            title="Lost and Found"
                            value={community.lost_or_found}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                lost_or_found: !e.target.value,
                              })
                            }
                            required={false}
                            type="checkbox"
                            name="lost_or_found"
                          />
                        </>
                      );
                    } else if (communityValue === "RideShare") {
                      return (
                        <>
                          {" "}
                          {/* //////////////      RideShare       /////////////  */}
                          <Input
                            title="Need A Ride"
                            value={community.rideshare}
                            onChange={(e) =>
                              setCommunity({
                                ...community,
                                rideshare: !e.target.value,
                              })
                            }
                            required={false}
                            type="checkbox"
                            name="rideshare"
                          />
                        </>
                      );
                    }
                  })()}
                </div>
              );
            } else if (detailsItems === "job") {
              return (
                <div className="flex flex-wrap gap-x-8 gap-y-8  w-full my-8">
                  <Input
                    title="The Company Name"
                    value={jobs.company_name}
                    onChange={(e) =>
                      setJobs({ ...jobs, company_name: e.target.value })
                    }
                    required={false}
                    type="text"
                    name="company_name"
                  />

                  <Input
                    title="Salary"
                    value={jobs.compensation}
                    onChange={(e) =>
                      setJobs({ ...jobs, compensation: e.target.value })
                    }
                    min={1}
                    required={false}
                    type="number"
                    name="compensation"
                  />

                  <Input
                    title="The Job Title"
                    value={jobs.job_title}
                    onChange={(e) =>
                      setJobs({ ...jobs, job_title: e.target.value })
                    }
                    required={false}
                    type="text"
                    name="job_title"
                  />

                  <Select
                    title="Pick the Employment Type"
                    name="employment_type"
                    disabled={false}
                    required={false}
                    value={jobs.employment_type}
                    postTypes={EMPLOYMENTITEMS}
                    onChange={(e) =>
                      setJobs({ ...jobs, employment_type: e.target.value })
                    }
                  />
                </div>
              );
            }
          })()}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={disabledForSubmit}
          >
            submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Post;
