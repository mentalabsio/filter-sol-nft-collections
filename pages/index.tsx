/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label, Flex, Input, Slider } from "@theme-ui/components"
import { useCallback, useEffect, useMemo, useState } from "react"
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

const LAMPORTS_PER_SOL = 1000000000

const INITIAL_FILTERS = {
  floor: [null, null],
  volume: [null, null],
  volumetotal: [null, null],
}
export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] =
    useState<PopularCollectionWithInfo[]>(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)

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

  const reduced = useMemo(() => {
    if (collections) {
      const filtered = collections.filter((collection) => {
        if (filters.floor[0]) {
          if (collection.fp / LAMPORTS_PER_SOL < filters.floor[0]) {
            return false
          }
        }

        if (filters.floor[1]) {
          if (collection.fp / LAMPORTS_PER_SOL >= filters.floor[1]) {
            return false
          }
        }

        if (filters.volume[0]) {
          if (collection.vol < filters.volume[0]) {
            return false
          }
        }

        if (filters.volume[1]) {
          if (collection.vol >= filters.volume[1]) {
            return false
          }
        }

        if (filters.volumetotal[0]) {
          if (collection.totalVol < filters.volumetotal[0]) {
            return false
          }
        }

        if (filters.volumetotal[1]) {
          if (collection.totalVol >= filters.volumetotal[1]) {
            return false
          }
        }

        return true
      })

      const ordered = filtered.sort((a, b) => {
        return a.vol <= b.vol ? 1 : -1
      })
      return ordered
    }
  }, [filters, collections])

  return (
    <>
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "96rem",
          margin: "0 auto",
          marginTop: "4rem",
          gap: "3.2rem",
        }}
      >
        <Heading mb=".8rem" variant="heading1">
          Filter Solana NFT Collections
        </Heading>

        <Flex
          sx={{
            gap: "3.2rem",
            alignSelf: "stretch",
          }}
        >
          <Flex
            sx={{
              flexDirection: "column",
              padding: "0 1.6rem",
            }}
          >
            <Heading variant="heading2">Filters</Heading>
            <Text mb="1.6rem">
              Selected filters:{" "}
              {filters &&
                `
              ${filters.floor[0]} - ${filters.floor[1]}
            `}
            </Text>

            <Flex
              sx={{
                flexDirection: "column",
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
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".8rem",
                  }}
                >
                  <Input
                    onBlur={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          floor: [Number(e.target.value), prev.floor[1]],
                        }
                      })
                    }}
                    placeholder="Min"
                  />
                  <Input
                    onBlur={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          floor: [prev.floor[0], Number(e.target.value)],
                        }
                      })
                    }}
                    placeholder="Max"
                  />
                </Flex>
              </Label>
              <Label
                sx={{
                  flexDirection: "column",
                  gap: ".8rem",
                }}
              >
                Volume 7d
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".8rem",
                  }}
                >
                  <Input
                    onBlur={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          volume: [Number(e.target.value), prev.volume[1]],
                        }
                      })
                    }}
                    placeholder="Min"
                  />
                  <Input
                    onBlur={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          volume: [prev.volume[0], Number(e.target.value)],
                        }
                      })
                    }}
                    placeholder="Max"
                  />
                </Flex>
              </Label>

              <Label
                sx={{
                  flexDirection: "column",
                  gap: ".8rem",
                }}
              >
                Volume Total
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".8rem",
                  }}
                >
                  <Input
                    onBlur={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          volumetotal: [
                            Number(e.target.value),
                            prev.volumetotal[1],
                          ],
                        }
                      })
                    }}
                    placeholder="Min"
                  />
                  <Input
                    onBlur={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          volumetotal: [
                            prev.volumetotal[0],
                            Number(e.target.value),
                          ],
                        }
                      })
                    }}
                    placeholder="Max"
                  />
                </Flex>
              </Label>
            </Flex>
          </Flex>
          <Flex
            sx={{
              flexDirection: "column",
              flex: "1 auto",
              alignSelf: "stretch",
            }}
          >
            <Heading variant="heading2">Popular collections</Heading>
            {reduced && (
              <Text mb="1.6rem">
                Found {reduced && reduced.length} collections:{" "}
              </Text>
            )}

            <Flex
              sx={{
                flexDirection: "column",
                maxHeight: "80vh",
                overflowY: "scroll",
              }}
            >
              {reduced &&
                reduced.map((collection) => {
                  const {
                    collectionSymbol,
                    name,
                    tokenCount,
                    image,
                    info,
                    vol,
                    totalVol,
                  } = collection

                  return (
                    <Flex
                      sx={{
                        alignItems: "center",
                        alignSelf: "stretch",
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
                      <Flex
                        sx={{
                          flexDirection: "column",
                        }}
                      >
                        <Text>{name}</Text>
                        <Text>{tokenCount}</Text>
                      </Flex>

                      <Flex
                        sx={{
                          flexDirection: "column",
                        }}
                      >
                        <Text>{vol.toFixed(0).toLocaleLowerCase()}</Text>
                        <Text>{totalVol.toFixed(0).toLocaleLowerCase()}</Text>
                      </Flex>
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
                      {info?.categories &&
                        info.categories.map(
                          (category) =>
                            category && (
                              <Text
                                sx={{
                                  backgroundColor: "primary",
                                  border: "1px solid",
                                  borderRadius: ".4rem",
                                  color: "background",
                                  padding: ".2rem .4rem",
                                }}
                              >
                                {category}
                              </Text>
                            )
                        )}
                    </Flex>
                  )
                })}
            </Flex>
            {isLoading && (
              <LoadingIcon
                sx={{
                  margin: "3.2rem auto",
                }}
              />
            )}
          </Flex>
        </Flex>
      </main>
    </>
  )
}
