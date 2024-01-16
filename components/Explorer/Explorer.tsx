import { DasApiAsset } from '@metaplex-foundation/digital-asset-standard-api';
import { Center, Image, Loader, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';

import { CodeHighlightTabs } from '@mantine/code-highlight';

import { useNftInscription, useNftJson } from '../Inscribe/hooks';
import { ExplorerStat } from './ExplorerStat';

export function Explorer({ nft }: { nft: DasApiAsset }) {
  const inscriptionInfo = useNftInscription(nft, { fetchImage: true, fetchMetadata: true, fetchJson: true });
  const jsonInfo = useNftJson(nft);

  return (
    <SimpleGrid cols={2} mt="xl" spacing="lg" pb="xl">
      <Paper p="xl" radius="md">
        <Stack>
          <Text fz="md" tt="uppercase" fw={700} c="dimmed">NFT Details</Text>
          {jsonInfo.isPending ? <Center h="20vh"><Loader /></Center> :
            <>
              <Title>{jsonInfo.data.name}</Title>

              <Image src={jsonInfo.data.image} maw={320} />
              {jsonInfo.data.description && <ExplorerStat
                label="Description"
                value={jsonInfo.data.description}
              />}
              <ExplorerStat
                label="Mint"
                value={nft.id}
                copyable
              />

              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">JSON Metadata</Text>
              <CodeHighlightTabs
                withExpandButton
                expandCodeLabel="Show full JSON"
                collapseCodeLabel="Show less"
                defaultExpanded={false}
                mb="lg"
                code={[{
                  fileName: 'metadata.json',
                  language: 'json',
                  code: JSON.stringify(jsonInfo.data, null, 2),
                }]}
              />
            </>}

        </Stack>
      </Paper>
      <Paper p="xl" radius="md">
        <Stack>
          <Text fz="md" tt="uppercase" fw={700} c="dimmed">Inscription Details</Text>
          {inscriptionInfo.isPending ? <Center h="20vh"><Loader /></Center> :
            inscriptionInfo.error || !inscriptionInfo?.data.metadataPdaExists ? <Center h="20vh"><Text>NFT is not inscribed</Text></Center>
              :
              <>
                <Title>
                  #{inscriptionInfo.data?.metadata?.inscriptionRank.toString()!}
                </Title>
                {inscriptionInfo.data?.image &&
                  <>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">Inscribed Image</Text>
                    <Image src={URL.createObjectURL(inscriptionInfo.data?.image)} maw={320} />

                  </>}
                <ExplorerStat
                  label="Inscription address (JSON)"
                  value={inscriptionInfo.data?.inscriptionPda[0]!}
                  copyable
                />
                <ExplorerStat
                  label="Inscription metadata address"
                  value={inscriptionInfo.data?.inscriptionMetadataAccount[0]!}
                  copyable
                />
                {inscriptionInfo.data?.imagePdaExists && <ExplorerStat
                  label="Inscription image address"
                  value={inscriptionInfo.data?.imagePda[0]!}
                  copyable
                />}
                {inscriptionInfo.data?.metadata &&
                  <>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">Inscribed JSON</Text>
                    <CodeHighlightTabs
                      withExpandButton
                      expandCodeLabel="Show full JSON"
                      collapseCodeLabel="Show less"
                      defaultExpanded={false}
                      mb="lg"
                      code={[{
                        fileName: 'inscribed.json',
                        language: 'json',
                        code: JSON.stringify(inscriptionInfo.data?.json, null, 2),
                      }]}
                    />
                  </>}
              </>
          }
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}
