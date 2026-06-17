import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Grid, Sliders, Sparkles } from 'lucide-react';
import stationsData from './data/stations.json';
import { calculateDistance, generateDefaultStampSVG } from './utils/subwayUtils';

// Import Tab Components
import Dashboard from './components/Dashboard';
import StampBook from './components/StampBook';
import Settings from './components/Settings';
import MockGPS from './components/MockGPS';
import StampDetailModal from './components/StampDetailModal';

export default function App() {
  // --- Tab State ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'stamps' | 'settings'
  const [selectedStation, setSelectedStation] = useState(null);

  // --- Settings State (loaded from LocalStorage) ---
  const [settings, setSettingsState] = useState(() => {
    const saved = localStorage.getItem('subway-stamp-settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      geminiApiKey: '',
      geminiModel: 'gemini-2.5-flash',
      gpsRadius: 150
    };
  });

  const setSettings = (newSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem('subway-stamp-settings', JSON.stringify(newSettings));
  };

  // --- Collection State (loaded from LocalStorage) ---
  const [collectedStamps, setCollectedStamps] = useState(() => {
    const saved = localStorage.getItem('subway-stamp-collected');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {};
  });

  const saveCollectedStamps = (newStamps) => {
    setCollectedStamps(newStamps);
    localStorage.setItem('subway-stamp-collected', JSON.stringify(newStamps));
  };

  // --- GPS Location State ---
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    error: null
  });

  // --- Mock Location State (for testing on PC) ---
  const [mockLocation, setMockLocation] = useState({
    active: false,
    lat: null,
    lng: null,
    stationName: null,
    lines: null
  });

  // --- Watch Real GPS Coordinates ---
  useEffect(() => {
    if (!navigator.geolocation) {
      setCurrentLocation(prev => ({ ...prev, error: 'GPS를 지원하지 않는 브라우저입니다.' }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null
        });
      },
      (error) => {
        console.error('GPS Watch Error:', error);
        setCurrentLocation(prev => ({ ...prev, error: error.message }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // --- Location to use for calculation (Mock vs Real) ---
  const activeCoordinates = useMemo(() => {
    if (mockLocation.active) {
      return { lat: mockLocation.lat, lng: mockLocation.lng };
    }
    return { lat: currentLocation.lat, lng: currentLocation.lng };
  }, [mockLocation, currentLocation]);

  // --- Calculate 5 closest stations sorted by distance ---
  const closestStations = useMemo(() => {
    const { lat, lng } = activeCoordinates;
    if (lat === null || lng === null) return [];

    return stationsData
      .map(station => {
        const distance = calculateDistance(lat, lng, station.lat, station.lng);
        return { ...station, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [activeCoordinates]);

  // --- Open Collect Stamp Modal ---
  const handleCollectStamp = (station) => {
    // Just select the station. The modal will detect it's collectable and show the confirmation/generation buttons.
    setSelectedStation(station);
  };

  // --- Confirm Collection & Save ---
  const handleConfirmCollect = (stationId, stampType, svgContent, story) => {
    const updatedStamps = {
      ...collectedStamps,
      [stationId]: {
        collectedAt: new Date().toISOString(),
        stampType: stampType,
        svgContent: svgContent,
        story: story
      }
    };
    saveCollectedStamps(updatedStamps);
    setSelectedStation(null); // Close modal
    
    // Haptic vibration feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate([150, 80, 150]);
    }
  };

  // --- Delete Stamp ---
  const handleDeleteStamp = (stationId) => {
    if (window.confirm("이 역의 수집된 도장을 삭제하시겠습니까?")) {
      const updatedStamps = { ...collectedStamps };
      delete updatedStamps[stationId];
      saveCollectedStamps(updatedStamps);
      setSelectedStation(null); // Close modal
    }
  };

  // --- Save / Update custom SVG and story (AI redesign, revert to offline, etc.) ---
  const handleSaveAIStamp = (stationId, svgContent, story, stampType = 'ai') => {
    const updatedStamps = {
      ...collectedStamps,
      [stationId]: {
        collectedAt: collectedStamps[stationId]?.collectedAt || new Date().toISOString(),
        stampType: stampType,
        svgContent: svgContent,
        story: story
      }
    };
    saveCollectedStamps(updatedStamps);
  };

  // --- Restore import data ---
  const handleImportStamps = (importedData) => {
    saveCollectedStamps(importedData);
  };

  // --- Reset All Data ---
  const handleResetData = () => {
    localStorage.removeItem('subway-stamp-collected');
    localStorage.removeItem('subway-stamp-settings');
    setCollectedStamps({});
    setSettings({
      geminiApiKey: '',
      geminiModel: 'gemini-2.5-flash',
      gpsRadius: 150
    });
  };

  // --- Determine if selected station is currently collectable (within GPS range) ---
  const isCollectable = useMemo(() => {
    if (!selectedStation) return false;
    
    // If it's already collected, it's not collectable (it's already unlocked)
    if (collectedStamps[selectedStation.id]) return false;
    
    const { lat, lng } = activeCoordinates;
    if (lat === null || lng === null) return false;
    
    const distance = calculateDistance(lat, lng, selectedStation.lat, selectedStation.lng);
    return distance <= settings.gpsRadius;
  }, [selectedStation, activeCoordinates, settings.gpsRadius, collectedStamps]);

  // --- Determine if any station is nearby (for nav icon marker) ---
  const isAnyStationNearby = useMemo(() => {
    if (closestStations.length === 0) return false;
    const nearest = closestStations[0];
    return nearest.distance <= settings.gpsRadius && !collectedStamps[nearest.id];
  }, [closestStations, settings.gpsRadius, collectedStamps]);

  return (
    <div className="app-container">
      {/* Mock GPS floating simulator control at the top of everything */}
      <MockGPS 
        stations={stationsData} 
        mockLocation={mockLocation} 
        setMockLocation={setMockLocation} 
      />

      <div className="tab-content">
        {/* Render selected tab view */}
        {activeTab === 'dashboard' && (
          <Dashboard
            currentLocation={currentLocation}
            mockLocation={mockLocation}
            closestStations={closestStations}
            collectedStamps={collectedStamps}
            onCollectStamp={handleCollectStamp}
            gpsRadius={settings.gpsRadius}
          />
        )}

        {activeTab === 'stamps' && (
          <StampBook
            stations={stationsData}
            collectedStamps={collectedStamps}
            onSelectStamp={(station) => setSelectedStation(station)}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            setSettings={setSettings}
            collectedStamps={collectedStamps}
            onImportStamps={handleImportStamps}
            onResetData={handleResetData}
          />
        )}
      </div>

      {/* Bottom Nav Bar */}
      <nav className="bottom-nav glass-panel">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            <Compass size={22} className={isAnyStationNearby ? "pulse-target" : ""} style={{ color: isAnyStationNearby ? 'var(--color-success)' : 'inherit' }} />
            {isAnyStationNearby && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                background: 'var(--color-success)',
                borderRadius: '50%',
                border: '1.5px solid var(--bg-primary)'
              }} />
            )}
          </div>
          <span>주변 탐색</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'stamps' ? 'active' : ''}`}
          onClick={() => setActiveTab('stamps')}
        >
          <Grid size={22} />
          <span>도장첩</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Sliders size={22} />
          <span>설정</span>
        </button>
      </nav>

      {/* Stamp Details Modal */}
      {selectedStation && (
        <StampDetailModal
          station={selectedStation}
          stamp={collectedStamps[selectedStation.id]}
          isCollectable={isCollectable}
          onClose={() => setSelectedStation(null)}
          settings={settings}
          onSaveAIStamp={handleSaveAIStamp}
          onConfirmCollect={handleConfirmCollect}
          onDeleteStamp={handleDeleteStamp}
        />
      )}
    </div>
  );
}

