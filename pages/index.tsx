/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label, Flex } from "@theme-ui/components"
import { useCallback, useEffect, useState } from "react"
import { LoadingIcon } from "@/components/icons/LoadingIcon"

type PopularCollectionsApiResponse = {
  collectionSymbol: string
  name: string
  image: string
  ownerCount: number
  tokenCount: number
  /** Total volume in SOL */
  totalVol: number
  /** Volume in SOL for the period */
  vol: number
  volDelta: number
  txns: number
  /** Floor Price in LAMPORT */
  fp: number
  rank: number
  updatedAt: number
}[]

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] =
    useState<PopularCollectionsApiResponse>(null)

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true)
      const raw = await fetch(
        "https://stats-mainnet.magiceden.io/collection_stats/popular_collections/sol?limit=1000&window=7d"
      )

      const parsed: PopularCollectionsApiResponse = await raw.json()
      setCollections(parsed)
      console.log(parsed)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return (
    <>
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "64rem",
          margin: "0 auto",
          marginTop: "4rem",
          gap: "3.2rem",
        }}
      >
        <Heading mb=".8rem" variant="heading1">
          Filter Solana NFT Collections
        </Heading>

        {isLoading && <LoadingIcon />}

        <Text
          sx={{
            flexDirection: "column",
          }}
        >
          <Heading variant="heading2">Popular collections</Heading>
          <Text>Found {collections && collections.length} collections: </Text>

          {collections &&
            collections.map(({ collectionSymbol, name, tokenCount, image }) => {
              return (
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: "1.6rem",
                    padding: ".8rem",
                    borderBottom: "1px solid",
                    borderColor: "primary",
                    borderRadius: ".4rem",
                  }}
                  key={collectionSymbol}
                >
                  <img
                    sx={{
                      maxWidth: "4rem",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/320x320"
                    }}
                    src={image}
                  />
                  <Text>{name}</Text>
                  <Text>{tokenCount}</Text>
                </Flex>
              )
            })}
        </Text>
      </main>
    </>
  )
}
