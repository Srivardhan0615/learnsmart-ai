import React from 'react';

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]" />
      
      {/* Aurora Blobs */}
      <div 
        className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] aurora-blob"
        style={{ background: '#7c3aed' }}
      />
      <div 
        className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px] aurora-blob-2"
        style={{ background: '#2563eb' }}
      />
      <div 
        className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full opacity-20 blur-[120px] aurora-blob-3"
        style={{ background: '#10b981' }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};

export default AuroraBackground;
