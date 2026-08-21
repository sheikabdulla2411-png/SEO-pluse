import { Zap } from 'lucide-react';

type Props = {
  text: string;
};

export default function DirectAnswerBox({ text }: Props) {
  return (
    <div
      className="relative my-8 rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#1E222D',
        border: '1px solid #31394B',
        borderLeft: '4px solid #0070FF',
      }}
    >
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(0, 112, 255, 0.12)',
              border: '1px solid rgba(0, 112, 255, 0.25)',
              color: '#3D9BFF',
            }}
          >
            <Zap className="w-3 h-3" />
            Key Takeaway / Direct Answer
          </span>
        </div>
        <p className="text-gray-300 leading-relaxed text-[0.95rem]">
          {text}
        </p>
      </div>
    </div>
  );
}
