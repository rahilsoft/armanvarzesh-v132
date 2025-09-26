import React from 'react';

interface CoachCardProps {
  photo: string;
  name: string;
  specialty: string;
  onContact: () => void;
}

const CoachCard: React.FC<CoachCardProps> = ({ photo, name, specialty, onContact }) => {
  return (
    <div className="coach-card">
      <img src={photo} alt={name} />
      <h4>{name}</h4>
      <p>{specialty}</p>
      <button onClick={onContact} className="btn-contact">Contact Coach</button>
    </div>
  );
};

export default CoachCard;