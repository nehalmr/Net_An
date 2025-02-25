import React from 'react';
import { Wifi, Shield, Settings } from 'lucide-react';

interface Network {
  ssid: string;
  security: string;
  strength: number;
}

interface ConnectionScreenProps {
  networks: Network[];
  onConnect: (network: Network) => void;
}

export function ConnectionScreen({ networks, onConnect }: ConnectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Wifi className="h-6 w-6" />
          Available Networks
        </h2>
        
        <div className="space-y-4">
          {networks.map((network, index) => (
            <div
              key={index}
              className="bg-white/5 hover:bg-white/10 rounded-lg p-4 cursor-pointer transition-all"
              onClick={() => onConnect(network)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Wifi className="h-5 w-5 text-blue-400" />
                    {network.security && (
                      <Shield className="h-3 w-3 text-green-400 absolute -right-1 -bottom-1" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{network.ssid}</h3>
                    <p className="text-gray-400 text-sm">{network.security}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1 rounded-full ${
                          bar <= network.strength
                            ? 'bg-blue-400'
                            : 'bg-gray-600'
                        }`}
                        style={{ height: `${bar * 3 + 3}px` }}
                      />
                    ))}
                  </div>
                  <Settings className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}