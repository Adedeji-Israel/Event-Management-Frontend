interface Props {
  title: string;
  date: string;
  location: string;
}

const EventPreview = ({ title, date, location }: Props) => {
  return (
    <div className="flex justify-between items-center border-b pb-3 last:border-none">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">
          {date} • {location}
        </p>
      </div>

      <button className="text-purple-600 text-sm font-medium hover:underline">
        View
      </button>
    </div>
  );
};

export default EventPreview;
