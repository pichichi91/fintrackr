type SummaryBoxProps = {
    currency: string;
    title: string;
    stat: number;
    last?: boolean;

}

const SummaryBox: React.FC<SummaryBoxProps> = ({currency, title, stat, last = false}) => (
  <div className={`w-full md:w-1/3 mb-6 ${!last ? 'md:mr-4' : ''} flex flex-col justify-center rounded-lg px-8 py-8 bg-gradient-to-r from-indigo-50 to-indigo-100`}>
    <p className="text-xl font-bold">{title}</p>
    <div className="flex">
      <p className="flex text-left text-4xl font-bold text-indigo-800">
        {stat}
      </p>
      <p className="mt-1 ml-1 text-indigo-500 font-thin">{currency}</p>
    </div>
  </div>
);


export default SummaryBox;