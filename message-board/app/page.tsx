import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Message } from "@prisma/client"; // Import the type

export default async function MessageBoard() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });

  async function addMessage(formData: FormData) {
    "use server";
    const text = formData.get("text") as string;
    await prisma.message.create({ data: { text } });
    revalidatePath("/");
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Message Board</h1>
      <form action={addMessage} className="flex gap-2 mb-8">
        <input name="text" className="border p-2 flex-grow text-black" placeholder="Type a message..." required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Post</button>
      </form>
      <div className="space-y-2">
      {messages.map((m: Message) => (
        <div key={m.id} className="p-3 bg-gray-100 rounded text-black">
          {m.text}
        </div>
      ))}
      </div>
    </main>
  );
}
