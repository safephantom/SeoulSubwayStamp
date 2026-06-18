import React from 'react';
import { Compass, MapPin, Award, Navigation } from 'lucide-react';
import { getLineColor } from '../utils/subwayUtils';

export default function Dashboard({ 
  currentLocation, 
  mockLocation, 
  closestStations, 
  collectedStamps, 
  onCollectStamp, 
  gpsRadius 
}) {
  const isMock = mockLocation.active;
  const activeLat = isMock ? mockLocation.lat : currentLocation.lat;
  const activeLng = isMock ? mockLocation.lng : currentLocation.lng;
  const accuracy = isMock ? 1.0 : currentLocation.accuracy;

  // Find if there is any station nearby within the radius
  const nearestStation = closestStations[0];
  const isNearby = nearestStation && nearestStation.distance <= gpsRadius;
  const hasAnyStampForNearest = nearestStation && nearestStation.lines.some(line => {
    const list = collectedStamps[`${nearestStation.id}_${line}`];
    return list && list.length > 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* GPS Status Card */}
      <div className="glass-card" style={{ padding: '16px', borderLeft: isMock ? '3px solid #fbbf24' : '3px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ 
            background: isMock ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)', 
            padding: '8px', 
            borderRadius: '10px',
            color: isMock ? '#fbbf24' : 'var(--color-primary)'
          }}>
            <Compass size={20} className={isMock ? "" : "pulse-target"} style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700' }}>현재 위치 상태</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {isMock ? '시뮬레이션 모드 활성화됨' : '실시간 모바일 GPS 연결됨'}
            </p>
          </div>
        </div>

        {activeLat && activeLng ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>LATITUDE (위도)</span>
              <code style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{activeLat.toFixed(6)}</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>LONGITUDE (경도)</span>
              <code style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{activeLng.toFixed(6)}</code>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' }}>
              <span>정확도 오차 범위: </span>
              <span>±{accuracy ? accuracy.toFixed(1) : '?'}m</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <Navigation size={20} style={{ margin: '0 auto 8px', color: 'var(--text-muted)', animation: 'spin 2s linear infinite' }} />
            <span>GPS 신호를 기다리는 중입니다...</span>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>브라우저의 위치 서비스 권한을 허용해 주세요.</p>
          </div>
        )}
      </div>

      {/* Main Stamp Collect Call-To-Action (CTA) */}
      {isNearby ? (
        <div className="glass-panel pulse-target" style={{ 
          padding: '24px', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.08) 0%, rgba(10, 11, 16, 0.8) 100%)'
        }}>
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.2)',
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#10b981',
            marginBottom: '4px'
          }}>
            <Award size={32} />
          </div>
          
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>
              {nearestStation.name}역 발견!
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              현재 {nearestStation.name}에서 약 <strong>{Math.round(nearestStation.distance)}m</strong> 거리에 있습니다.
            </p>
          </div>

          <button 
            className="btn btn-primary pulse-target" 
            onClick={() => onCollectStamp(nearestStation)}
            style={{ 
              background: 'var(--color-success)', 
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              padding: '14px 28px',
              fontSize: '15px',
              width: '100%',
              fontWeight: '700'
            }}
          >
            도장 수집하기
          </button>
          {hasAnyStampForNearest && (
            <p style={{ fontSize: '11.5px', color: 'var(--color-success)', marginTop: '-8px', fontWeight: '600' }}>
              ✓ 이미 이 역의 도장을 보유하고 있습니다. 새 도장을 추가하거나 대체할 수 있습니다.
            </p>
          )}
        </div>
      ) : (
        nearestStation && (
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              가장 가까운 역은 <strong>{nearestStation.name}</strong>입니다.
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              도장을 찍으려면 {Math.round(nearestStation.distance - gpsRadius)}m 더 접근해야 합니다. (수집 반경: {gpsRadius}m)
            </p>
          </div>
        )
      )}

      {/* Closest Stations List */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          주변 지하철역 목록 (가까운 순)
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {closestStations.length > 0 ? (
            closestStations.map((station, index) => {
              const collectedList = station.lines.flatMap(line => collectedStamps[`${station.id}_${line}`] || []);
              const collectedCount = collectedList.length;
              const collected = collectedCount > 0;
              return (
                <div 
                  key={station.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '12px 16px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: index === 0 && isNearby ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255,255,255,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Line Badge Indication */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {station.lines.map(line => (
                        <span 
                          key={line} 
                          style={{ 
                            fontSize: '9px', 
                            fontWeight: '700', 
                            color: 'white', 
                            background: getLineColor(line), 
                            padding: '1px 5px', 
                            borderRadius: '3px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{station.name}</span>
                      {collected && (
                        <span style={{ fontSize: '10px', color: 'var(--color-success)', marginLeft: '8px', fontWeight: '600' }}>
                          ✓ 수집됨 ({collectedCount}개)
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: '700', 
                      color: station.distance <= gpsRadius ? 'var(--color-success)' : 'var(--text-primary)'
                    }}>
                      {station.distance < 1000 
                        ? `${Math.round(station.distance)}m` 
                        : `${(station.distance / 1000).toFixed(1)}km`
                      }
                    </span>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {station.distance <= gpsRadius ? '수집 가능' : '수집 불가'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
              주변 역을 조회할 수 없습니다. GPS가 작동 중인지 확인해 주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
