/** Fetch Popular Collections and Collection Info data from ME API */
const raw = await fetch(
  "https://stats-mainnet.magiceden.io/collection_stats/popular_collections/sol?limit=1000&window=30d"
)

const popularCollections = await raw.json()

const fetched = []
for (let index in popularCollections) {
  try {
    /** We have to wait, otherwise it gives 429 - Too Many Requests */
    await sleep(200)

    const { collectionSymbol } = popularCollections[index]
    const info = await (
      await fetch(
        `https://api-mainnet.magiceden.io/collections/${collectionSymbol}?edge_cache=true`,
        {
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        }
      )
    ).json()

    fetched.push(info)
  } catch (e) {
    console.log(fetched)
  } finally {
    console.log(fetched)
  }
}

/** Improve JSON */
fetched.reduce((prev, curr) => {
  prev[curr.symbol] = curr

  return prev
}, {})
