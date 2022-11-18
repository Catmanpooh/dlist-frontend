import Link from "next/link";

const FrontPageList = ({ title, categories }) => {
  let goToTitle = title === "For Sale" ? "for_sale" : title?.toLowerCase();
  return (
    <div className="my-8">
      <p className="mb-8 text-3xl font-bold text-center">
        {title}
      </p>
      <div className="grid grid-cols-4 gap-4 text-center">
        {categories?.map((category, i) => {
          return (
            <Link key={i} href={`/${goToTitle}/${category}`}>
              {category}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FrontPageList;
