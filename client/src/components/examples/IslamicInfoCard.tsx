import IslamicInfoCard from '../IslamicInfoCard';

export default function IslamicInfoCardExample() {
  return (
    <div className="p-6 space-y-4">
      <IslamicInfoCard
        title="Islamic Inheritance (Faraid)"
        content="Under Shariah law, specific shares of your estate are allocated to eligible heirs. The shares are determined based on family relationships and follow the principles outlined in the Quran."
        verse="For men is a share of what the parents and close relatives leave, and for women is a share of what the parents and close relatives leave. (Quran 4:7)"
      />
    </div>
  );
}
