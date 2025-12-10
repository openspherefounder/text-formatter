// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

const transformations = [
  { 
    id: 'uppercase', 
    label: 'UPPERCASE', 
    icon: '⬆',
    desc: 'Convert all text to uppercase'
  },
  { 
    id: 'lowercase', 
    label: 'lowercase', 
    icon: '⬇',
    desc: 'Convert all text to lowercase'
  },
  { 
    id: 'titlecase', 
    label: 'Title Case', 
    icon: '✨',
    desc: 'Capitalize first letter of each word'
  },
  { 
    id: 'sentence', 
    label: 'Sentence case', 
    icon: '📝',
    desc: 'Capitalize first letter of sentences'
  },
  { 
    id: 'camelcase', 
    label: 'camelCase', 
    icon: '🐫',
    desc: 'Convert to camelCase format'
  },
  { 
    id: 'snakecase', 
    label: 'snake_case', 
    icon: '🐍',
    desc: 'Convert to snake_case format'
  },
  { 
  id: 'kebabcase', 
  label: 'kebab-case', 
  icon: '🍢',  // Using a different icon
  desc: 'Convert to kebab-case format'
  },
  { 
    id: 'reverse', 
    label: 'Reverse', 
    icon: '↩',
    desc: 'Reverse the text'
  },
  { 
    id: 'trim', 
    label: 'Trim Spaces', 
    icon: '✂',
    desc: 'Remove extra whitespace'
  },
  { 
    id: 'alternating', 
    label: 'aLtErNaTiNg', 
    icon: '🎭',
    desc: 'Alternate between upper and lowercase'
  },
  { 
    id: 'count', 
    label: 'Statistics', 
    icon: '📊',
    desc: 'Count words, characters, lines'
  },
  { 
    id: 'remove-numbers', 
    label: 'Remove Numbers', 
    icon: '🔢',
    desc: 'Strip all numeric characters'
  },
];

function applyTransform(text, mode) {
  if (!text) return '';
  
  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
      
    case 'lowercase':
      return text.toLowerCase();
      
    case 'titlecase':
      return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        
    case 'camelcase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        
    case 'snakecase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
        
    case 'kebabcase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
        
    case 'reverse':
      return text.split('').reverse().join('');
      
    case 'trim':
      return text
        .split('\n')
        .map(line => line.trim().replace(/\s+/g, ' '))
        .join('\n')
        .trim();
        
    case 'alternating':
      return text
        .split('')
        .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
        .join('');
        
    case 'count':
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const lines = text.split('\n').length;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length;
      
      return `📊 Text Statistics:\n\n` +
             `Words: ${words.toLocaleString()}\n` +
             `Characters: ${chars.toLocaleString()}\n` +
             `Characters (no spaces): ${charsNoSpaces.toLocaleString()}\n` +
             `Lines: ${lines.toLocaleString()}\n` +
             `Sentences: ${sentences.toLocaleString()}`;
             
    case 'remove-numbers':
      return text.replace(/[0-9]/g, '');
      
    default:
      return text;
  }
}

function App() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('uppercase');
  const [output, setOutput] = useState('');
  const [autoTransform, setAutoTransform] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (autoTransform && input) {
      const result = applyTransform(input, mode);
      setOutput(result);
    }
  }, [input, mode, autoTransform]);

  const handleTransform = () => {
    const result = applyTransform(input, mode);
    setOutput(result);
    
    if (input && result) {
      const newEntry = {
        id: Date.now(),
        mode,
        input: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory([newEntry, ...history.slice(0, 9)]);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleLoadFromHistory = (item) => {
    setMode(item.mode);
    setShowHistory(false);
  };

  const currentMode = transformations.find(t => t.id === mode);

  return (
    <div className="app">
      <aside className={`sidebar ${showHistory ? 'show-history' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <img src="/logo.png" alt="TextForge Logo" />
            </div>
            <div className="brand-text">
              <h1>TextForge</h1>
              <p>Transform & Format</p>
            </div>
          </div>
        </div>

        <div className="transformations">
          <div className="section-label">Transformations</div>
          {transformations.map((t) => (
            <button
              key={t.id}
              className={`transform-item ${mode === t.id ? 'active' : ''}`}
              onClick={() => setMode(t.id)}
              title={t.desc}
            >
              <span className="transform-icon">{t.icon}</span>
              <div className="transform-info">
                <span className="transform-label">{t.label}</span>
                <span className="transform-desc">{t.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <button 
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span>📜</span>
            History ({history.length})
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="mode-indicator">
              <span className="mode-icon">{currentMode?.icon}</span>
              <div>
                <div className="mode-name">{currentMode?.label}</div>
                <div className="mode-description">{currentMode?.desc}</div>
              </div>
            </div>
          </div>
          
          <div className="toolbar-right">
            <label className="auto-transform">
              <input
                type="checkbox"
                checked={autoTransform}
                onChange={(e) => setAutoTransform(e.target.checked)}
              />
              <span>Auto-transform</span>
            </label>
          </div>
        </div>

        <div className="editor-grid">
          <div className="editor-panel">
            <div className="editor-header">
              <div className="editor-title">
                <span className="editor-icon">📝</span>
                Input
              </div>
              <div className="editor-stats">
                {input.split(/\s+/).filter(Boolean).length} words · {input.length} chars
                {input && (
                  <button className="clear-btn" onClick={handleClear}>
                    Clear
                  </button>
                )}
              </div>
            </div>
            <textarea
              className="editor-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your text here..."
              spellCheck={false}
            />
          </div>

          <div className="editor-panel">
            <div className="editor-header">
              <div className="editor-title">
                <span className="editor-icon">✨</span>
                Output
              </div>
              <div className="editor-stats">
                {output.split(/\s+/).filter(Boolean).length} words · {output.length} chars
                {output && (
                  <>
                    <button className="copy-btn" onClick={handleCopy}>
                      Copy
                    </button>
                    <button className="swap-btn" onClick={handleSwap}>
                      Use as Input
                    </button>
                  </>
                )}
              </div>
            </div>
            <textarea
              className="editor-textarea"
              value={output}
              readOnly
              placeholder="Transformed text will appear here..."
              spellCheck={false}
            />
          </div>
        </div>

        {!autoTransform && (
          <div className="action-bar">
            <button 
              className="transform-btn"
              onClick={handleTransform}
              disabled={!input}
            >
              <span>⚡</span>
              Transform Text
            </button>
          </div>
        )}
      </main>

      {showHistory && history.length > 0 && (
        <aside className="history-panel">
          <div className="history-header">
            <h3>Recent Transformations</h3>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>
          <div className="history-list">
            {history.map((item) => (
              <div 
                key={item.id}
                className="history-item"
                onClick={() => handleLoadFromHistory(item)}
              >
                <div className="history-mode">
                  {transformations.find(t => t.id === item.mode)?.icon}
                  {' '}
                  {transformations.find(t => t.id === item.mode)?.label}
                </div>
                <div className="history-preview">{item.input}</div>
                <div className="history-time">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;