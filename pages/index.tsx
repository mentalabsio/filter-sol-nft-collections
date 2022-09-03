/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label, Flex, Input, Slider } from "@theme-ui/components"
import { useCallback, useEffect, useState } from "react"
import { LoadingIcon } from "@/components/icons/LoadingIcon"

import infos from "public/infos_reduced.json"
import { DiscordIcon, TwitterIcon } from "@/components/icons"

/** Magic Eden Popular Collections API type */
type PopularCollection = {
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
}

/** Magic Eden Collection Info API type */
type CollectionInfoApiResponse = {
  blockchain: string
  candyMachineIds: string[]
  categories: string[]
  createdAt: string
  description: string
  discord: string
  enabledAttributesFilters: true
  hasAllItems: true
  image: string
  isAutolist: false
  name: string
  rarity: { showMoonrank: false; showHowrare: true; showMagicEden: true }
  symbol: string
  totalItems: 0
  twitter: string
  updatedAt: string
  watchlistCount: 516
  website: string
}

type PopularCollectionWithInfo = PopularCollection & {
  info: CollectionInfoApiResponse
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState<
    PopularCollectionWithInfo[] | PopularCollection[]
  >(null)

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true)
      const raw = await fetch(
        "https://stats-mainnet.magiceden.io/collection_stats/popular_collections/sol?limit=1000&window=30d"
      )

      const popularCollections: PopularCollection[] = await raw.json()

      const popularCollectionsWithInfo = popularCollections.map(
        (collection) => {
          const { collectionSymbol } = collection
          const info = infos[collectionSymbol]

          const newObject = Object.assign(collection, { info })
          return newObject
        }
      )

      setCollections(popularCollectionsWithInfo)
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
          maxWidth: "128rem",
          margin: "0 auto",
          marginTop: "4rem",
          gap: "3.2rem",
        }}
      >
        <Heading mb=".8rem" variant="heading1">
          Filter Solana NFT Collections
        </Heading>

        {isLoading && <LoadingIcon />}

        <Flex
          sx={{
            gap: "3.2rem",
          }}
        >
          <Flex
            sx={{
              flexDirection: "column",
              flex: "1 16rem",
              padding: "0 1.6rem",
              gap: "1.6rem",
            }}
          >
            <Label
              sx={{
                flexDirection: "column",
                gap: ".8rem",
              }}
            >
              Floor Price
              <Slider
                onChange={(e) => {
                  console.log(e.currentTarget.value)
                }}
              />
              <Flex
                sx={{
                  alignItems: "center",
                  gap: ".8rem",
                }}
              >
                <Input placeholder="From" />
                <Input placeholder="To" />
              </Flex>
            </Label>
            <Label
              sx={{
                flexDirection: "column",
                gap: ".8rem",
              }}
            >
              Volume 7d
              <Slider
                onChange={(e) => {
                  console.log(e.currentTarget.value)
                }}
              />
              <Flex
                sx={{
                  alignItems: "center",
                  gap: ".8rem",
                }}
              >
                <Input placeholder="From" />
                <Input placeholder="To" />
              </Flex>
            </Label>

            <Label
              sx={{
                flexDirection: "column",
                gap: ".8rem",
              }}
            >
              Volume Total
              <Slider
                onChange={(e) => {
                  console.log(e.currentTarget.value)
                }}
              />
              <Flex
                sx={{
                  alignItems: "center",
                  gap: ".8rem",
                }}
              >
                <Input placeholder="From" />
                <Input placeholder="To" />
              </Flex>
            </Label>
          </Flex>
          <Flex
            sx={{
              flexDirection: "column",
              flex: "1 auto",
            }}
          >
            <Heading variant="heading2">Popular collections</Heading>
            <Text>Found {collections && collections.length} collections: </Text>

            {collections &&
              collections.map((collection) => {
                const { collectionSymbol, name, tokenCount, image, info } =
                  collection

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
                    {info?.discord && (
                      <Text>
                        <a href={info?.discord}>
                          {" "}
                          <DiscordIcon />
                        </a>
                      </Text>
                    )}
                    {info?.twitter && (
                      <Text>
                        <a href={info?.twitter}>
                          {" "}
                          <TwitterIcon />
                        </a>
                      </Text>
                    )}
                  </Flex>
                )
              })}
          </Flex>
        </Flex>
      </main>
    </>
  )
}
