import type { DDB, PDB } from "@/Data/Database";
import { unstable_cache } from "next/cache";
import { AutoBookCard } from "./AutoBookCard";

export async function BookCard({ book, db }:
    { book: { book_id: string, cover: string, author_name: string, book_name: string, is_paid: "0" | "1" }, db: DDB | PDB }) {

    if (book.is_paid === "1") {
        try {
            const Userchap = await unstable_cache(async () => db.UserchapInfo(book.book_id),
                [`UserchapInfo_${book.book_id}`], { revalidate: 86400, tags: [`UserchapInfo_${book.book_id}`] })()
            return <AutoBookCard book={book} userchap={Userchap} />
        } catch {
            return <AutoBookCard book={book} error />
        }
    } else {
        return <AutoBookCard book={book} free />
    }
}