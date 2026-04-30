import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FileText, Plane, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface CountryInfo {
  country: string;
  flag: string;
  visaRequired: boolean;
  maxStay: string;
  notes: string[];
}

const countryInfo: CountryInfo[] = [
  {
    country: 'EU/EEA',
    flag: '🇪🇺',
    visaRequired: false,
    maxStay: 'Unlimited',
    notes: ['No visa required', 'Valid ID card or passport', 'Freedom of movement']
  },
  {
    country: 'USA',
    flag: '🇺🇸',
    visaRequired: false,
    maxStay: '90 days',
    notes: ['Visa-free under Schengen', 'Valid passport required', 'ETIAS coming in 2025']
  },
  {
    country: 'UK',
    flag: '🇬🇧',
    visaRequired: false,
    maxStay: '90 days',
    notes: ['Visa-free under Schengen', 'Valid passport required', 'ETIAS coming in 2025']
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    visaRequired: false,
    maxStay: '90 days',
    notes: ['Visa-free under Schengen', 'Valid passport required', 'ETIAS coming in 2025']
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    visaRequired: false,
    maxStay: '90 days',
    notes: ['Visa-free under Schengen', 'Valid passport required', 'ETIAS coming in 2025']
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    visaRequired: false,
    maxStay: '90 days',
    notes: ['Visa-free under Schengen', 'Valid passport required', 'ETIAS coming in 2025']
  },
  {
    country: 'China',
    flag: '🇨🇳',
    visaRequired: true,
    maxStay: '30-90 days',
    notes: ['Schengen visa required', 'Apply at Slovenian embassy', 'Processing time: 15 days']
  },
  {
    country: 'India',
    flag: '🇮🇳',
    visaRequired: true,
    maxStay: '30-90 days',
    notes: ['Schengen visa required', 'Apply at Slovenian embassy', 'Processing time: 15 days']
  },
  {
    country: 'Russia',
    flag: '🇷🇺',
    visaRequired: true,
    maxStay: '30-90 days',
    notes: ['Schengen visa required', 'Apply at Slovenian embassy', 'Processing time: 15 days']
  }
];

export default function VisaInfo() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section id="visa" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Visa & Entry Requirements
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Check if you need a visa to visit Slovenia
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Quick info */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FileText size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Passport Validity</h3>
                  <p className="text-gray-400 text-sm">Valid for at least 3 months beyond planned departure</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Plane size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Schengen Area</h3>
                  <p className="text-gray-400 text-sm">Slovenia is part of the Schengen Zone</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">ETIAS 2025</h3>
                  <p className="text-gray-400 text-sm">New travel authorization for visa-free visitors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Country grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {countryInfo.map((country) => (
              <button
                key={country.country}
                onClick={() => setSelectedCountry(country.country)}
                className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border transition-all duration-300 ${
                  selectedCountry === country.country
                    ? 'border-green-400 bg-green-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{country.flag}</div>
                <p className="text-white font-semibold text-sm">{country.country}</p>
                <div className="flex items-center gap-1 mt-2">
                  {country.visaRequired ? (
                    <AlertCircle size={14} className="text-red-400" />
                  ) : (
                    <CheckCircle size={14} className="text-green-400" />
                  )}
                  <span className={`text-xs ${country.visaRequired ? 'text-red-400' : 'text-green-400'}`}>
                    {country.visaRequired ? 'Visa Required' : 'Visa-Free'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected country details */}
          {selectedCountry && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              {(() => {
                const country = countryInfo.find(c => c.country === selectedCountry);
                if (!country) return null;
                return (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl">{country.flag}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{country.country}</h3>
                        <p className={`text-lg ${country.visaRequired ? 'text-red-400' : 'text-green-400'}`}>
                          {country.visaRequired ? 'Visa Required' : 'Visa-Free Entry'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Maximum Stay</h4>
                        <p className="text-gray-300">{country.maxStay}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Visa Status</h4>
                        <p className="text-gray-300">{country.visaRequired ? 'Schengen visa required' : 'No visa required'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Important Notes</h4>
                      <ul className="space-y-2">
                        {country.notes.map((note, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <Info size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* General requirements */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">General Entry Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Valid Passport</h4>
                    <p className="text-gray-400 text-sm">Must be valid for at least 3 months beyond your planned departure date</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Travel Insurance</h4>
                    <p className="text-gray-400 text-sm">Recommended but not required for short stays</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Proof of Funds</h4>
                    <p className="text-gray-400 text-sm">May be requested at border control</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Return Ticket</h4>
                    <p className="text-gray-400 text-sm">Proof of onward travel may be required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Accommodation</h4>
                    <p className="text-gray-400 text-sm">Hotel booking or invitation letter may be requested</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">ETIAS (2025)</h4>
                    <p className="text-gray-400 text-sm">New electronic authorization for visa-free travelers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
