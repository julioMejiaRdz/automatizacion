
interface CardProps {
    label: string,
    value: number,
    unit: string
}

export default function Card({label, value, unit}: CardProps) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1 text-black">
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </div>
  );
}
