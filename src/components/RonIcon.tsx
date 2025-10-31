import Image from 'next/image';

interface RonIconProps {
  size?: number;
  className?: string;
}

export default function RonIcon({ size = 24, className = '' }: RonIconProps) {
  return (
    <Image
      src="/ron-logo.svg"
      alt="RON"
      width={size}
      height={size}
      className={className}
    />
  );
}
