import React, { useState } from 'react';
import { MapPin, X, Check, Search } from 'lucide-react';

export default function MockGPS({ stations, mockLocation, setMockLocation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stations based on search query (limit to 5 results for dropdown)
  const filteredStations = searchQuery.trim() === '' 
    ? [] 
    : stations.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSelectStation = (station) => {
    setMockLocation({
      active: true,
      lat: station.lat,
      lng: station.lng,
      stationName: station.name,
      lines: station.lines
    });
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClearMock = () => {
    setMockLocation({
      active: false,
      lat: null,
      lng: null,
      stationName: null,
      lines: null
    });
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {mockLocation.active ? (
        <div className="mock-gps-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} fill="#fbbf24" stroke="#101118" />
            <span>
              위치 모킹: <strong>{mockLocation.stationName}</strong> ({mockLocation.lines.join(', ')})
            </span>
          </div>
          <button 
            onClick={handleClearMock}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#fbbf24', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            title="실시간 GPS로 전환"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '12px' }}>
          {isOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>시뮬레이터 (가상 위치 지정)</span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div style={{ position: 'relative', display: 'flex', gap: '6px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="테스트할 지하철역 이름 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '8px 8px 8px 32px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              {filteredStations.length > 0 && (
                <div className="glass-panel" style={{ 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-glass)',
                  background: '#161724'
                }}>
                  {filteredStations.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectStation(s)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: 'white',
                        textAlign: 'left',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{s.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {s.lines.join(', ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '8px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <MapPin size={14} />
              <span>PC 테스트용 가상 위치 시뮬레이터 켜기</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
