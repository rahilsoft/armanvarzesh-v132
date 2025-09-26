import React, { useState } from 'react';
import axios from 'axios';

/**
 * Onboarding screen for the Progressive Web App.  This component
 * presents users with four options corresponding to the different
 * services offered by the platform: workout programmes, nutrition
 * plans, corrective exercises and the full package.  Upon
 * selection the component invokes the matching endpoint via the
 * `/api` proxy to retrieve the appropriate recommendations.
 * Results are shown below the selection buttons in a simple list.
 */
export default function Onboarding() {
  const [results, setResults] = useState<any[]>([]);
  const [choice, setChoice] = useState<string>('');

  async function handleSelect(expertise: string) {
    setChoice(expertise);
    setResults([]);
    // Build a query string.  For the full package we still pass
    // `expertise=package` as the backend recognises this as a
    // special case; a limit of 3 is enforced for consistency with
    // other calls.
    const query = expertise && expertise !== 'package'
      ? `expertise=${expertise}&limit=3`
      : `expertise=package&limit=3`;
    try {
      const response = await axios.get(`/api/matching/recommend?${query}`);
      const data = response.data ?? [];
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
  }

  return (
    <div>
      <h2>انتخاب نوع خدمات</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => handleSelect('trainer')}>برنامه تمرینی</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => handleSelect('nutrition')}>برنامه غذایی</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => handleSelect('physio')}>حرکات اصلاحی</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleSelect('package')}>پکیج کامل</button>
      </div>
      {choice && (
        <h3>
          نتایج برای: {choice === 'package' ? 'پکیج کامل' : choice}
        </h3>
      )}
      {choice && results.length === 0 && <p>هیچ متخصصی یافت نشد.</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id} style={{ marginBottom: 12 }}>
            <strong>{item.name}</strong> — {item.expertise}
            <div style={{ marginTop: 4 }}>
              <button
                onClick={() => {
                  alert(`شروع گفتگو با ${item.name}`);
                }}
              >
                شروع گفتگو
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}