const EventsRightPanel = () => {
  return (
    <aside className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-sm mb-4">
        Top Performing
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Music Fest</span>
          <span className="text-purple-600 font-medium">85%</span>
        </div>

        <div className="flex justify-between">
          <span>Tech Expo</span>
          <span className="text-purple-600 font-medium">72%</span>
        </div>
      </div>
    </aside>
  );
};

export default EventsRightPanel;
