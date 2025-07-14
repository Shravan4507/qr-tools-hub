import React, { useState } from 'react';

export interface FormData {
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

export type QRType = 'text' | 'upi' | 'url' | 'wifi' | 'vcard';

interface QRFormProps {
  qrType: QRType;
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onGenerate: () => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  validateForm: (type: QRType, data: FormData) => boolean;
}

const QRForm: React.FC<QRFormProps> = ({
  qrType,
  formData,
  onInputChange,
  onGenerate,
  showPassword,
  setShowPassword,
  validateForm,
}) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [localError, setLocalError] = useState<{ [key: string]: string }>({});

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Simple validation for each field
    switch (field) {
      case 'text':
        if (!formData.text || !formData.text.trim()) setLocalError((e) => ({ ...e, text: 'Text is required.' }));
        else setLocalError((e) => ({ ...e, text: '' }));
        break;
      case 'upiId':
        if (!formData.upiId || !formData.upiId.trim()) setLocalError((e) => ({ ...e, upiId: 'UPI ID is required.' }));
        else setLocalError((e) => ({ ...e, upiId: '' }));
        break;
      case 'url':
        if (!formData.url || !formData.url.trim()) setLocalError((e) => ({ ...e, url: 'URL is required.' }));
        else setLocalError((e) => ({ ...e, url: '' }));
        break;
      case 'ssid':
        if (!formData.ssid || !formData.ssid.trim()) setLocalError((e) => ({ ...e, ssid: 'SSID is required.' }));
        else setLocalError((e) => ({ ...e, ssid: '' }));
        break;
      case 'firstName':
        if (!formData.firstName || !formData.firstName.trim()) setLocalError((e) => ({ ...e, firstName: 'First name is required.' }));
        else setLocalError((e) => ({ ...e, firstName: '' }));
        break;
      case 'phone':
        if (!formData.phone || !formData.phone.trim()) setLocalError((e) => ({ ...e, phone: 'Phone is required.' }));
        else setLocalError((e) => ({ ...e, phone: '' }));
        break;
      default:
        break;
    }
  };

  switch (qrType) {
    case 'text':
      return (
        <div className="form-container">
          <input
            type="text"
            value={formData.text || ''}
            onChange={(e) => onInputChange('text', e.target.value)}
            onBlur={() => handleBlur('text')}
            placeholder="Enter any text..."
            className="qr-input"
          />
          {touched.text && localError.text && (
            <div style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 2 }}>{localError.text}</div>
          )}
          <button onClick={onGenerate} className="generate-btn" disabled={!validateForm(qrType, formData)}>
            Generate QR
          </button>
        </div>
      );
    case 'upi':
      return (
        <div className="form-container">
          <div className="input-group">
            <input
              type="text"
              value={formData.upiId || ''}
              onChange={(e) => onInputChange('upiId', e.target.value)}
              onBlur={() => handleBlur('upiId')}
              placeholder="Enter UPI ID (e.g., user@upi)"
              className="qr-input"
            />
            {touched.upiId && localError.upiId && (
              <div style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 2 }}>{localError.upiId}</div>
            )}
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => onInputChange('amount', e.target.value)}
              placeholder="Amount (optional)"
              className="qr-input"
            />
          </div>
          <button onClick={onGenerate} className="generate-btn" disabled={!validateForm(qrType, formData)}>
            Generate QR
          </button>
        </div>
      );
    case 'url':
      return (
        <div className="form-container">
          <input
            type="text"
            value={formData.url || ''}
            onChange={(e) => onInputChange('url', e.target.value)}
            onBlur={() => handleBlur('url')}
            placeholder="Enter URL (e.g., google.com)"
            className="qr-input"
          />
          {touched.url && localError.url && (
            <div style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 2 }}>{localError.url}</div>
          )}
          <button onClick={onGenerate} className="generate-btn" disabled={!validateForm(qrType, formData)}>
            Generate QR
          </button>
        </div>
      );
    case 'wifi':
      return (
        <div className="form-container">
          <div className="input-group">
            <input
              type="text"
              value={formData.ssid || ''}
              onChange={(e) => onInputChange('ssid', e.target.value)}
              onBlur={() => handleBlur('ssid')}
              placeholder="Wi-Fi Network Name (SSID)"
              className="qr-input"
            />
            {touched.ssid && localError.ssid && (
              <div style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 2 }}>{localError.ssid}</div>
            )}
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => onInputChange('password', e.target.value)}
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
          <button onClick={onGenerate} className="generate-btn" disabled={!validateForm(qrType, formData)}>
            Generate QR
          </button>
        </div>
      );
    case 'vcard':
      return (
        <div className="form-container">
          <div className="input-group">
            <input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="First Name"
              className="qr-input"
            />
            {touched.firstName && localError.firstName && (
              <div style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 2 }}>{localError.firstName}</div>
            )}
            <input
              type="text"
              value={formData.middleName || ''}
              onChange={(e) => onInputChange('middleName', e.target.value)}
              placeholder="Middle Name (optional)"
              className="qr-input"
            />
            <input
              type="text"
              value={formData.surname || ''}
              onChange={(e) => onInputChange('surname', e.target.value)}
              placeholder="Surname"
              className="qr-input"
            />
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => onInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="+91 Contact Number"
              className="qr-input"
            />
            {touched.phone && localError.phone && (
              <div style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 2 }}>{localError.phone}</div>
            )}
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="Email ID"
              className="qr-input"
            />
          </div>
          <button onClick={onGenerate} className="generate-btn" disabled={!validateForm(qrType, formData)}>
            Generate QR
          </button>
        </div>
      );
    default:
      return null;
  }
};

export default QRForm; 