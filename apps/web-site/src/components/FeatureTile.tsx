import React from 'react';

interface FeatureTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureTile: React.FC<FeatureTileProps> = ({ icon, title, description }) => {
  return (
    <div className="feature-tile">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureTile;