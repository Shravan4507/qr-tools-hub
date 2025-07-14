import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import AnimatedDropdown from './AnimatedDropdown';
import './MainQRPanel.css';
import QRForm from './QRForm';
import QRPreview from './QRPreview';
import QRHistory, { QRHistoryItem } from './QRHistory';

export type QRType = 'text' | 'upi' | 'url' | 'wifi' | 'vcard';

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
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
        setError(null);
      } catch (error) {
        setError('Failed to load QR history. Please clear your browser storage or contact support.');
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
    setError(null);
  };

  const handleGenerate = async () => {
    if (!validateForm(qrType, formData)) {
      setError('Please fill all required fields correctly.');
      return;
    }
    
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
      setError(null);
    } catch (err) {
      setError('QR Generation Failed. Please try again or check your input.');
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
    setQrURL(item.qrDataUrl);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-history');
  };

  return (
    <div className="main-panel">
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#b71c1c',
          border: '1px solid #b71c1c',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 500,
        }}>
          {error}
        </div>
      )}
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

      <QRForm
        qrType={qrType}
        formData={formData}
        onInputChange={handleInputChange}
        onGenerate={handleGenerate}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        validateForm={validateForm}
      />

      <QRPreview
        qrURL={qrURL}
        label={getDisplayContent(qrType, formData)}
        onDownload={handleDownload}
      />

      <QRHistory
        history={history}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onClearHistory={clearHistory}
        onLoadFromHistory={loadFromHistory}
      />
    </div>
  );
} 