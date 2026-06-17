import React, { useState } from 'react';
import { Key, Eye, EyeOff, Save, Trash2, Sliders, Copy, Clipboard, Check } from 'lucide-react';

export default function Settings({ 
  settings, 
  setSettings, 
  collectedStamps, 
  onImportStamps, 
  onResetData 
}) {
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(settings.geminiModel || 'gemini-2.5-flash');
  const [temperature, setTemperature] = useState(settings.geminiTemperature !== undefined ? settings.geminiTemperature : 0.4);
  const [radius, setRadius] = useState(settings.gpsRadius || 150);
  
  const [importJson, setImportJson] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [importError, setImportError] = useState(null);

  const handleSaveSettings = () => {
    setSettings({
      geminiApiKey: apiKey.trim(),
      geminiModel: selectedModel,
      geminiTemperature: parseFloat(temperature),
      gpsRadius: parseInt(radius, 10)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(collectedStamps, null, 2);
    navigator.clipboard.writeText(dataStr)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error("복사 실패:", err);
      });
  };

  const handleImportData = () => {
    try {
      setImportError(null);
      if (!importJson.trim()) {
        setImportError("가져올 데이터를 입력해 주세요.");
        return;
      }
      const parsed = JSON.parse(importJson.trim());
      
      // Basic validation
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error("올바른 도장 데이터 형식이 아닙니다.");
      }
      
      onImportStamps(parsed);
      setImportJson('');
      alert("도장 데이터를 성공적으로 가져왔습니다!");
    } catch (e) {
      setImportError(`불러오기 실패: ${e.message}`);
    }
  };

  const handleReset = () => {
    if (window.confirm("정말로 모든 수집 데이터와 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      onResetData();
      setApiKey('');
      setRadius(150);
      setSelectedModel('gemini-2.5-flash');
      alert("모든 데이터가 초기화되었습니다.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* API Key Configuration */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Key size={18} className="text-primary" />
          <span>Gemini AI 도장 설정</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Gemini API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? "text" : "password"}
                placeholder="Google AI Studio에서 받은 API Key 입력..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '12px 40px 12px 16px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <a 
              href="https://aistudio.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '10.5px', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-block', marginTop: '6px' }}
            >
              🔑 Google AI Studio에서 무료 API Key 발급받기 →
            </a>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              사용할 Gemini 모델
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="gemini-2.5-flash" style={{ background: '#101118' }}>gemini-2.5-flash (기본 추천)</option>
              <option value="gemini-2.5-pro" style={{ background: '#101118' }}>gemini-2.5-pro (고품질 디자인 추천)</option>
              <option value="gemini-3.1-pro-preview" style={{ background: '#101118' }}>gemini-3.1-pro (Preview - 최고품질)</option>
              <option value="gemini-3-flash-preview" style={{ background: '#101118' }}>gemini-3-flash (Preview)</option>
              <option value="gemini-3.5-flash" style={{ background: '#101118' }}>gemini-3.5-flash (최신 모델)</option>
              <option value="gemini-2.0-flash" style={{ background: '#101118' }}>gemini-2.0-flash</option>
              <option value="gemini-2.0-pro-exp-02-05" style={{ background: '#101118' }}>gemini-2.0-pro-exp-02-05</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <span>AI 디자인 창의성 레벨 (Temperature)</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>
                {temperature === 0.0 ? '0.0 (정형화됨)' : temperature === 1.0 ? '1.0 (매우 창의적)' : temperature.toFixed(1)}
              </span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="1.0" 
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--color-primary)',
                background: 'rgba(255,255,255,0.05)',
                height: '6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
              낮을수록 정해진 형태의 단정한 아이콘을 그리며, 높을수록 화려하고 다채로운 구도의 창의적인 스탬프를 시도합니다. (추천: 0.4 ~ 0.6)
            </p>
          </div>


          <button 
            className="btn btn-primary"
            onClick={handleSaveSettings}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {saveSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{saveSuccess ? '저장 완료!' : '설정 저장'}</span>
          </button>
        </div>
      </div>

      {/* GPS Settings */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sliders size={18} />
          <span>GPS 수집 반경 설정</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>역 인식 범위 (반경)</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{radius}m</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="500" 
              step="50"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              style={{
                width: '100%',
                accentColor: 'var(--color-primary)',
                background: 'rgba(255,255,255,0.05)',
                height: '6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
              지하철역 내부는 GPS가 잘 잡히지 않을 수 있습니다. 도장이 잘 찍히지 않는 경우 반경을 200m ~ 300m로 넓히는 것을 추천합니다.
            </p>
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={handleSaveSettings}
            style={{ width: '100%', padding: '10px' }}
          >
            수집 반경 적용
          </button>
        </div>
      </div>

      {/* Backup & Restore Data */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>수집 기록 백업 및 복원</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              수집한 도장 기록을 복사하여 PC나 메모장에 백업하거나, 다른 브라우저로 백업 데이터를 전송할 수 있습니다.
            </p>
            <button 
              className="btn btn-secondary" 
              onClick={handleExportData}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              <span>{copySuccess ? '클립보드에 복사 완료!' : '수집 데이터 복사 (백업)'}</span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              백업 데이터로 복원하기
            </label>
            <textarea
              placeholder="여기에 백업한 JSON 문자열을 붙여넣으세요..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              style={{
                width: '100%',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '11px',
                resize: 'none',
                outline: 'none'
              }}
            />
            {importError && (
              <span style={{ display: 'block', fontSize: '10.5px', color: 'var(--color-danger)', marginTop: '4px' }}>
                {importError}
              </span>
            )}
            <button 
              className="btn btn-secondary"
              onClick={handleImportData}
              style={{ width: '100%', marginTop: '6px', fontSize: '12px' }}
            >
              <Clipboard size={14} />
              <span>데이터 복원 (덮어쓰기)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-danger)', marginBottom: '8px' }}>위험 구역</h2>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          수집 정보 및 모든 설정값을 삭제하고 초기화합니다.
        </p>
        <button 
          className="btn" 
          onClick={handleReset}
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%' }}
        >
          <Trash2 size={16} />
          <span>모든 앱 데이터 초기화</span>
        </button>
      </div>
    </div>
  );
}
