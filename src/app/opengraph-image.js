/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const alt = 'Mohammed Ferwana, Backend Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const bgPath = path.join(process.cwd(), 'public/images/hero/gaza-port-og.jpg');
  const portraitPath = path.join(process.cwd(), 'public/images/portrait.jpg');

  const bgBase64 = fs.readFileSync(bgPath).toString('base64');
  const portraitBase64 = fs.readFileSync(portraitPath).toString('base64');

  const bgDataUrl = `data:image/jpeg;base64,${bgBase64}`;
  const portraitDataUrl = `data:image/jpeg;base64,${portraitBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0B0A14',
        }}
      >
        {/* Background photo */}
        <img
          src={bgDataUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* 70% Dusk Dark Overlay (var(--hz-bg) = #0B0A14) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(11, 10, 20, 0.70)',
          }}
        />

        {/* Content layout */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 80px',
            gap: '56px',
          }}
        >
          {/* Left: Square Portrait (160px, rounded 24px, 2px violet border) */}
          <img
            src={portraitDataUrl}
            alt="Mohammed Ferwana"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '24px',
              border: '2px solid #A78BFA',
              objectFit: 'cover',
            }}
          />

          {/* Right: Typography */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Mohammed Ferwana
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#A78BFA',
                marginTop: '10px',
              }}
            >
              Backend Engineer
            </div>
            <div
              style={{
                fontSize: '28px',
                color: '#FFFFFF',
                marginTop: '12px',
              }}
            >
              Node.js · Express · MongoDB
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#A9A3BD',
                marginTop: '14px',
              }}
            >
              Gaza, Palestine · Open to remote roles
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
