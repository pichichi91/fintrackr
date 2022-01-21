import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
type ExpensesNavigationProps = {
  activeItem: "daily" | "monthly";
};

const ExpensesNavigation: React.FC<ExpensesNavigationProps> = ({
  activeItem,
}) => (
  <nav className="flex mb-2 justify-between">
          <h1 className="font-bold text-4xl">Expenses </h1>
    {["daily", "monthly"].map((item) => (
      <Link
        href={item === "daily" ? "/expenses" : "/expenses/monthly"}
        key={item}
      >
        <a
          className={`capitalize w-full  font-bold md:basis-1/5  mb-6  flex flex-col justify-center rounded-lg px-8 py-2 bg-gradient-to-r ${
            activeItem !== item
              ? "from-indigo-500 to-indigo-700 text-white"
              : "hidden"
          } hover:from-indigo-800 hover:to-indigo-800  hover:text-white transition-all `}
        >
          <div className="flex">
            <BsArrowRight className="mr-2" size={20} />
            <p>{item}</p>
          </div>
        </a>
      </Link>
    ))}
  </nav>
);

export default ExpensesNavigation;
