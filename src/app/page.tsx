import dynamic from 'next/dynamic';

// Nuclear Override: Force the entire application to ONLY render on the client, 
// bypassing server HTML completely to eliminate any possible hydration mismatches.
const MainApp = dynamic(() => import('@/components/MainApp'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0a0f1d]" /> 
});

export default function Page() {
  return <MainApp />;
}
