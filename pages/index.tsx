/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label } from "@theme-ui/components"
import { useCallback, useEffect, useState } from "react"
import { LoadingIcon } from "@/components/icons/LoadingIcon"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState(null)

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true)
      const raw = await fetch(
        "https://stats-mainnet.magiceden.io/collection_stats/popular_collections/sol?limit=1000&window=7d"
      )

      const parsed = await raw.json()
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
        <Text>Found {collections && collections.length} collections </Text>
      </main>
    </>
  )
}
