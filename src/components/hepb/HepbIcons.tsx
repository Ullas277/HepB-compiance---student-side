type IconProps = { className?: string };

export function IconChevronUp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </svg>
  );
}

export function IconRadioUnchecked(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function IconRadioChecked(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="5.5" fill="currentColor" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconPen(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function IconCloudUpload(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M7 18a4 4 0 010-8 5 5 0 019.9-1A4 4 0 0119 14a3 3 0 010 6H7z" />
      <path d="M12 12v9M9 18l3-3 3 3" />
    </svg>
  );
}

export function IconAdultImmunization(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden {...props}>
      <path
        d="M7.25857 8.29346H8.29517V8.98452C8.29517 12.0382 10.77 14.513 13.8237 14.513C16.8773 14.513 19.3522 12.0382 19.3522 8.98452V8.29346H20.3888C20.9632 8.29346 21.4254 7.83131 21.4254 7.25686C21.4254 6.68241 20.9632 6.22026 20.3888 6.22026H19.0628C18.6136 3.90088 17.685 1.38281 16.1128 1.38281C15.6982 1.38281 15.2922 1.55126 14.9251 1.73698C14.5709 1.91407 14.1303 2.07388 13.8237 2.07388C13.517 2.07388 13.0765 1.91407 12.7223 1.73698C12.3552 1.55126 11.9492 1.38281 11.5345 1.38281C9.96236 1.38281 9.03806 3.90088 8.58455 6.22026H7.25857C6.68412 6.22026 6.22197 6.68241 6.22197 7.25686C6.22197 7.83131 6.68412 8.29346 7.25857 8.29346ZM13.8237 8.29346H17.279V8.98452C17.279 10.8936 15.7327 12.4398 13.8237 12.4398C11.9146 12.4398 10.3684 10.8936 10.3684 8.98452V8.29346H13.8237ZM12.5063 15.8952C12.0874 15.8952 11.7505 16.2321 11.7505 16.651C11.7505 16.8324 11.8153 17.0052 11.9319 17.1434L13.1153 18.5255L11.7764 23.4969H11.7505L10.2561 17.5148C10.161 17.1391 9.77663 16.9102 9.41383 17.0484C6.74027 18.0677 4.83984 20.6592 4.83984 23.6912C4.83984 24.3434 5.3711 24.8747 6.02329 24.8747H21.6198C22.2719 24.8747 22.8032 24.3434 22.8032 23.6912C22.8032 20.6592 20.9028 18.0677 18.2292 17.0484C17.8664 16.9102 17.482 17.1391 17.387 17.5148L15.8926 23.4969H15.8666L14.5277 18.5255L15.7112 17.1434C15.8278 17.0052 15.8926 16.8324 15.8926 16.651C15.8926 16.2321 15.5557 15.8952 15.1367 15.8952H12.502H12.5063Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconChildImmunization(props: IconProps) {
  return (
    <svg viewBox="0 0 29 29" fill="none" aria-hidden {...props}>
      <path
        d="M17.613 5.70508C17.613 7.62298 16.0582 9.17773 14.1403 9.17773C12.2224 9.17773 10.6677 7.62298 10.6677 5.70508C10.6677 3.78718 12.2224 2.23242 14.1403 2.23242C16.0582 2.23242 17.613 3.78718 17.613 5.70508ZM4.06963 7.54063C4.71455 6.8957 5.70674 6.8957 6.35166 7.54063L10.8165 12.0055C11.6599 11.2117 12.7513 10.7652 14.1403 10.7652C15.5294 10.7652 16.6208 11.2117 17.4642 12.0055L21.929 7.54063C22.5739 6.8957 23.5661 6.8957 24.211 7.54063C24.856 8.18555 24.856 9.17773 24.211 9.82266L18.3571 15.6766V18.7523L19.7462 23.8621C20.0438 24.9535 19.3989 25.8961 18.3571 26.0449C17.4145 26.1938 16.6208 25.648 16.3728 24.7055L14.8349 19.5957H13.4458L11.9079 24.7055C11.6599 25.648 10.8661 26.1938 9.92353 26.0449C8.88174 25.8961 8.23682 24.9535 8.53447 23.8621L9.92353 18.7523V15.6766L4.06963 9.82266C3.42471 9.17773 3.42471 8.18555 4.06963 7.54063Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconSyringe(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden {...props}>
      <path
        d="M8 20.5L18.5 10M18.5 10L21 7.5M18.5 10L16 12.5M6.5 22L8 20.5M21 7.5L23.5 5M21 7.5L18.5 10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 23L7 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect x="19" y="4" width="5" height="3" rx="0.5" transform="rotate(-45 19 4)" fill="currentColor" />
    </svg>
  );
}

export function IconTiter(props: IconProps) {
  return (
    <svg viewBox="0 0 34 34" fill="none" aria-hidden {...props}>
      <path
        d="M5.55078 8.91406H15.9652"
        stroke="currentColor"
        strokeWidth="2.08289"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.98047 8.91406V22.1057C7.98047 22.8422 8.27306 23.5486 8.79389 24.0694C9.31471 24.5903 10.0211 24.8829 10.7576 24.8829C11.4942 24.8829 12.2006 24.5903 12.7214 24.0694C13.2422 23.5486 13.5348 22.8422 13.5348 22.1057V8.91406"
        stroke="currentColor"
        strokeWidth="2.08289"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.98047 16.5508H13.5348"
        stroke="currentColor"
        strokeWidth="2.08289"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.1328 13.0781H29.1587"
        stroke="currentColor"
        strokeWidth="2.08289"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.1328 18.6328H27.0758"
        stroke="currentColor"
        strokeWidth="2.08289"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.1328 24.1875H28.4644"
        stroke="currentColor"
        strokeWidth="2.08289"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconThumbsDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M10 15v4a2 2 0 002 2h.3a2 2 0 001.9-1.3l1.5-4.5A2 2 0 0013.5 13H8V7a2 2 0 012-2 2 2 0 012 2v1" />
      <rect x="4" y="9" width="4" height="10" rx="1" />
    </svg>
  );
}
