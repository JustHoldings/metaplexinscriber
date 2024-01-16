'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ReactNode, useMemo, useState } from 'react';
import { Notifications } from '@mantine/notifications';
import { AppShell } from '@mantine/core';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header/Header';
import { UmiProvider } from './UmiProvider';
import { EnvProvider } from './EnvProvider';
import { Env } from './useEnv';
import { InscriptionCounterProvider } from './InscriptionCounterProvider';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(new QueryClient());
  const [env, setEnv] = useState<Env>('mainnet-beta');
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const endpoint = useMemo(() => {
    switch (env) {
      case 'mainnet-beta':
        return "https://mainnet.helius-rpc.com/?api-key=7d3ad7fd-eac8-4164-8ed3-dd9aa53caf69";
      case 'devnet':
      default:
        return "https://devnet.helius-rpc.com/?api-key=7d3ad7fd-eac8-4164-8ed3-dd9aa53caf69";
    }
  }, [env]);

  return (
    <EnvProvider env={env!}>
      <ConnectionProvider endpoint={endpoint!}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <UmiProvider>
              <QueryClientProvider client={client}>
                <ReactQueryStreamedHydration>
                  <InscriptionCounterProvider>
                    <Notifications />
                    <AppShell
                      header={{ height: 80 }}
                      style={{
                        backgroundColor: '#1a1a1a',
                      }}
                    >
                      <AppShell.Header>
                        <Header env={env} setEnv={setEnv} />
                      </AppShell.Header>
                      <AppShell.Main>
                        {children}
                      </AppShell.Main>
                    </AppShell>
                  </InscriptionCounterProvider>
                </ReactQueryStreamedHydration>
              </QueryClientProvider>
            </UmiProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </EnvProvider>
  );
}
