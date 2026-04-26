import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface WaitlistFormProps {
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({
  placeholder = "tvoj@email.com",
  buttonText = "Pridruži se",
  successMessage = "✅ Hvala! Uspešno ste se vpisali na seznam."
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Prosim vnesite veljaven e-poštni naslov.');
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    // Simulacija API klica (zamenjaj z dejanskim backendom)
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail('');
  };

  if (isSuccess) {
    return (
      <div className="p-4 rounded-lg bg-surface border border-accent/30 text-center" role="status" aria-live="polite">
        <p className="text-primary font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto" noValidate>
      <Input
        label="E-poštni naslov"
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required
        aria-required="true"
      />
      <Button type="submit" isLoading={isSubmitting} className="sm:self-end">
        {buttonText}
      </Button>
    </form>
  );
};
