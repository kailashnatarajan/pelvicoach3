import {
  CheckCircle2,
  Download,
  ExternalLink,
  HelpCircle,
  Info,
  Layers,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallAccepted?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallAccepted,
}) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'methods'>('instant');
  const [isPrompted, setIsPrompted] = useState(false);

  if (!isOpen) return null;

  const handleInstantInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsPrompted(true);
          if (onInstallAccepted) onInstallAccepted();
        }
      } catch (err) {
        console.error('PWA install error:', err);
      }
    } else {
      // Manual browser guidance
      alert(
        "📱 To install PelviCoach on your device right now:\n\n" +
        "• Android (Chrome): Tap the 3 dots (⋮) in the top-right corner, then tap 'Install app' or 'Add to Home screen'.\n\n" +
        "• iPhone/iPad (Safari): Tap the Share button (square with arrow) at the bottom, then tap 'Add to Home Screen' (+).\n\n" +
        "• Windows/Mac (Chrome/Edge): Click the Install icon (computer with down arrow) on the right side of the address bar!"
      );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '2px solid #E2E8F0',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
            color: '#FFFFFF',
            padding: '22px 24px',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '20px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F766E',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Smartphone size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                Get PelviCoach Mobile App
              </h2>
              <p style={{ fontSize: '13px', margin: 0, opacity: 0.9, fontWeight: 600 }}>
                Install directly to your phone screen or download standalone APK
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs inside Modal */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            <button
              onClick={() => setActiveTab('instant')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                background: activeTab === 'instant' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === 'instant' ? '#0F766E' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📲 1-Click Install (PWA)
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                background: activeTab === 'apk' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === 'apk' ? '#0F766E' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📥 Direct APK File
            </button>
            <button
              onClick={() => setActiveTab('methods')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                background: activeTab === 'methods' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === 'methods' ? '#0F766E' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ⚡ APK Without Expo Go
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* TAB 1: 1-CLICK INSTANT PWA INSTALL */}
          {activeTab === 'instant' && (
            <div>
              <div
                style={{
                  background: '#F0FDFA',
                  border: '1.5px solid #99F6E4',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <Sparkles size={22} color="#0D9488" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F766E', marginBottom: '4px' }}>
                    Web App Domain Install (Progressive Web App)
                  </div>
                  <p style={{ fontSize: '13px', color: '#115E59', margin: 0, lineHeight: 1.4 }}>
                    Install PelviCoach right from your browser URL. It adds an icon to your phone’s Home Screen,
                    launches in standalone full-screen mode, works offline, and requires <b>zero app store downloads</b>!
                  </p>
                </div>
              </div>

              {/* Big Install Button */}
              <button
                onClick={handleInstantInstall}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  fontSize: '17px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(13, 148, 136, 0.35)',
                  marginBottom: '20px',
                }}
              >
                <Smartphone size={22} />
                <span>{deferredPrompt ? '📲 Tap Here to Install App' : '📲 Install App on This Device'}</span>
              </button>

              {/* Step by step manual guidance for phones */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                  Or install manually from your browser:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0F172A', marginBottom: '4px' }}>
                      🤖 Android (Chrome)
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                      Tap the <b>3 dots menu (⋮)</b> in Chrome, then tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.
                    </p>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0F172A', marginBottom: '4px' }}>
                      🍎 iPhone / iPad (Safari)
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                      Tap the <b>Share icon (⎋)</b> at the bottom, then scroll and tap <b>"Add to Home Screen" (+)</b>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT APK FILE DOWNLOAD */}
          {activeTab === 'apk' && (
            <div>
              <div
                style={{
                  background: '#FEF3C7',
                  border: '1.5px solid #FCD34D',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <Download size={22} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#92400E', marginBottom: '4px' }}>
                    Standalone Android APK File
                  </div>
                  <p style={{ fontSize: '13px', color: '#78350F', margin: 0, lineHeight: 1.4 }}>
                    Want a traditional `.apk` file that you can install on any Android phone or share via WhatsApp/Drive?
                    You can host it directly on your website or GitHub!
                  </p>
                </div>
              </div>

              {/* Download APK Button */}
              <a
                href="./PelviCoach.apk"
                download="PelviCoach.apk"
                style={{
                  width: '100%',
                  background: '#1E293B',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  fontSize: '17px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 16px rgba(30, 41, 59, 0.25)',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                }}
              >
                <Download size={22} color="#38BDF8" />
                <span>📥 Download PelviCoach.apk (Direct)</span>
              </a>

              {/* Instructions to install APK on Android */}
              <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  📋 How to install on your Android phone:
                </div>
                <ol style={{ fontSize: '12px', color: '#475569', margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Tap <b>Download PelviCoach.apk</b> above.</li>
                  <li>When downloaded, tap the notification or open your phone's <b>Downloads</b> folder.</li>
                  <li>Tap <b>Install</b> (if prompted, tap <i>Settings → Allow from this source</i>).</li>
                  <li>Open <b>PelviCoach</b> and start training!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: WAYS TO CREATE APK WITHOUT EXPO GO */}
          {activeTab === 'methods' && (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                💡 4 Ways to Create APK Files Without Expo Go:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Method 1 */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F766E' }}>
                      1. PWABuilder (Fastest — 30 Seconds!)
                    </span>
                    <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>
                      Recommended
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    Go to <b>pwabuilder.com</b> (free tool by Microsoft/Google). Paste your GitHub Pages website link, click <b>"Generate APK"</b>. In 30 seconds it gives you a signed Android APK ready to install!
                  </p>
                </div>

                {/* Method 2 */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#4F46E5', marginBottom: '4px' }}>
                    2. EAS Cloud Build with APK Profile
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    Running <code>eas build -p android --profile preview</code> produces a real <b>standalone native APK binary</b> that installs directly on Android without needing Expo Go.
                  </p>
                </div>

                {/* Method 3 */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#D97706', marginBottom: '4px' }}>
                    3. Local Gradle Native Build (No Cloud, Free)
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    In your project terminal: <code>cd android && ./gradlew assembleRelease</code>. This compiles the APK right on your PC in <code>android/app/build/outputs/apk/release/app-release.apk</code>.
                  </p>
                </div>

                {/* Method 4 */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', marginBottom: '4px' }}>
                    4. Bubblewrap CLI (Google Trusted Web Activity)
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    Google's official CLI: <code>npx @bubblewrap/cli init --manifest=https://your-site/manifest.json</code>. Generates a production Play Store APK in 1 minute.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Close button */}
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 800,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
