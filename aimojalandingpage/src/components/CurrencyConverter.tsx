import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { DollarSign, RefreshCw, Info } from 'lucide-react';

const exchangeRates: { [key: string]: number } = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  CHF: 0.95,
  HRK: 7.53,
  RSD: 117.5,
  BAM: 1.96,
  CZK: 25.2,
  PLN: 4.32,
  HUF: 385.5
};

const currencies = [
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷' },
  { code: 'RSD', name: 'Serbian Dinar', flag: '🇷🇸' },
  { code: 'BAM', name: 'Bosnian Mark', flag: '🇧🇦' },
  { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
  { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
  { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺' }
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [ref, inView] = useInView({ threshold: 0.1 });

  const toRate = exchangeRates[toCurrency] ?? 1;
  const fromRate = exchangeRates[fromCurrency] ?? 1;
  const convertedAmount = (parseFloat(amount) || 0) * (toRate / fromRate);
  const rate = toRate / fromRate;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <section id="currency" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Pretvornik valut
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Pretvorite cene v vašo domačo valuto
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            {/* Amount input */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-gray-300 mb-2 font-semibold">
                Znesek
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
            </div>

            {/* Currency selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="from-currency" className="block text-gray-300 mb-2 font-semibold">
                  Iz
                </label>
                <select
                  id="from-currency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-400"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-center">
                <button
                  onClick={swapCurrencies}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  <RefreshCw size={24} className="text-gray-300" />
                </button>
              </div>

              <div>
                <label htmlFor="to-currency" className="block text-gray-300 mb-2 font-semibold">
                  V
                </label>
                <select
                  id="to-currency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-400"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 mb-6 border border-green-500/30">
              <p className="text-gray-400 text-sm mb-2">Pretvorjen znesek</p>
              <p className="text-4xl font-bold text-white mb-2">
                {convertedAmount.toFixed(2)} {toCurrency}
              </p>
              <p className="text-gray-400 text-sm">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </p>
            </div>

            {/* Info */}
            <div className="bg-gray-900/50 rounded-lg p-4 flex items-start gap-3">
              <Info size={20} className="text-green-400 mt-0.5" />
              <p className="text-gray-400 text-sm">
                Menjalni tečaji so približni in se lahko razlikujejo. Za najnatančnejše tečaje preverite pri svoji banki ali finančni ustanovi.
              </p>
            </div>
          </div>

          {/* Popular conversions */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { from: 'EUR', to: 'USD', label: 'EUR v USD' },
              { from: 'EUR', to: 'GBP', label: 'EUR v GBP' },
              { from: 'EUR', to: 'CHF', label: 'EUR v CHF' },
              { from: 'EUR', to: 'HRK', label: 'EUR v HRK' }
            ].map((conv) => (
              <button
                key={conv.label}
                onClick={() => {
                  setFromCurrency(conv.from);
                  setToCurrency(conv.to);
                }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700 hover:border-green-400 transition-colors text-center"
              >
                <p className="text-white font-semibold text-sm">{conv.label}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {(exchangeRates[conv.to] ?? 1) / (exchangeRates[conv.from] ?? 1)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
