import React from 'react';
import { AppLayout } from '../../components/ui-layout';
import { SearchConfigForm } from '../../components/ui-search-config';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConfigureSearch() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-400 hover:text-white">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        <SearchConfigForm />
      </div>
    </AppLayout>
  );
}