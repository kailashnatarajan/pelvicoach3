import {
  Download,
  Heart,
  Lock,
  LogIn,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  User,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { InstallAppModal } from '../components/InstallAppModal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthView: React.FC = () => {
  const { signIn, signUp, switchDemoRole, targetPortal, setTargetPortal } = useAuth();

  // Active portal tab: 'patient' or 'clinician'
  const [activePortal, setActivePortal] = useState<UserRole>(targetPortal || 'patient');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState(activePortal === 'patient' ? 'Lakshmi Devi' : 'Dr. Sarah Jenkins');
  const [email, setEmail] = useState(activePortal === 'patient' ? 'lakshmi@example.com' : 'dr.jenkins@clinic.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Keep in sync with targetPortal from context
  React.useEffect(() => {
    if (targetPortal) {
      setActivePortal(targetPortal);
      if (targetPortal === 'patient') {
        setEmail('lakshmi@example.com');
        setName('Lakshmi Devi');
      } else {
        setEmail('dr.jenkins@clinic.com');
        setName('Dr. Sarah Jenkins');
      }
    }
  }, [targetPortal]);

  // Switch tab and set appropriate default credentials
  const handleTabSwitch = (tab: UserRole) => {
    setActivePortal(tab);
    setTargetPortal(tab);
    setErrorMsg('');
    if (tab === 'patient') {
      setEmail('lakshmi@example.com');
      setName('Lakshmi Devi');
    } else {
      setEmail('dr.jenkins@clinic.com');
      setName('Dr. Sarah Jenkins');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      const res = await signUp(name, email, password, activePortal);
      if (res.error) setErrorMsg(res.error);
    } else {
      const res = await signIn(email, password);
      if (res.error) setErrorMsg(res.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '36px auto', padding: '0 20px' }}>
      {/* Branding Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '40px',
            background: activePortal === 'patient' ? '#CCFBF1' : '#EEF2FF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activePortal === 'patient' ? '#0F766E' : '#4F46E5',
            marginBottom: '14px',
            transition: 'all 0.2s ease',
          }}
        >
          {activePortal === 'patient' ? <Heart size={44} /> : <Stethoscope size={44} />}
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
          PelviCoach
        </h1>
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#0F766E', marginTop: '4px' }}>
          Adaptive Pelvic Floor Biofeedback
        </p>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Catches compensation. Ignores bad signals. No electrical stimulation.
        </p>
      </div>

      {/* MOBILE APP PWA & APK CALLOUT */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '14px 18px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '18px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F766E',
              flexShrink: 0,
            }}
          >
            <Smartphone size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900 }}>PelviCoach Mobile App</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Direct domain install (PWA) & standalone APK
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowInstallModal(true)}
          style={{
            background: '#FFFFFF',
            color: '#0F766E',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Smartphone size={15} />
          <span>Install / APK</span>
        </button>
      </div>

      {/* TWO SEPARATE PORTAL TABS (PATIENT LOGIN vs CLINICIAN LOGIN) */}
      <div
        role="tablist"
        aria-label="Login Portals"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: '#E2E8F0',
          padding: '6px',
          borderRadius: '16px',
          marginBottom: '20px',
        }}
      >
        <button
          role="tab"
          type="button"
          aria-selected={activePortal === 'patient'}
          onClick={() => handleTabSwitch('patient')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: activePortal === 'patient' ? '#FFFFFF' : 'transparent',
            color: activePortal === 'patient' ? '#0F766E' : '#475569',
            fontWeight: 900,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: activePortal === 'patient' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <User size={20} />
          <span>Patient Portal</span>
        </button>

        <button
          role="tab"
          type="button"
          aria-selected={activePortal === 'clinician'}
          onClick={() => handleTabSwitch('clinician')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: activePortal === 'clinician' ? '#FFFFFF' : 'transparent',
            color: activePortal === 'clinician' ? '#4F46E5' : '#475569',
            fontWeight: 900,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: activePortal === 'clinician' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Stethoscope size={20} />
          <span>Clinician Portal</span>
        </button>
      </div>

      {/* Main Form Card */}
      <div className="card" style={{ padding: '30px', border: '1.5px solid #CBD5E1' }}>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: activePortal === 'patient' ? '#CCFBF1' : '#EEF2FF',
                color: activePortal === 'patient' ? '#0F766E' : '#4F46E5',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              {activePortal === 'patient' ? 'Patient Access' : 'Practitioner Access'}
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, marginTop: '6px', color: '#0F172A' }}>
            {isSignUp
              ? `Create ${activePortal === 'patient' ? 'Patient' : 'Clinician'} Account`
              : `${activePortal === 'patient' ? 'Patient' : 'Clinician'} Login`}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            {activePortal === 'patient'
              ? 'Access biofeedback training, signal simulator, and personal workout history.'
              : 'Access multi-sensor decision verification logs, naive amplitude comparisons, and patient prescriptions.'}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#FFE4E6',
              border: '1.5px solid #FDA4AF',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 800 }}>
                Full Name
              </label>
              <input
                className="form-input"
                type="text"
                placeholder={activePortal === 'patient' ? 'e.g. Lakshmi Devi' : 'e.g. Dr. Sarah Jenkins'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: 800 }}>
              Email Address
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: 800 }}>
              Password
            </label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              background: activePortal === 'patient' ? '#0D9488' : '#4F46E5',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 900,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading ? 'Authenticating...' : isSignUp ? 'CREATE ACCOUNT' : `LOG IN AS ${activePortal.toUpperCase()}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: activePortal === 'patient' ? '#0F766E' : '#4F46E5',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isSignUp ? 'Already registered? Login here' : "Need an account? Register here"}
          </button>
        </div>
      </div>

      {/* 1-CLICK INSTANT DEMO SWITCHER */}
      <div
        style={{
          marginTop: '20px',
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '16px',
          padding: '16px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', marginBottom: '10px' }}>
          ⚡ 1-CLICK INSTANT DEMO LOGIN (FOR EVALUATION):
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => switchDemoRole('patient')}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '2px solid #0D9488',
              color: '#0F766E',
              borderRadius: '12px',
              padding: '11px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <User size={16} />
            Patient Demo
          </button>

          <button
            type="button"
            onClick={() => switchDemoRole('clinician')}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '2px solid #4F46E5',
              color: '#4F46E5',
              borderRadius: '12px',
              padding: '11px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Stethoscope size={16} />
            Clinician Demo
          </button>
        </div>
      </div>

      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
};
