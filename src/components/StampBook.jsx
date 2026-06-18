import React, { useState, useMemo } from 'react';
import { Search, Grid, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { getLineColor, generateDefaultStampSVG } from '../utils/subwayUtils';

// List of major subway lines for filtering
const FILTER_LINES = [
  "전체", "1호선", "2호선", "3호선", "4호선", "5호선", "6호선", "7호선", "8호선", "9호선",
  "수인분당선", "신분당선", "경의중앙선", "공항철도", "인천1호선", "인천2호선"
];

export default function StampBook({ stations, collectedStamps, onSelectStamp }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'collected' | 'locked'

  // Statistics
  // Unique station-line keys with at least one stamp
  const collectedLineKeys = Object.keys(collectedStamps).filter(key => collectedStamps[key] && collectedStamps[key].length > 0);
  const collectedUniqueLinesCount = collectedLineKeys.length;
  
  // Total stamps collected (sum of lengths)
  const totalStampsCount = Object.values(collectedStamps).reduce((acc, list) => acc + (list ? list.length : 0), 0);
  
  const collectedCount = collectedUniqueLinesCount;
  const collectedPercentage = totalStationsCount > 0 
    ? ((collectedCount / totalStationsCount) * 100).toFixed(1) 
    : 0;

  // Filter stations based on filters
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // 1. Search Query filter
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Line filter
      const matchesLine = selectedLine === '전체' || station.lines.includes(selectedLine);
      
      // 3. Status filter
      const collectedLines = station.lines.filter(line => {
        const list = collectedStamps[`${station.id}_${line}`];
        return list && list.length > 0;
      });
      const isCollected = collectedLines.length > 0;
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'collected' && isCollected) || 
        (statusFilter === 'locked' && !isCollected);
        
      return matchesSearch && matchesLine && matchesStatus;
    });
  }, [stations, collectedStamps, searchQuery, selectedLine, statusFilter]);

  // We paginate or limit the rendered list to 100 items if the query is blank to ensure smooth scrolling
  const [visibleCount, setVisibleCount] = useState(80);
  const visibleStations = useMemo(() => {
    return filteredStations.slice(0, visibleCount);
  }, [filteredStations, visibleCount]);

  const hasMore = filteredStations.length > visibleCount;

  const loadMore = () => {
    setVisibleCount(prev => prev + 80);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Progress Header */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>나의 지하철 도장첩</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              수도권 전철 도장을 수집해보세요! (총 도장 개수: {totalStampsCount}개)
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {collectedCount}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {' '}/ {totalStationsCount}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(parseFloat(collectedPercentage), 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--color-primary) 0%, #a855f7 100%)',
              borderRadius: '4px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>수집률 {collectedPercentage}%</span>
            <span>달성</span>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="역 이름 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(80); // Reset pagination
            }}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {[
            { id: 'all', label: '전체' },
            { id: 'collected', label: '수집됨' },
            { id: 'locked', label: '미수집' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => {
                setStatusFilter(btn.id);
                setVisibleCount(80);
              }}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: statusFilter === btn.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                color: statusFilter === btn.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Line Filter Scrollbar */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto', 
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {FILTER_LINES.map(line => (
            <button
              key={line}
              onClick={() => {
                setSelectedLine(line);
                setVisibleCount(80);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                background: selectedLine === line 
                  ? (line === '전체' ? 'var(--color-primary)' : getLineColor(line))
                  : 'rgba(255,255,255,0.04)',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: selectedLine === line ? 1 : 0.6
              }}
            >
              {line}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Stamps */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', padding: '0 4px' }}>
          <span>검색 결과: {filteredStations.length}개 역</span>
          {filteredStations.length > visibleCount && <span>{visibleCount}개 표시 중</span>}
        </div>

        <div className="stamp-grid">
          {visibleStations.map(station => {
            const collectedLines = station.lines.filter(line => {
              const list = collectedStamps[`${station.id}_${line}`];
              return list && list.length > 0;
            });
            const isCollected = collectedLines.length > 0;
            
            // Representative line to show (default to first collected line, or primary line if none collected)
            const displayLine = collectedLines[0] || station.lines[0];
            const stampsList = collectedStamps[`${station.id}_${displayLine}`] || [];
            const stamp = stampsList[0];
            const lineColor = getLineColor(displayLine);

            return (
              <div 
                key={station.id}
                onClick={() => onSelectStamp(station)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Stamp Badge Visual */}
                <div 
                  className={`stamp-badge ${isCollected ? 'unlocked' : 'locked'}`}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderColor: !isCollected ? `${lineColor}44` : 'transparent',
                    background: isCollected ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                    position: 'relative'
                  }}
                >
                  {isCollected ? (
                    <div className="stamp-svg-container">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: (stamp && stamp.svgContent) || generateDefaultStampSVG(station.name, displayLine) 
                        }} 
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      />
                      {stamp && stamp.stampType === 'ai' && (
                        <div style={{
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                          borderRadius: '50%',
                          padding: '3px',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }} title="AI 디자인">
                          <Sparkles size={8} fill="white" />
                        </div>
                      )}
                      {stampsList.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          background: 'rgba(16, 185, 129, 0.95)',
                          borderRadius: '10px',
                          padding: '2px 6px',
                          color: 'white',
                          fontSize: '9px',
                          fontWeight: '800',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid var(--bg-primary)',
                          zIndex: 10
                        }}>
                          ×{stampsList.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Lock size={14} style={{ color: `${lineColor}88` }} />
                      <span style={{ fontSize: '8px', color: `${lineColor}bb`, fontWeight: '700' }}>
                        {displayLine.replace('호선', '')}
                      </span>
                    </div>
                  )}

                  {/* Interchange progress dots for transit stations */}
                  {station.lines.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '3px',
                      background: 'rgba(10, 11, 16, 0.8)',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {station.lines.map(line => {
                        const list = collectedStamps[`${station.id}_${line}`];
                        const isLineCollected = list && list.length > 0;
                        return (
                          <span 
                            key={line} 
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isLineCollected ? getLineColor(line) : 'rgba(255,255,255,0.15)',
                              transition: 'background 0.3s'
                            }} 
                            title={`${line}: ${isLineCollected ? '수집 완료' : '미수집'}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Station Name Label */}
                <span 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: isCollected ? '700' : '500', 
                    color: isCollected ? 'white' : 'var(--text-secondary)',
                    textAlign: 'center',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={station.name}
                >
                  {station.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <button
            onClick={loadMore}
            className="btn btn-secondary"
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            더 보기 ({filteredStations.length - visibleCount}개 남음)
          </button>
        )}

        {filteredStations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
            필터 조건에 맞는 지하철역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
