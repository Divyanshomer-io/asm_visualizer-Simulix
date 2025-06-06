
import React from 'react';

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  role?: string;
  ariaLabel?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  children,
  className = '',
  role = 'region',
  ariaLabel
}) => {
  return (
    <section
      className={`info-box ${className}`}
      role={role}
      aria-label={ariaLabel || title}
      tabIndex={0}
    >
      <h3 className="info-box-title">{title}</h3>
      <div className="info-box-content">{children}</div>
    </section>
  );
};
