import React from "react";

const users = [
  { name: "محمدرضا", progress: "در حال پیشرفت", xp: 1300, level: 5 },
  { name: "سارا", progress: "نیاز به پیگیری", xp: 800, level: 3 },
];

const ClientProgressCard: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {users.map((user, idx) => (
      <div key={idx} className="p-6 bg-white shadow rounded border">
        <h4 className="text-lg font-bold">{user.name}</h4>
        <p className="text-sm mt-1">وضعیت: {user.progress}</p>
        <p className="text-sm">XP: {user.xp} | سطح: {user.level}</p>
      </div>
    ))}
  </div>
);

export default ClientProgressCard;