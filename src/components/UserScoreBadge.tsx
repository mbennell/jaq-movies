'use client'

import { useState } from 'react'

interface UserScoreBadgeProps {
  score: number
  size?: number
}

export default function UserScoreBadge({ score, size = 80 }: UserScoreBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Determine color and emoji based on score
  const getScoreStyle = (score: number) => {
    if (score >= 70) {
      return {
        color: '#21d07a',
        emoji: '😊',
        indicator: '🟢'
      }
    } else if (score >= 40) {
      return {
        color: '#d2d531', 
        emoji: '😐',
        indicator: '🟡'
      }
    } else {
      return {
        color: '#db2360',
        emoji: '☹️', 
        indicator: '🔴'
      }
    }
  }

  const scoreStyle = getScoreStyle(score)
  const circumference = 2 * Math.PI * 28 // radius = 28
  const strokeOffset = circumference - (score / 100) * circumference

  return (
    <div 
      className="user-score-badge"
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* SVG Circular Progress */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        style={{
          transform: 'rotate(-90deg)',
          filter: showTooltip ? 'drop-shadow(0 0 8px rgba(33, 208, 122, 0.4))' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Background Circle */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="transparent"
          stroke="#333"
          strokeWidth="4"
        />
        {/* Progress Circle */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="transparent"
          stroke={scoreStyle.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            animation: showTooltip ? 'pulse 1.5s infinite' : 'none'
          }}
        />
      </svg>

      {/* Score Text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: size > 60 ? '14px' : '12px',
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'var(--font-family, "Helvetica Neue", Arial, sans-serif)'
        }}
      >
        <span style={{ color: scoreStyle.color }}>{score}%</span>
        <span style={{ fontSize: '12px', marginTop: '2px' }}>
          {scoreStyle.emoji}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${scoreStyle.color}`
          }}
        >
          Your Score: {score}%
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `5px solid ${scoreStyle.color}`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .user-score-badge {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}