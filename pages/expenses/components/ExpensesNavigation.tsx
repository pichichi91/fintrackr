import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
type ExpensesNavigationProps = {
  activeItem: "daily" | "monthly";
};

const ExpensesNavigation: React.FC<ExpensesNavigationProps> = ({
  activeItem,
}) => (
  <nav className="flex mb-12 justify-between">
    {["daily", "monthly"].map((item) => (
      <Link
        href={item === "daily" ? "/expenses" : "/expenses/monthly"}
        key={item}
      >
        <a
          className={`capitalize w-full ${
            item === "daily" && "md:mr-4"
          } font-bold md:basis-1/2 md:w-1/3 mb-6  flex flex-col justify-center rounded-lg px-8 py-2 bg-gradient-to-r ${
            activeItem === item
              ? "from-indigo-500 to-indigo-700 text-white"
              : "from-indigo-50 to-indigo-100"
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
