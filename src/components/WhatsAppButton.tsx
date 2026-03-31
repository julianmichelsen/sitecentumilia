import { MessageCircle } from "lucide-react";
import { getConfig } from "@/lib/content";

export default async function WhatsAppButton() {
  const config = await getConfig();
  const phoneNumber = config.whatsapp || "5554999441227";
  const message = "Olá! Gostaria de entender como a metodologia CENTUM pode ajudar meu negócio.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-brand-darker group"
      aria-label="Falar conosco no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      {/* Tooltip on hover */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-brand-dark px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        Fale com um Especialista
      </span>
    </a>
  );
}
