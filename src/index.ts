import { Bench } from "tinybench"
import { hash5, IncrementalQuinTree, hash2, hash3 } from "@maci-protocol/crypto"
import { LeanIMT, type LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { IMerkleProof } from "@maci-protocol/crypto/build/ts/types"
import { ChildNodes, MerkleProof, SMT } from "@zk-kit/smt"

const main = async () => {
    const bench = new Bench({ name: "Merkle Tree Benchmarks", time: 0, iterations: 100 })
    // const bench = new Bench({ name: "Merkle Tree Benchmarks", time: 0, iterations: 100 })

    const depth = 5
    // let quinaryMerkleTree = new IncrementalQuinTree(depth, 0n, 5, hash5)
    // Array.from({ length: 10 }, (_, i) => quinaryMerkleTree.insert(BigInt(i + 1)))
    let quinaryMerkleTree: IncrementalQuinTree

    // let leanIMT = new LeanIMT((a, b) => hash2([a, b]))
    // leanIMT.insertMany(Array.from({ length: 10 }, (_, i) => BigInt(i + 1)))
    let leanIMT: LeanIMT

    const hashPoseidon = (childNodes) => (childNodes.length === 2 ? hash2(childNodes) : hash3(childNodes))
    // let sparseMerkleTree = new SMT(hashPoseidon, true)
    // Array.from({ length: 10 }, (_, i) => sparseMerkleTree.add(BigInt(i + 1), BigInt(i + 1)))
    let sparseMerkleTree: SMT

    let quinaryMerkleTreeProof: IMerkleProof
    let leanIMTProof: LeanIMTMerkleProof
    let sparseMerkleTreeProof: MerkleProof

    bench
        .add(
            "QuinaryMerkleTree - Insert",
            () => {
                quinaryMerkleTree.insert(200n)
            },
            {
                beforeEach: () => {
                    quinaryMerkleTree = new IncrementalQuinTree(depth, 0n, 5, hash5)
                    Array.from({ length: 10 }, (_, i) => quinaryMerkleTree.insert(BigInt(i + 1)))
                }
            }
        )
        .add(
            "LeanIMT - Insert",
            () => {
                leanIMT.insert(200n)
            },
            {
                beforeEach: () => {
                    leanIMT = new LeanIMT((a, b) => hash2([a, b]))
                    leanIMT.insertMany(Array.from({ length: 10 }, (_, i) => BigInt(i + 1)))
                }
            }
        )
        .add(
            "Sparse Merkle Tree - Insert",
            () => {
                sparseMerkleTree.add(200n, 200n)
            },
            {
                beforeEach: () => {
                    sparseMerkleTree = new SMT(hashPoseidon, true)
                    Array.from({ length: 10 }, (_, i) => sparseMerkleTree.add(BigInt(i + 1), BigInt(i + 1)))
                }
            }
        )
        .add(
            "QuinaryMerkleTree - Update",
            () => {
                quinaryMerkleTree.update(0, 200n)
            },
            {
                beforeEach: () => {
                    quinaryMerkleTree = new IncrementalQuinTree(depth, 0n, 5, hash5)
                    Array.from({ length: 10 }, (_, i) => quinaryMerkleTree.insert(BigInt(i + 1)))
                }
            }
        )
        .add(
            "LeanIMT - Update",
            () => {
                leanIMT.update(0, 200n)
            },
            {
                beforeEach: () => {
                    leanIMT = new LeanIMT((a, b) => hash2([a, b]))
                    leanIMT.insertMany(Array.from({ length: 10 }, (_, i) => BigInt(i + 1)))
                }
            }
        )
        .add(
            "SparseMerkleTree - Update",
            () => {
                sparseMerkleTree.update(1n, 300n)
            },
            {
                beforeEach: () => {
                    sparseMerkleTree = new SMT(hashPoseidon, true)
                    Array.from({ length: 10 }, (_, i) => sparseMerkleTree.add(BigInt(i + 1), BigInt(i + 1)))
                }
            }
        )
        .add(
            "QuinaryMerkleTree - Generate Proof",
            () => {
                quinaryMerkleTreeProof = quinaryMerkleTree.genProof(0)
            },
            {
                beforeAll: () => {
                    quinaryMerkleTree = new IncrementalQuinTree(depth, 0n, 5, hash5)
                    Array.from({ length: 10 }, (_, i) => quinaryMerkleTree.insert(BigInt(i + 1)))
                }
            }
        )
        .add(
            "LeanIMT - Generate Proof",
            () => {
                leanIMTProof = leanIMT.generateProof(0)
            },
            {
                beforeAll: () => {
                    leanIMT = new LeanIMT((a, b) => hash2([a, b]))
                    leanIMT.insertMany(Array.from({ length: 10 }, (_, i) => BigInt(i + 1)))
                }
            }
        )
        .add(
            "SparseMerkleTree - Generate Proof",
            () => {
                sparseMerkleTreeProof = sparseMerkleTree.createProof(1n)
            },
            {
                beforeAll: () => {
                    sparseMerkleTree = new SMT(hashPoseidon, true)
                    Array.from({ length: 10 }, (_, i) => sparseMerkleTree.add(BigInt(i + 1), BigInt(i + 1)))
                }
            }
        )
        .add("QuinaryMerkleTree - Verify Proof", () => {
            quinaryMerkleTree.verifyProof(quinaryMerkleTreeProof)
        })
        .add("LeanIMT - Verify Proof", () => {
            leanIMT.verifyProof(leanIMTProof)
        })
        .add("SparseMerkleTree - Verify Proof", () => {
            sparseMerkleTree.verifyProof(sparseMerkleTreeProof)
        })

    await bench.run()

    console.log(bench.name)
    console.table(bench.table())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
