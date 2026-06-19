import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Sparkles, AlertCircle, RefreshCw, Trash2, ShieldAlert, Check, Award, Download } from 'lucide-react';
import { getLineColor, generateDefaultStampSVG, generateGeminiAIStamp } from '../utils/subwayUtils';

export default function StampDetailModal({ 
  station, 
  collectedStamps,
  isCollectable,
  onClose, 
  settings, 
  onSaveAIStamp,
  onConfirmCollect,
  onDeleteStamp
}) {
  // Local state for the selected line in transit interchange stations
  const [activeLine, setActiveLine] = useState(station.lines[0]);
  
  // Local state to navigate through multiple collected stamps for the active line
  const [selectedStampIdx, setSelectedStampIdx] = useState(0);

  // Reset states when active line changes
  useEffect(() => {
    setSelectedStampIdx(0);
    setTempStamp(null);
    setError(null);
  }, [activeLine]);

  // Dynamically resolve the active stamp data based on the selected line
  const stampKey = `${station.id}_${activeLine}`;
  const stampsList = collectedStamps[stampKey] || [];
  const isCollected = stampsList.length > 0;
  const stamp = stampsList[selectedStampIdx] || null;
  const lineColor = getLineColor(activeLine);
  
  // Local state for the "Collect Flow" (temporary in-memory stamp before confirmation)
  const [tempStamp, setTempStamp] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);

  const formatCollectedDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate AI Stamp (used for both collecting and redesigning)
  const handleGenerateAIStamp = async (isForCollection = false) => {
    const apiKey = settings.geminiApiKey;
    if (!apiKey) {
      setError("설정 화면에서 Gemini API Key를 등록해 주세요!");
      return;
    }

    setLoading(true);
    setError(null);
    
    const steps = [
      "Gemini AI 연결 대기 중...",
      `${station.name} 역사 데이터 분석 중...`,
      "맞춤형 SVG 디자인 초안 구성 중...",
      "잉크 스탬프 벡터 외곽선 드로잉 중...",
      "마무리 렌더링 검사 수행 중..."
    ];

    let currentStep = 0;
    setLoadingStep(steps[currentStep]);
    
    // Animate step text
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setLoadingStep(steps[currentStep]);
      }
    }, 1000);

    try {
      const result = await generateGeminiAIStamp(
        apiKey,
        settings.geminiModel || 'gemini-2.5-flash',
        station.name,
        activeLine,
        settings.geminiTemperature !== undefined ? settings.geminiTemperature : 0.4
      );
      
      clearInterval(interval);
      setLoadingStep("도장 디자인 생성 완료!");
      
      if (isForCollection) {
        // For collect flow: save in temporary state
        setTempStamp({
          stampType: 'ai',
          svgContent: result.svg,
          story: result.story
        });
      } else {
        // For existing stamp: update instantly in database
        onSaveAIStamp(station.id, activeLine, result.svg, result.story, 'ai', stamp?.id);
      }
      
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError(`도장 생성 실패: ${err.message || '네트워크 오류가 발생했습니다.'}`);
      setLoading(false);
    }
  };

  // Generate Offline Default Stamp for temporary collect state
  const handleGenerateDefaultOfflineStamp = () => {
    const defaultSvg = generateDefaultStampSVG(
      station.name, 
      activeLine, 
      new Date().toLocaleDateString()
    );
    setTempStamp({
      stampType: 'default',
      svgContent: defaultSvg,
      story: `${station.name}에 도착하여 발급된 기본 오프라인 도장입니다. (호선: ${activeLine})`
    });
  };

  // Revert an existing AI stamp to offline default stamp
  const handleRevertToOffline = () => {
    if (window.confirm("도장 디자인을 기본 오프라인 디자인으로 변경하시겠습니까?")) {
      const dateStr = stamp && stamp.collectedAt 
        ? new Date(stamp.collectedAt).toLocaleDateString() 
        : new Date().toLocaleDateString();
      const defaultSvg = generateDefaultStampSVG(station.name, activeLine, dateStr);
      const defaultStory = `${station.name}에 도착하여 발급된 기본 오프라인 도장입니다. (호선: ${activeLine})`;
      onSaveAIStamp(station.id, activeLine, defaultSvg, defaultStory, 'default', stamp?.id);
    }
  };

  // Confirm collection and save to local storage
  const handleConfirmSaveCollection = (mode = 'add') => {
    if (!tempStamp) return;
    const replaceId = mode === 'replace' && stamp ? stamp.id : null;
    onConfirmCollect(station.id, activeLine, tempStamp.stampType, tempStamp.svgContent, tempStamp.story, mode, replaceId);
  };

  // Download stamp in SVG or PNG format
  const handleDownloadStamp = (format) => {
    if (!stamp) return;
    const filename = `${station.name}_${activeLine}_도장_${selectedStampIdx + 1}.${format}`;
    if (format === 'svg') {
      const blob = new Blob([stamp.svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const img = new Image();
      const blob = new Blob([stamp.svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, 1000, 1000);
        
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            alert('PNG 변환에 실패했습니다.');
            return;
          }
          const pngUrl = URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
        }, 'image/png');
        
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        // Fallback to SVG
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.replace('.png', '.svg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '800', 
              color: 'white', 
              background: lineColor, 
              padding: '2px 6px', 
              borderRadius: '4px' 
            }}>
              {activeLine}
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Interchange Line Tabs (if multiple lines exist) */}
        {station.lines.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '16px',
            overflowX: 'auto',
            paddingBottom: '4px',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            {station.lines.map((line) => {
              const isActive = line === activeLine;
              const lineBadgeColor = getLineColor(line);
              const list = collectedStamps[`${station.id}_${line}`];
              const isLineCollected = list && list.length > 0;
              
              return (
                <button
                  key={line}
                  onClick={() => setActiveLine(line)}
                  style={{
                    background: isActive ? lineBadgeColor : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.05)',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{line}</span>
                  {isLineCollected && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isActive ? 'white' : lineBadgeColor,
                      display: 'inline-block'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Large Stamp Display Area */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '20px 0 10px 0',
          position: 'relative'
        }}>
          {loading ? (
            <div style={{ 
              width: '180px', 
              height: '180px', 
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.01)', 
              border: '2px dashed rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <RefreshCw size={24} style={{ color: 'var(--color-primary)', animation: 'spin 1.5s linear infinite' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {loadingStep}
              </span>
            </div>
          ) : (
            <div 
              className={isCollected || tempStamp ? "stamp-anim" : ""}
              style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                background: (isCollected || tempStamp) ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
                border: (isCollected || tempStamp) ? 'none' : `3px dashed ${lineColor}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (isCollected || tempStamp) ? '0 15px 35px rgba(0,0,0,0.4)' : 'none',
                position: 'relative'
              }}
            >
              {tempStamp ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: tempStamp.svgContent }} 
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              ) : isCollected && stamp ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: stamp.svgContent }} 
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {isCollectable ? (
                    <Award size={40} className="pulse-target" style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
                  ) : (
                    <MapPin size={40} style={{ color: `${lineColor}44`, margin: '0 auto 8px' }} />
                  )}
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>
                    {isCollectable ? '도장 수집 대기 중' : '미수집 상태'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination Dots & Navigation for Multiple Stamps */}
        {isCollected && stampsList.length > 1 && !tempStamp && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <button
              disabled={selectedStampIdx === 0}
              onClick={() => setSelectedStampIdx(prev => prev - 1)}
              style={{
                background: selectedStampIdx === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                color: selectedStampIdx === 0 ? 'var(--text-muted)' : 'white',
                cursor: selectedStampIdx === 0 ? 'not-allowed' : 'pointer',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                transition: 'all 0.2s'
              }}
            >
              ◀
            </button>
            <div style={{ display: 'flex', gap: '5px' }}>
              {stampsList.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedStampIdx(idx)}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: idx === selectedStampIdx ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
            <button
              disabled={selectedStampIdx === stampsList.length - 1}
              onClick={() => setSelectedStampIdx(prev => prev + 1)}
              style={{
                background: selectedStampIdx === stampsList.length - 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                color: selectedStampIdx === stampsList.length - 1 ? 'var(--text-muted)' : 'white',
                cursor: selectedStampIdx === stampsList.length - 1 ? 'not-allowed' : 'pointer',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                transition: 'all 0.2s'
              }}
            >
              ▶
            </button>
          </div>
        )}

        {/* Station Name Details */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>{station.name}</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <MapPin size={12} />
            <span>위도: {station.lat.toFixed(4)} / 경도: {station.lng.toFixed(4)}</span>
          </p>
        </div>

        {/* Dynamic Display Layout based on state */}
        {isCollected && !tempStamp ? (
          /* ========================================================================= */
          /* CASE 1: Already Collected Station - Show Details & Actions                 */
          /* ========================================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stamp && (
              <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>수집 일시:</span>
                  <span style={{ fontWeight: '600', color: 'white' }}>{formatCollectedDate(stamp.collectedAt)}</span>
                </div>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>스탬프 테마 설명 ({selectedStampIdx + 1}번째 도장):</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                    {stamp.story}
                  </p>
                </div>

                {/* Download Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '4px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDownloadStamp('svg')}
                    style={{ fontSize: '11px', padding: '8px', gap: '4px', minWidth: 'auto', background: 'rgba(255,255,255,0.04)' }}
                  >
                    <Download size={12} />
                    <span>SVG 다운로드</span>
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDownloadStamp('png')}
                    style={{ fontSize: '11px', padding: '8px', gap: '4px', minWidth: 'auto', background: 'rgba(255,255,255,0.04)' }}
                  >
                    <Download size={12} />
                    <span>PNG 다운로드</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message if any */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', fontSize: '11px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '6px' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Actions for Collected Stamps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {/* AI Redesign Button */}
                <button
                  className="btn"
                  onClick={() => handleGenerateAIStamp(false)}
                  style={{
                    background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                    color: 'white',
                    fontSize: '12px',
                    padding: '10px'
                  }}
                >
                  <Sparkles size={14} fill="white" />
                  <span>AI 도장 재생성</span>
                </button>

                {/* Revert to Offline Button */}
                {stamp && stamp.stampType === 'ai' && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleRevertToOffline}
                    style={{ fontSize: '12px', padding: '10px' }}
                  >
                    <RefreshCw size={14} />
                    <span>오프라인 도장으로</span>
                  </button>
                )}
              </div>

              {/* Delete Stamp Button */}
              {stamp && (
                <button
                  className="btn"
                  onClick={() => onDeleteStamp(station.id, activeLine, stamp.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--color-danger)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    fontSize: '12px',
                    padding: '10px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>이 도장 삭제하기</span>
                </button>
              )}
            </div>
          </div>
        ) : isCollectable || tempStamp ? (
          /* ========================================================================= */
          /* CASE 2: Station is Collectable (GPS Match) - Collect Flow                  */
          /* ========================================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!tempStamp ? (
              // STEP 1: Not yet generated in-memory. Offer choices.
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13px',
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  🎉 현재 {station.name} [{activeLine}] 수집 권한이 활성화되었습니다!
                </div>
                
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  도장을 생성한 뒤 도장첩에 저장하세요.
                </p>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', fontSize: '11px', textAlign: 'left', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '6px' }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {/* Option A: Generate AI Stamp */}
                  <button 
                    className="btn"
                    onClick={() => handleGenerateAIStamp(true)}
                    style={{
                      background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                      color: 'white',
                      padding: '12px',
                      fontSize: '13px'
                    }}
                  >
                    <Sparkles size={14} fill="white" />
                    <span>AI 맞춤형 도장 생성</span>
                  </button>

                  {/* Option B: Generate Default Offline Stamp */}
                  <button
                    className="btn btn-secondary"
                    onClick={handleGenerateDefaultOfflineStamp}
                    style={{ padding: '12px', fontSize: '13px' }}
                  >
                    <RefreshCw size={14} />
                    <span>오프라인 기본 도장 생성</span>
                  </button>
                </div>
              </div>
            ) : (
              // STEP 2: Temporary stamp generated in-memory. Confirm or Discard.
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="glass-card" style={{ padding: '14px', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>도장 디자인 스토리:</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', marginTop: '4px' }}>
                    {tempStamp.story}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {isCollected ? (
                    /* Offer Replace vs Add if existing stamps are present */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        className="btn"
                        onClick={() => handleConfirmSaveCollection('add')}
                        style={{
                          background: 'var(--color-success)',
                          color: 'white',
                          padding: '12px 6px',
                          fontWeight: '700',
                          fontSize: '12px'
                        }}
                      >
                        <Check size={14} />
                        <span>새 도장으로 추가</span>
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleConfirmSaveCollection('replace')}
                        style={{
                          background: 'var(--color-primary)',
                          color: 'white',
                          padding: '12px 6px',
                          fontWeight: '700',
                          fontSize: '12px'
                        }}
                      >
                        <RefreshCw size={14} />
                        <span>현재 도장 대체</span>
                      </button>
                    </div>
                  ) : (
                    /* Simple add if no existing stamps */
                    <button
                      className="btn"
                      onClick={() => handleConfirmSaveCollection('add')}
                      style={{
                        background: 'var(--color-success)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        padding: '12px',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}
                    >
                      <Check size={16} />
                      <span>도장 획득 확정 (도장첩에 저장)</span>
                    </button>
                  )}

                  {/* Discard / Regenerate */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => setTempStamp(null)}
                    style={{ padding: '10px', fontSize: '12px' }}
                  >
                    <span>취소하고 다시 고르기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 3: Locked Station - Cannot collect (Out of range)                      */
          /* ========================================================================= */
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--color-warning)' }} />
              <span>도장을 획득할 수 없는 상태입니다.</span>
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
              지하철을 타고 이 역 근처(수집 반경 {settings.gpsRadius}m 이내)로 접근하면 해당 호선의 도장 수집 권한이 활성화됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
