import { PDB } from "./Database";

export const stable = new PDB(process.env.DB_PROXY)

export function UseDB(): [PDB, string] {
    return [stable, "stable"]
}