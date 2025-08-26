'use client';

interface Props {
  points: string[];
}

export default function KeyPointList({ points }: Props) {
  return (
    <ul className="space-y-3">
      {points.map((point, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
          <span className="text-gray-300 text-sm">{point}</span>
        </li>
      ))}
    </ul>
  );
}
