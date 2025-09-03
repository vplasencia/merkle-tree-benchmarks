import { hash5, IncrementalQuinTree, hash2 } from "@maci-protocol/crypto"
import { LeanIMT } from "@zk-kit/lean-imt"

const depth = 6
const size = 10
const quinaryMerkleTree = new IncrementalQuinTree(depth, 0n, 5, hash5)
Array.from({ length: size }, (_, i) => quinaryMerkleTree.insert(BigInt(i + 1)))

const leanIMT = new LeanIMT((a, b) => hash2([a, b]))
leanIMT.insertMany(Array.from({ length: size }, (_, i) => BigInt(i + 1)))
console.log(leanIMT.depth)
