import React from 'react';
import { AppLayout } from '../../components/ui-layout';
import { SearchConfigForm } from '../../components/ui-search-config';

export default function ConfigureSearch() {
  return (
    <AppLayout>
      <SearchConfigForm />
    </AppLayout>
  );
}