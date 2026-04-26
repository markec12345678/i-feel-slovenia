import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3'
  };

  return (
    <motion.article
      className={`relative group bg-surface/50 border border-white/10 rounded-2xl p-6 hover:bg-surface/80 hover:border-accent/30 transition-all duration-300 ${sizeClasses[size]} ${className}`}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
          <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-secondary text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </motion.article>
  );
};
