import React from 'react';
import { AppLayout } from '../../components/ui-layout';
import { AdvancedFilters } from '../../components/ui-advanced-filters';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchFilters() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-400 hover:text-white">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to EU Textile Regulations</span>
          </Link>
        </div>
        
        <AdvancedFilters />
      </div>
    </AppLayout>
  );
}