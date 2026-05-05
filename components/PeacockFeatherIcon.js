// components/PeacockFeatherIcon.js
export default function PeacockFeatherIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer teardrop of the feather */}
      <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" stroke="#F57D14" />
      {/* Inner "Eye" of the feather in Navy Blue */}
      <circle cx="12" cy="14" r="2.5" fill="#0A2351" stroke="#0A2351" />
      {/* Stem */}
      <path d="M12 20c0 1.5-1 3.5-3 4" stroke="#F57D14" />
      {/* Side barbs/frills */}
      <path d="M7 11c-2 0-4-1-5-2" stroke="#F57D14" />
      <path d="M17 11c2 0 4-1 5-2" stroke="#F57D14" />
      <path d="M6 16c-2 1-4 1-5 2" stroke="#F57D14" />
      <path d="M18 16c2 1 4 1 5 2" stroke="#F57D14" />
    </svg>
  );
}
