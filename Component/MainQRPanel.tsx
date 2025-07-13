import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import AnimatedDropdown from './AnimatedDropdown';
import './MainQRPanel.css';

type QRType = 'text' | 'upi' | 'url' | 'wifi' | 'vcard';

interface QRHistoryItem {
  id: string;
  type: QRType;
  content: string;
  timestamp: number;
  qrDataUrl: string;
}

interface FormData {
  text?: string;
  upiId?: string;
  amount?: string;
  url?: string;
  ssid?: string;
  password?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  phone?: string;
  email?: string;
}

const QR_TYPE_OPTIONS = [
  { value: 'text', label: 'Plain Text' },
  { value: 'upi', label: 'UPI Payments' },
  { value: 'url', label: 'URLs' },
  { value: 'wifi', label: 'Wi-Fi (SSID + Password)' },
  { value: 'vcard', label: 'vCard (Contact Info)' }
];

export default function MainQRPanel() {
  const [qrType, setQrType] = useState<QRType>('text');
  const [formData, setFormData] = useState<FormData>({});
  const [qrURL, setQrURL] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load QR history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('qr-history', JSON.stringify(history));
  }, [history]);

  // Reset form data when QR type changes
  useEffect(() => {
    setFormData({});
    setQrURL('');
  }, [qrType]);

  const generateQRContent = (type: QRType, data: FormData): string => {
    switch (type) {
      case 'text':
        return data.text || '';
      
      case 'upi':
        const upiId = data.upiId || '';
        const amount = data.amount || '';
        return `upi://pay?pa=${upiId}&pn=Payment${amount ? `&am=${amount}` : ''}&cu=INR`;
      
      case 'url':
        const url = data.url || '';
        return url.startsWith('http') ? url : `https://${url}`;
      
      case 'wifi':
        const ssid = data.ssid || '';
        const password = data.password || '';
        return `WIFI:T:WPA;S:${ssid};P:${password};;`;
      
      case 'vcard':
        const firstName = data.firstName || '';
        const middleName = data.middleName || '';
        const surname = data.surname || '';
        const phone = data.phone || '';
        const email = data.email || '';
        const fullName = [firstName, middleName, surname].filter(Boolean).join(' ');
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
      
      default:
        return '';
    }
  };

  const validateForm = (type: QRType, data: FormData): boolean => {
    switch (type) {
      case 'text':
        return !!(data.text && data.text.trim());
      
      case 'upi':
        return !!(data.upiId && data.upiId.trim());
      
      case 'url':
        return !!(data.url && data.url.trim());
      
      case 'wifi':
        return !!(data.ssid && data.ssid.trim());
      
      case 'vcard':
        return !!(data.firstName && data.firstName.trim() && data.phone && data.phone.trim());
      
      default:
        return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!validateForm(qrType, formData)) return;
    
    try {
      const qrContent = generateQRContent(qrType, formData);
      
      const options = {
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 200,
        margin: 1
      };

      const url = await QRCode.toDataURL(qrContent, options);
      setQrURL(url);

      // Add to history
      const historyItem: QRHistoryItem = {
        id: Date.now().toString(),
        type: qrType,
        content: getDisplayContent(qrType, formData),
        timestamp: Date.now(),
        qrDataUrl: url
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items
    } catch (err) {
      console.error('QR Generation Failed:', err);
    }
  };

  const getDisplayContent = (type: QRType, data: FormData): string => {
    switch (type) {
      case 'text':
        return data.text || '';
      case 'upi':
        return `${data.upiId}${data.amount ? ` - ₹${data.amount}` : ''}`;
      case 'url':
        return data.url || '';
      case 'wifi':
        return `${data.ssid}${data.password ? ' (Protected)' : ' (Open)'}`;
      case 'vcard':
        return `${data.firstName} ${data.surname}`;
      default:
        return '';
    }
  };

  const handleDownload = () => {
    if (!qrURL) return;
    
    const link = document.createElement('a');
    link.download = `qr-${qrType}-${Date.now()}.png`;
    link.href = qrURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadFromHistory = (item: QRHistoryItem) => {
    setQrType(item.type);
    // Note: We can't fully restore form data from history display content
    // This is a limitation of the current design
    setQrURL(item.qrDataUrl);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-history');
  };

  const renderForm = () => {
    switch (qrType) {
      case 'text':
        return (
          <div className="form-container">
            <input
              type="text"
              value={formData.text || ''}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Enter any text..."
              className="qr-input"
            />
            <button onClick={handleGenerate} className="generate-btn">Generate QR</button>
          </div>
        );

      case 'upi':
        return (
          <div className="form-container">
            <div className="input-group">
              <input
                type="text"
                value={formData.upiId || ''}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
                placeholder="Enter UPI ID (e.g., user@upi)"
                className="qr-input"
              />
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Amount (optional)"
                className="qr-input"
              />
            </div>
            <button onClick={handleGenerate} className="generate-btn">Generate QR</button>
          </div>
        );

      case 'url':
        return (
          <div className="form-container">
            <input
              type="text"
              value={formData.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="Enter URL (e.g., google.com)"
              className="qr-input"
            />
            <button onClick={handleGenerate} className="generate-btn">Generate QR</button>
          </div>
        );

      case 'wifi':
        return (
          <div className="form-container">
            <div className="input-group">
              <input
                type="text"
                value={formData.ssid || ''}
                onChange={(e) => handleInputChange('ssid', e.target.value)}
                placeholder="Wi-Fi Network Name (SSID)"
                className="qr-input"
              />
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Password (optional)"
                  className="qr-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <button onClick={handleGenerate} className="generate-btn">Generate QR</button>
          </div>
        );

      case 'vcard':
        return (
          <div className="form-container">
            <div className="input-group">
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First Name"
                className="qr-input"
              />
              <input
                type="text"
                value={formData.middleName || ''}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                placeholder="Middle Name (optional)"
                className="qr-input"
              />
              <input
                type="text"
                value={formData.surname || ''}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                placeholder="Surname"
                className="qr-input"
              />
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 Contact Number"
                className="qr-input"
              />
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email ID"
                className="qr-input"
              />
            </div>
            <button onClick={handleGenerate} className="generate-btn">Generate QR</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="main-panel">
      <h1 className="main-title">Welcome to QR Tools Hub</h1>
      <p className="main-subtitle">Your one-stop hub for smart QR code utilities.</p>

      <div className="qr-type-selector">
        <AnimatedDropdown
          options={QR_TYPE_OPTIONS}
          value={qrType}
          onChange={(value) => setQrType(value as QRType)}
          placeholder="Select QR Type"
          className="qr-type-dropdown"
        />
      </div>

      {renderForm()}

      {qrURL && (
        <div className="qr-output">
          <div className="qr-container">
            <img src={qrURL} alt="Generated QR" />
          </div>
          <p className="qr-label">QR for: {getDisplayContent(qrType, formData)}</p>
          <div className="qr-actions">
            <button onClick={handleDownload} className="download-btn">
              Download PNG
            </button>
          </div>
        </div>
      )}

      <div className="history-section">
        <div className="history-header">
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="history-toggle"
          >
            {showHistory ? 'Hide' : 'Show'} History ({history.length})
          </button>
          {history.length > 0 && (
            <button onClick={clearHistory} className="clear-history-btn">
              Clear History
            </button>
          )}
        </div>
        
        {showHistory && history.length > 0 && (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                <img src={item.qrDataUrl} alt="QR" className="history-qr" />
                <div className="history-details">
                  <span className="history-type">{item.type.toUpperCase()}</span>
                  <span className="history-content">{item.content}</span>
                  <span className="history-time">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 